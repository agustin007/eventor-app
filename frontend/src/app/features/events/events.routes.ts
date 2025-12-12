import { Routes } from '@angular/router';
import { DiscoverComponent } from './discover/discover.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

export const EVENTS_ROUTES: Routes = [
    { path: 'discover', component: DiscoverComponent },
    { path: 'events/:id', component: EventDetailComponent },
    { path: '', redirectTo: 'discover', pathMatch: 'full' }
];
