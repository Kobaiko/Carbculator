export interface ProfilesTable {
  Row: {
    id: string;
    height: number | null;
    weight: number | null;
    height_unit: string;
    weight_unit: string;
    daily_calories: number;
    daily_protein: number;
    daily_carbs: number;
    daily_fats: number;
    daily_water: number;
    created_at: string;
    updated_at: string;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  Insert: {
    id: string;
    height?: number | null;
    weight?: number | null;
    height_unit?: string;
    weight_unit?: string;
    daily_calories?: number;
    daily_protein?: number;
    daily_carbs?: number;
    daily_fats?: number;
    daily_water?: number;
    created_at?: string;
    updated_at?: string;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  };
  Update: {
    id?: string;
    height?: number | null;
    weight?: number | null;
    height_unit?: string;
    weight_unit?: string;
    daily_calories?: number;
    daily_protein?: number;
    daily_carbs?: number;
    daily_fats?: number;
    daily_water?: number;
    created_at?: string;
    updated_at?: string;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  };
}