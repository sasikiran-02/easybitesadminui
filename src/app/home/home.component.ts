import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    document.cookie = 'authToken=; Max-Age=-99999999; path=/;';
    this.router.navigate(['/login']); // Redirect to login after logout
  }

  navigateToRestaurants() {
    this.router.navigate(['/restaurants']);
  }

  navigateToDishes() {
    this.router.navigate(['/dishes']);
  }
}
