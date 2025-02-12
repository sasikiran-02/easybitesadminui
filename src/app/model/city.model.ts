// src/app/model/city.model.ts
export interface City {
  id: number;
  name: string;
  country: string;
  createdOn?: Date; // Dates converted from ISO strings
  modifiedOn?: Date;
}
