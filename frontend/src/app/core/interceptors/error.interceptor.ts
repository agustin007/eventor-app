import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error) => {
            let message = 'Ha ocurrido un error inesperado';

            if (error.status === 401) {
                message = 'Sesión expirada o credenciales inválidas';
            } else if (error.status === 403) {
                message = 'No tienes permisos para realizar esta acción';
            } else if (error.status === 0) {
                message = 'Error de conexión con el servidor';
            } else if (error.error?.message) {
                message = error.error.message;
            }

            toastService.error(message);
            return throwError(() => error);
        })
    );
};
