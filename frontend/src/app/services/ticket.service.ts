import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Ticket {
  id: number;
  eventId: number;
  eventTitle: string;
  eventDate: Date;
  qrCode: string;
  pricePaid: number;
  isUsed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5256/api/tickets';

  constructor(private http: HttpClient, private authService: AuthService) { }

  purchaseTicket(eventId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/purchase`, { eventId }, { headers });
  }

  getMyTickets(): Observable<Ticket[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Ticket[]>(`${this.apiUrl}/my-tickets`, { headers });
  }
}
