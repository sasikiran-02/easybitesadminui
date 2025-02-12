// src/app/dish/dish.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Dish } from '../model/dish.model';
import { DishService } from '../dish.service';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../restaurant.service'; // Service to load available restaurants
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dish',
  standalone: true,
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class DishComponent implements OnInit {
  dishes: Dish[] = [];
  dishForm!: FormGroup;
  selectedDish: Dish | null = null;
  showForm: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';

  // Array of available restaurants loaded from the backend
  restaurants: Restaurant[] = [];

  constructor(
    private dishService: DishService,
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDishes();
    this.getRestaurants();
    this.initializeForm();
  }

  // Returns filtered dishes based on the search term.
  get filteredDishes(): Dish[] {
    if (!this.searchTerm.trim()) {
      return this.dishes;
    }
    const term = this.searchTerm.toLowerCase();
    return this.dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term)) ||
        (d.ingredients && d.ingredients.toLowerCase().includes(term))
    );
  }

  // Initialize the reactive form with dish fields and a restaurant dropdown.
  initializeForm(): void {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      calories: [0, Validators.min(0)],
      ingredients: [''],
      picture: [''],
      restaurant: [null, Validators.required], // Holds the selected Restaurant object
    });
  }

  // Load all dishes from the backend.
  getDishes(): void {
    this.dishService.getAllDishes().subscribe({
      next: (data) => (this.dishes = data),
      error: (err) => (this.errorMessage = 'Error fetching dishes'),
    });
  }

  // Load available restaurants for the dropdown.
  getRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => (this.restaurants = data),
      error: (err) => (this.errorMessage = 'Error fetching restaurants'),
    });
  }

  // Open the form for adding a new dish.
  openForm(): void {
    this.showForm = true;
    this.selectedDish = null;
    this.dishForm.reset();
  }

  // Close the form.
  closeForm(): void {
    this.showForm = false;
    this.selectedDish = null;
  }

  // Handle form submission for creating or updating a dish.
  onSubmit(): void {
    if (this.dishForm.invalid) {
      return;
    }
    const formValue = this.dishForm.value;
    // Build the Dish object with nested restaurant details.
    const dishData: Dish = {
      id: 0, // Dummy value; backend will assign the actual ID on creation.
      name: formValue.name,
      price: formValue.price,
      description: formValue.description,
      calories: formValue.calories,
      ingredients: formValue.ingredients,
      picture: formValue.picture,
      createdOn: new Date(), // Placeholder values; typically set by the backend.
      modifiedOn: new Date(),
      restaurant: formValue.restaurant, // The selected Restaurant object from the dropdown.
    };

    if (this.selectedDish) {
      // Update existing dish.
      this.dishService.updateDish(this.selectedDish.id, dishData).subscribe({
        next: (updatedDish) => {
          this.dishes = this.dishes.map((d) =>
            d.id === updatedDish.id ? updatedDish : d
          );
          this.closeForm();
        },
        error: (err) => (this.errorMessage = 'Error updating dish'),
      });
    } else {
      // Create new dish: Pass only one argument.
      this.dishService.createDish(dishData).subscribe({
        next: (newDish) => {
          this.dishes.push(newDish);
          this.closeForm();
        },
        error: (err) => (this.errorMessage = 'Error creating dish'),
      });
    }
  }

  // Populate the form for editing an existing dish.
  editDish(dish: Dish): void {
    this.selectedDish = dish;
    this.showForm = true;
    this.dishForm.patchValue({
      name: dish.name,
      price: dish.price,
      description: dish.description,
      calories: dish.calories,
      ingredients: dish.ingredients,
      picture: dish.picture,
      restaurant: dish.restaurant, // Set the full restaurant object in the dropdown.
    });
  }

  // Delete a dish.
  deleteDish(id: number): void {
    if (confirm('Are you sure you want to delete this dish?')) {
      this.dishService.deleteDish(id).subscribe({
        next: () => {
          this.dishes = this.dishes.filter((d) => d.id !== id);
        },
        error: (err) => (this.errorMessage = 'Error deleting dish'),
      });
    }
  }
}
