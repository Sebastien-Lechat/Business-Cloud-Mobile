import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToasterService } from '../toaster/toaster.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  isRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService, private router: Router, private toasterService: ToasterService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { // https://angular-academy.com/angular-jwt/

    const token: any = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.token}`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      req = req.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return next.handle(req).pipe(
      catchError(error => {
        if ((error.name === 'HttpErrorResponse' && error.status === 0 && error.statusText === 'Unknown Error')) {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/auth/login']).then(() => this.toasterService.presentErrorToast('Erreur interne au serveur', { error }));
        } else if (error.status === 401 && error.error.message === 'Not authorized to access to this resource') {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/auth/login']);
        } else if (error.status === 401 && error.error.message === 'Expired Token') {
          return this.handle401Error(req, next);
        } else if (error.status === 401 && error.error.message === 'This token has expired') {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/auth/login']);
        }
        return throwError(error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken()
        .pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            return next.handle(this.addToken(request, token));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            localStorage.removeItem('currentUser');
            this.router.navigate(['/auth/login']);
            return throwError(error);
          }),
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

}
