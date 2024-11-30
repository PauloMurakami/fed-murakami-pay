import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CalendarData {
    id?: number;
    type: string;
    status: string;
    visibility: string;
    expirated_at: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    private apiUrl = `${environment.apiUrl}calendar`;

    constructor(private http: HttpClient) { }

    getCalendars(): Observable<CalendarData[]> {
        return this.http.get<CalendarData[]>(this.apiUrl);
    }

    getCalendarsToday(): Observable<CalendarData[]> {
        return this.http.get<CalendarData[]>(this.apiUrl + '/today');
    }

    createCalendar(data: CalendarData): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.post(this.apiUrl, data, { headers });
    }

    updateCalendar(data: CalendarData): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.patch(`${this.apiUrl}/${data.id}`, data, { headers });
    }

    markAsComplete(id: number): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.patch(`${this.apiUrl}concluido/${id}`, { headers });
    }

    deleteCalendar(id: number): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
    }
}