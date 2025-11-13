import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';// ajusta la ruta

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private api: ApiService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.api.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Token inválido o caducado
          this.api.logoutClientSide();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
