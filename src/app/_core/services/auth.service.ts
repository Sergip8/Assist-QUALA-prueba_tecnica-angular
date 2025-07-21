import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';



import { User } from '../../models/user.model';
import { LoginRequest, RegisterRequest, UserRegistrationData } from '../../models/login.model';
import { ApiRequest } from '../../models/api.model';
import { LoginResponse } from '../../models/login-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private baseUrl = `${environment.API_URL}/session`;
  
  // Subjects para mantener el estado de la autenticación en memoria.
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    // Inyectamos PLATFORM_ID para poder diferenciar entre el entorno del servidor y el navegador.
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Al inicializar el servicio, intentamos cargar el estado de autenticación
    // solo si estamos en el navegador.
    this.loadAuthFromStorage();
  }

  /**
   * Comprueba si el código se está ejecutando en un entorno de navegador.
   * @returns {boolean} True si está en el navegador, false si está en el servidor.
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Carga el token y el usuario desde localStorage/sessionStorage al iniciar la aplicación.
   * Esta función está protegida para ejecutarse solo en el navegador.
   */
  private loadAuthFromStorage(): void {
    if (!this.isBrowser()) {
      return; // No hacer nada si estamos en el servidor.
    }

    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user') || sessionStorage.getItem('current_user');
    
    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al parsear los datos del usuario almacenado:', error);
        this.clearAuthStorage(); // Limpiar almacenamiento si los datos son corruptos.
      }
    }
  }

  /**
   * Almacena la información de autenticación (token y usuario).
   * Se ejecuta solo en el navegador.
   * @param response La respuesta de la API de autenticación.
   * @param rememberMe Si se debe usar localStorage (persistente) o sessionStorage.
   */
  private storeAuth(response: LoginResponse, rememberMe: boolean = false): void {
   
    
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('auth_token', response.token);
    storage.setItem('current_user', JSON.stringify(response.user));
    
 
  }

  /**
   * Limpia toda la información de autenticación del almacenamiento.
   * Se ejecuta solo en el navegador.
   */
  private clearAuthStorage(): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('current_user');
    sessionStorage.removeItem('refresh_token');
  }

  /**
   * Registra un nuevo usuario.
   */
  register(data: RegisterRequest): Observable<ApiRequest<UserRegistrationData>> {
    return this.http.post<ApiRequest<UserRegistrationData>>(`${this.baseUrl}/register`, data)
      .pipe(
        catchError(error => {
          console.error('Error en el registro:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Inicia sesión.
   */
  login(data: LoginRequest): Observable<ApiRequest<LoginResponse>> {
    return this.http.post<ApiRequest<LoginResponse>>(`${this.baseUrl}/login`, data)
      .pipe(
        tap(response => {
          this.storeAuth(response.data, data.rememberMe || false);
          this.tokenSubject.next(response.data.token);
          this.currentUserSubject.next(response.data.user);
        }),
        catchError(error => {
          console.error('Error en el inicio de sesión:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    // Opcional: notificar al backend sobre el cierre de sesión.
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe({
      next: () => console.log('Logout en el servidor exitoso.'),
      error: (error) => console.error('Error en el logout del servidor:', error)
    });

    // Limpiar el estado en memoria.
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    
    // Limpiar el almacenamiento del navegador.
    this.clearAuthStorage();
    
    // Redirigir al login solo si estamos en el navegador.
    if (this.isBrowser()) {
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Verifica si el usuario está autenticado basándose en el estado en memoria.
   */
  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  /**
   * Obtiene el token de autenticación actual.
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Obtiene el usuario actualmente autenticado.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Devuelve el rol del usuario autenticado, o null si no hay usuario.
   */
  getRole(): string[] | null {
    const user = this.getCurrentUser();
    return user && user.rol ? [user?.rol] : null; 
  }

  /**
   * Valida el token actual contra la API.
   */
  validateToken() {
    if (!this.getToken()) {
      return of(false);
    }

    return this.http.get<{ valid: boolean }>(`${this.baseUrl}/validate-token`)
      .pipe(
        tap(response => {
          if (!response.valid) {
            this.logout();
          }
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  /**
   * Refresca el token de autenticación usando el refresh token.
   */
  refreshToken(): Observable<LoginResponse> {
    if (!this.isBrowser()) {
      return throwError(() => new Error('La renovación de token no está disponible en el servidor.'));
    }

    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No hay refresh token disponible.'));
    }

    return this.http.post<LoginResponse>(`${this.baseUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap(response => {
          const rememberMe = !!localStorage.getItem('auth_token');
          this.storeAuth(response, rememberMe);
          this.tokenSubject.next(response.token);
        }),
        catchError(error => {
          console.error('Error al renovar el token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Solicita la recuperación de contraseña.
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, { email });
  }

  /**
   * Restablece la contraseña usando un token.
   */
  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/reset-password`, { token, password });
  }
}
