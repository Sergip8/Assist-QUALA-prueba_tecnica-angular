import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {Inject, Injectable, inject} from "@angular/core";
import {catchError, Observable, retry, throwError, timer} from "rxjs";
import { Router } from "@angular/router";
import { AlertService } from "../services/alert.service";

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(private alert: AlertService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    
    return next.handle(request).pipe(
      retry({
        count: 3, delay: (errors: HttpErrorResponse, retryCount) =>
          this.shouldRetry(errors, retryCount)
      }),
      catchError((errors: HttpErrorResponse) => {
        let errorMessage = "The server is not ready to process your request.";

        if (errors.status != 0)
          errorMessage = errors.error.title;

        if (errors.status >= 400 && errors.status <= 415){
          this.router.navigate(['unauthorized']);
          return throwError(() => this.handleFormErrors(errors.error.message));

        }
        
        this.alert.error(errorMessage, 'error');

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private shouldRetry(errors: HttpErrorResponse, retryCount: number) {
    if (errors.status == 400)
      return throwError(() => errors);

    return timer(retryCount * 1000);
  }

  private handleFormErrors(errors: string[]) {
    let errorMessages: any = {};

    errors.forEach((err: string) => {
          this.alert.error(
          err,
          'error'
        );
    });

    return errorMessages;
  }
}

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router: Router = inject(Router);
  const alert:AlertService = inject(AlertService)
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 0:
          console.log("Network error");
          break;
        case 400:
          console.log("400 Bad Request. Server cannot process the request: " + err.message);
          break;
        case 401:
          router.navigateByUrl("unauthorized");
          console.log("401 Authentication Error");
          break;
        case 403:
          router.navigateByUrl("forbidden");
          console.log("403 Authentication Error");
          break;
        case 500:
          console.log("500 Internal Server Error");
          break;
        default:
            alert.error(err.error?.message, 'error');
          console.log(err.url);
          console.log(err.status + ", " + err.statusText);
          break;
      }
      //router.navigateByUrl("unauthorized");
      return throwError(() => new Error('An error occurred. Please try again later. '));
    })
  );
} 