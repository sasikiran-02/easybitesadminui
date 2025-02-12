// src/app/dish.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dish } from './model/dish.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  // Base URL matching your backend Dish controller endpoint
  private baseUrl = `${environment.host}/api/dishes`;

  constructor(private http: HttpClient) {}

  // Helper method to convert date strings returned from the backend into Date objects
  private transformDish(dish: any): Dish {
    return {
      ...dish,
      createdOn: new Date(dish.createdOn),
      modifiedOn: new Date(dish.modifiedOn),
    };
  }

  // GET all dishes
  getAllDishes(): Observable<Dish[]> {
    return this.http
      .get<Dish[]>(this.baseUrl)
      .pipe(map((dishes: any[]) => dishes.map((d) => this.transformDish(d))));
  }

  // GET a dish by ID
  getDishById(id: number): Observable<Dish> {
    return this.http
      .get<Dish>(`${this.baseUrl}/${id}`)
      .pipe(map((d) => this.transformDish(d)));
  }

  // POST: Create a new dish. The dish object includes nested restaurant details.
  createDish(dish: Dish): Observable<Dish> {
    return this.http
      .post<Dish>(this.baseUrl, dish)
      .pipe(map((d) => this.transformDish(d)));
  }

  // PUT: Update an existing dish.
  updateDish(dishId: number, dish: Dish): Observable<Dish> {
    return this.http
      .put<Dish>(`${this.baseUrl}/${dishId}`, dish)
      .pipe(map((d) => this.transformDish(d)));
  }

  // DELETE: Delete a dish by ID.
  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
