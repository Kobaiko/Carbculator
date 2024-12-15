import { FoodEntriesTable } from './food-entries.types';
import { ProfilesTable } from './profiles.types';
import { WaterEntriesTable } from './water-entries.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      food_entries: FoodEntriesTable;
      profiles: ProfilesTable;
      water_entries: WaterEntriesTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}