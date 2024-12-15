export interface WaterEntriesTable {
  Row: {
    id: string;
    user_id: string;
    amount: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    amount?: number;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    amount?: number;
    created_at?: string;
  };
}