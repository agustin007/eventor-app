import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const toastService = inject(ToastService);

    // Clone request to add auth header if token exists
    const token = authService.getToken();
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Ignorar 401 en login/login (credenciales invalidas)
                if (!req.url.includes('/login')) {
                    toastService.error('Tu sesión ha expirado. Por favor ingresa nuevamente.');
                    authService.logout();
                }
            }
            return throwError(() => error);
        })
    );
};
