import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SearchFilters {
    name?: string;
  
    species?: string;
  }

export interface NavigationState {
  filters: SearchFilters;
  currentPage: number;
  pageSize: number;
  totalCharacters: number;
  lastQuery: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly STATE_KEY = 'rick_morty_app_state';
  private readonly STATE_EXPIRY = 30 * 60 * 1000; // 30 minutos

  // Estado de navegación reactivo
  private navigationStateSubject = new BehaviorSubject<NavigationState | null>(null);
  public navigationState$ = this.navigationStateSubject.asObservable();

  constructor() {
    this.loadState();
  }

  /**
   * Guardar estado de navegación
   */
  saveNavigationState(state: Partial<NavigationState>): void {
    const currentState = this.navigationStateSubject.value;
    const newState: NavigationState = {
      filters: state.filters || currentState?.filters || {},
      currentPage: state.currentPage || currentState?.currentPage || 1,
      pageSize: state.pageSize || currentState?.pageSize || 30,
      totalCharacters: state.totalCharacters || currentState?.totalCharacters || 0,
      lastQuery: state.lastQuery || currentState?.lastQuery || '',
      timestamp: Date.now()
    };

    this.navigationStateSubject.next(newState);
    this.persistState(newState);
    console.log('💾 Estado guardado:', newState);
  }

  /**
   * Obtener estado de navegación actual
   */
  getNavigationState(): NavigationState | null {
    return this.navigationStateSubject.value;
  }

  /**
   * Limpiar estado
   */
  clearState(): void {
    this.navigationStateSubject.next(null);
    localStorage.removeItem(this.STATE_KEY);
    console.log('🗑️ Estado limpiado');
  }

  /**
   * Verificar si hay estado válido guardado
   */
  hasValidState(): boolean {
    const state = this.navigationStateSubject.value;
    if (!state) return false;
    
    const isExpired = Date.now() - state.timestamp > this.STATE_EXPIRY;
    if (isExpired) {
      this.clearState();
      return false;
    }
    
    return true;
  }

  /**
   * Restaurar estado desde localStorage
   */
  private loadState(): void {
    try {
      const saved = localStorage.getItem(this.STATE_KEY);
      if (saved) {
        const state: NavigationState = JSON.parse(saved);
        
        // Verificar si no ha expirado
        if (Date.now() - state.timestamp < this.STATE_EXPIRY) {
          this.navigationStateSubject.next(state);
          console.log('📂 Estado restaurado:', state);
        } else {
          localStorage.removeItem(this.STATE_KEY);
          console.log('⏰ Estado expirado, eliminado');
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar estado:', error);
      localStorage.removeItem(this.STATE_KEY);
    }
  }

  /**
   * Persistir estado en localStorage
   */
  private persistState(state: NavigationState): void {
    try {
      localStorage.setItem(this.STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('❌ Error al guardar estado:', error);
    }
  }
}