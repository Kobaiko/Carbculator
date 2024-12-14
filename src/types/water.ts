export interface WaterGoal {
  target: number; // in milliliters
  consumed: number;
}

export interface WaterEntry {
  id: string;
  timestamp: string;
  amount: number; // in milliliters
}