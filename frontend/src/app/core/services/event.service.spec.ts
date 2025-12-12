import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { API_CONFIG } from '../config/api.config';

describe('EventService', () => {
    let service: EventService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EventService]
        });
        service = TestBed.inject(EventService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch events from API', () => {
        const mockEvents = [
            { id: 1, title: 'Event 1', category: 'Music' },
            { id: 2, title: 'Event 2', category: 'Food' }
        ];

        service.getEvents().subscribe(events => {
            expect(events.length).toBe(2);
            expect(events).toEqual(mockEvents as any);
        });

        const req = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.events}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockEvents);
    });

    it('should use cache for subsequent requests', () => {
        const mockEvents = [{ id: 1, title: 'Event 1' }];

        // First request
        service.getEvents().subscribe();
        const req1 = httpMock.expectOne(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.events}`);
        req1.flush(mockEvents);

        // Second request (should use cache)
        service.getEvents().subscribe(events => {
            expect(events).toEqual(mockEvents as any);
        });

        httpMock.expectNone(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.events}`);
    });
});
