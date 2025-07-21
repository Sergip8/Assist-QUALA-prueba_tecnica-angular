import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap, timeout } from 'rxjs/operators';

import { CacheService } from './cache.service';
import { handleError } from './handler/handle-error';

import { environment } from '../../../environments/environment';
import { Sucursal } from '../../models/sucursal.model';
import { PaginationRequest, PaginationResponse } from '../../models/pagination.model';
import { ApiRequest } from '../../models/api.model';
import { SucursalCreate } from '../../models/sucursal-create.model';
import { SucursalUpdate } from '../../models/sucursal-update.model';

const baseUrl = `${environment.API_URL}/sucursales`;

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getSucursalesPaginated(pagination: PaginationRequest, includeInactive=false): Observable<ApiRequest<PaginationResponse<Sucursal>>> {
    const payloadToString = JSON.stringify(pagination) + includeInactive
    const cacheKey = this.cacheService.generateCacheKey(payloadToString);
    const cachedData = this.cacheService.getFromCache<ApiRequest<PaginationResponse<Sucursal>>>(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }
    this.cacheService.cleanExpiredCache();
    return this.http.post<ApiRequest<PaginationResponse<Sucursal>>>(`${baseUrl}/paginated?includeInactive=${includeInactive}`, pagination)
      .pipe(
        timeout(10000),
        retry(2),
        tap(data => this.cacheService.setCache(cacheKey, data)),
        catchError(handleError)
      );
  }

  createSucursal(sucursal: SucursalCreate): Observable<ApiRequest<Sucursal>> {
    this.cacheService.clearCache(); // Invalidate cache on create
    return this.http.post<ApiRequest<Sucursal>>(baseUrl, sucursal)
      .pipe(
        catchError(handleError)
      );
  }
  updateSucursal(id: number, sucursal: SucursalUpdate): Observable<ApiRequest<Sucursal>> {
    console.log("update", sucursal)
    this.cacheService.clearCache(); // Invalidate cache on create
    return this.http.put<ApiRequest<Sucursal>>(`${baseUrl}/${id}`, sucursal)
      .pipe(
        catchError(handleError)
      );
  }

  deleteSucursal(id: number): Observable<ApiRequest<boolean>> {
    const url = `${baseUrl}/${id}`;
    this.cacheService.clearCache(); // Invalidate cache on delete
    return this.http.delete<ApiRequest<boolean>>(url)
      .pipe(
        catchError(handleError)
      );
  }
}
