import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const toastService = inject(ToastService);

    if (authService.isSessionValid()) {
        return true;
    }

    // Usuario no autenticado o sesión expirada
    toastService.error('Debes iniciar sesión para acceder a esta sección');
    authService.logout(); // Limpia storage y redirige
    return false;
};
