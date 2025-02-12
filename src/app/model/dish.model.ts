// src/app/model/dish.model.ts
import { Restaurant } from './restaurant.model';

export interface Dish {
  id: number;
  name: string;
  price: number; // Use a number for price (backend BigDecimal)
  description: string;
  restaurant: Restaurant; // Reference to the Restaurant model
  calories: number;
  ingredients: string;
  picture: string;
  createdOn?: Date; // Will be converted from ISO strings
  modifiedOn?: Date;
}
