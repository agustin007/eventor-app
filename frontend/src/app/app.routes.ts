import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
            { path: 'home', redirectTo: '', pathMatch: 'full' },
            {
                path: 'events',
                loadChildren: () => import('./features/events/events.routes').then(m => m.EVENTS_ROUTES)
            },
            { path: 'discover', redirectTo: 'events/discover' }, // Alias for discover
            {
                path: 'user',
                loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES),
                canActivate: [authGuard]
            },
            // Legacy / Alias Routes used in existing components
            { path: 'dashboard', redirectTo: 'user/dashboard' },
            { path: 'profile', redirectTo: 'user/profile' },
            { path: 'tickets', redirectTo: 'user/tickets' }
        ]
    },
    { path: '**', redirectTo: '' }
];
