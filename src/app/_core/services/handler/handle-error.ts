import { Observable, throwError } from 'rxjs';

export function handleError(error: any): Observable<never> {
  let errorMessage = 'Ocurrió un error desconocido';

  if (error.name === 'TimeoutError') {
    errorMessage = 'La solicitud tardó demasiado. Inténtalo de nuevo.';
  } else if (error.error instanceof ErrorEvent) {
    errorMessage = `Error: ${error.error.message}`;
  } else {
    switch (error.status) {
      case 404:
        errorMessage = 'No se encontraron elementos con esos criterios';
        break;
      case 500:
        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        break;
      case 0:
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        break;
      case 429:
        errorMessage = 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';
        break;
      default:
        errorMessage = `Error ${error.status}: ${error.message || 'Error de conexión'}`;
    }
  }

  console.error('Error:', errorMessage, error);
  return throwError(() => new Error(errorMessage));
}