import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  debugger;
  const authService = inject(AuthService); // ✅ Dynamically inject AuthService
  const token = localStorage.getItem('authToken'); // ✅ Retrieve token dynamically
  const authUrl = `${environment.host}/api/v1/auth/authenticate`;

  console.log('Intercepting request to:', req.url);

  // ✅ Skip adding the token for authentication requests
  if (req.url === authUrl) {
    console.log('Skipping Authorization header for authentication request.');
    return next(req);
  }

  // ✅ Add Authorization header if token exists
  if (token) {
    console.log('Adding Authorization header. Token:', token);
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  console.log('No token found. Sending request without Authorization header.');
  return next(req);
};
