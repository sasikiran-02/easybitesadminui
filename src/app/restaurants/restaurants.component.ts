// src/app/restaurant/restaurants.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../restaurant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  templateUrl: './restaurants.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  styleUrls: ['./restaurants.component.css'],
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  restaurantForm!: FormGroup;
  selectedRestaurant: Restaurant | null = null;
  showForm: boolean = false;
  errorMessage: string = '';

  // Search term entered by the user.
  searchTerm: string = '';

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getRestaurants();
    this.initializeForm();
  }

  // Getter to return filtered restaurants based on searchTerm.
  get filteredRestaurants(): Restaurant[] {
    if (!this.searchTerm.trim()) {
      return this.restaurants;
    }
    const term = this.searchTerm.toLowerCase();
    return this.restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.address.toLowerCase().includes(term) ||
        (r.city && r.city.name.toLowerCase().includes(term))
    );
  }

  // Create a nested form group for the city.
  initializeForm(): void {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      city: this.fb.group({
        name: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  // Load all restaurants from the backend.
  getRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => (this.restaurants = data),
      error: (err) => (this.errorMessage = 'Error fetching restaurants'),
    });
  }

  // Open the form for adding a new restaurant.
  openForm(): void {
    this.showForm = true;
    this.selectedRestaurant = null;
    this.restaurantForm.reset();
  }

  // Close the form.
  closeForm(): void {
    this.showForm = false;
    this.selectedRestaurant = null;
  }

  // Handle form submission for create/update.
  onSubmit(): void {
    if (this.restaurantForm.invalid) {
      return;
    }
    // restaurantForm.value now has the shape: { name, address, phone, city: { name, country } }
    const restaurantData = this.restaurantForm.value;

    if (this.selectedRestaurant) {
      this.restaurantService
        .updateRestaurant(this.selectedRestaurant.id, restaurantData)
        .subscribe({
          next: (updatedRestaurant) => {
            this.restaurants = this.restaurants.map((r) =>
              r.id === updatedRestaurant.id ? updatedRestaurant : r
            );
            this.closeForm();
          },
          error: (err) => (this.errorMessage = 'Error updating restaurant'),
        });
    } else {
      this.restaurantService.createRestaurant(restaurantData).subscribe({
        next: (newRestaurant) => {
          this.restaurants.push(newRestaurant);
          this.closeForm();
        },
        error: (err) => (this.errorMessage = 'Error creating restaurant'),
      });
    }
  }

  // Populate the form for editing a restaurant.
  editRestaurant(restaurant: Restaurant): void {
    this.selectedRestaurant = restaurant;
    this.showForm = true;
    this.restaurantForm.patchValue({
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      city: {
        name: restaurant.city?.name || '',
        country: restaurant.city?.country || '',
      },
    });
  }

  // Delete a restaurant.
  deleteRestaurant(id: number): void {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.deleteRestaurant(id).subscribe({
        next: () => {
          this.restaurants = this.restaurants.filter((r) => r.id !== id);
        },
        error: (err) => (this.errorMessage = 'Error deleting restaurant'),
      });
    }
  }
}
