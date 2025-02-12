import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Restaurant } from './model/restaurant.model';
import { Dish } from './model/dish.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private baseUrl = `${environment.host}/api/restaurants`;

  constructor(private http: HttpClient) {}

  private transformRestaurant(restaurant: any): Restaurant {
    return {
      ...restaurant,
      createdOn: new Date(restaurant.createdOn),
      modifiedOn: new Date(restaurant.modifiedOn),
    };
  }

  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http
      .get<Restaurant[]>(this.baseUrl)
      .pipe(
        map((restaurants: any[]) =>
          restaurants.map((r) => this.transformRestaurant(r))
        )
      );
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http
      .get<Restaurant>(`${this.baseUrl}/${id}`)
      .pipe(map((r) => this.transformRestaurant(r)));
  }

  getDishesByRestaurant(restaurantId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.baseUrl}/${restaurantId}/dishes`);
  }

  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http
      .post<Restaurant>(this.baseUrl, restaurant)
      .pipe(map((r) => this.transformRestaurant(r)));
  }

  updateRestaurant(id: number, restaurant: Restaurant): Observable<Restaurant> {
    return this.http
      .put<Restaurant>(`${this.baseUrl}/${id}`, restaurant)
      .pipe(map((r) => this.transformRestaurant(r)));
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
