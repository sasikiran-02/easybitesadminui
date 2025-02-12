// restaurant.model.ts
import { City } from './city.model';

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  city: City;
  createdOn?: Date; // Alternatively, use string if you want to work with raw ISO dates
  modifiedOn?: Date; // You can convert these to Date objects in your services if necessary
}
