import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'discover', component: DiscoverComponent },
            { path: 'events/:id', component: EventDetailComponent },
            { path: 'tickets', component: TicketsComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'profile', component: ProfileComponent }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
