import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    const url = `${environment.apiUrl}auth/login`;
    return this.http.post<{ access_token: string, roles:[
      { id: number, name: string }
    ] }>(url, { email, password }).pipe(
      map(response => {
        console.log(response)
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          this.loggedIn = true;
          return true;
        } else {
          return false;
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn = false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}