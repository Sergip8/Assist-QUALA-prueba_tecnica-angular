import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry, tap, timeout } from 'rxjs';
import { DashboardData } from '../../models/dashboard.model';
import { ApiRequest } from '../../models/api.model';
import { CacheService } from './cache.service';
import { handleError } from './handler/handle-error';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const baseUrl = `${environment.API_URL}/dashboard`;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
 

 constructor(private http: HttpClient, private cacheService: CacheService){}

  getDashboardData(fechaInicio?: string, fechaFin?: string): Observable<ApiRequest<DashboardData>> {
    let finalFechaFin: string;
    let finalFechaInicio: string;

    // Calcular la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    finalFechaFin = fechaFin || `${year}-${month}-${day}`; // Usa la fecha proporcionada o la actual

    // Calcular la fecha de inicio (10 días antes de la fecha de fin)
    const startDate = new Date(finalFechaFin);
    startDate.setDate(startDate.getDate() - 10);
    const startYear = startDate.getFullYear();
    const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const startDay = startDate.getDate().toString().padStart(2, '0');
    finalFechaInicio = fechaInicio || `${startYear}-${startMonth}-${startDay}`; // Usa la fecha proporcionada o 10 días antes

    // Generar una clave única para la caché basada en los parámetros finales
    const cacheKey = this.cacheService.generateCacheKey(`dashboardData-${finalFechaInicio}-${finalFechaFin}`);
    const cachedData = this.cacheService.getFromCache<ApiRequest<DashboardData>>(cacheKey);

    // Si hay datos en caché, devolverlos inmediatamente
    if (cachedData) {
      console.log('Datos del dashboard obtenidos de la caché:', cacheKey);
      return of(cachedData);
    }

    // Limpiar caché expirada antes de hacer una nueva llamada
    this.cacheService.cleanExpiredCache();

    // Construir los parámetros de la URL
    let params = new HttpParams();
    params = params.append('fechaInicio', finalFechaInicio);
    params = params.append('fechaFin', finalFechaFin);

    // Realizar la solicitud GET
    return this.http.get<ApiRequest<DashboardData>>(`${baseUrl}`, { params })
      .pipe(
        timeout(15000), // Aumenta el timeout para dashboards que pueden tardar más
        retry(3),       // Reintentar la solicitud hasta 3 veces si falla
        tap(data => {
          // Guardar los datos en caché si la solicitud fue exitosa
          this.cacheService.setCache(cacheKey, data);
          console.log('Datos del dashboard guardados en caché:', cacheKey);
        }),
        catchError(error => {
          // Manejar errores usando tu función `handleError`
          console.error('Error al obtener los datos del dashboard:', error);
          return handleError(error); // Asegúrate de que handleError devuelva un Observable
        })
      );
  }
}