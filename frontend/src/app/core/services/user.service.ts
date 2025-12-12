import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getMyTickets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/tickets/my-tickets`);
    }

    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
    }

    getMyEvents(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/dashboard/events`);
    }

    getProfile(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/profile`);
    }
}
