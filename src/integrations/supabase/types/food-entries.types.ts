export interface FoodEntriesTable {
  Row: {
    calories: number;
    carbs: number;
    created_at: string;
    fats: number;
    health_score: number;
    id: string;
    image_url: string | null;
    ingredients: string[];
    name: string;
    protein: number;
    quantity: number;
    user_id: string;
  };
  Insert: {
    calories: number;
    carbs: number;
    created_at?: string;
    fats: number;
    health_score: number;
    id?: string;
    image_url?: string | null;
    ingredients: string[];
    name: string;
    protein: number;
    quantity?: number;
    user_id: string;
  };
  Update: {
    calories?: number;
    carbs?: number;
    created_at?: string;
    fats?: number;
    health_score?: number;
    id?: string;
    image_url?: string | null;
    ingredients?: string[];
    name?: string;
    protein?: number;
    quantity?: number;
    user_id?: string;
  };
}