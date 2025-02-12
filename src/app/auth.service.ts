import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.host}/api/v1/auth/authenticate`;
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // Send login credentials and store the token in localStorage
  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.authUrl, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
      })
    );
  }

  // Retrieve the stored JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Logout method (removes the token from localStorage)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
