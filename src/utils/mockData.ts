export const mockMeasurements = [
  { created_at: '2024-03-20', weight: 75.5, bmi: 23.1 },
  { created_at: '2024-03-19', weight: 75.8, bmi: 23.2 },
  { created_at: '2024-03-18', weight: 76.0, bmi: 23.3 },
  { created_at: '2024-03-17', weight: 76.2, bmi: 23.4 },
  { created_at: '2024-03-16', weight: 76.5, bmi: 23.5 },
  { created_at: '2024-03-15', weight: 76.8, bmi: 23.6 },
  { created_at: '2024-03-14', weight: 77.0, bmi: 23.7 },
].map(m => ({
  ...m,
  created_at: new Date(m.created_at).toISOString()
}));

export const mockWaterIntake = [
  { created_at: '2024-03-20', amount: 2500 },
  { created_at: '2024-03-19', amount: 2300 },
  { created_at: '2024-03-18', amount: 2000 },
  { created_at: '2024-03-17', amount: 2200 },
  { created_at: '2024-03-16', amount: 1800 },
  { created_at: '2024-03-15', amount: 2100 },
  { created_at: '2024-03-14', amount: 2400 },
].map(w => ({
  ...w,
  created_at: new Date(w.created_at).toISOString()
}));

export const mockInsights = {
  trends: `Your weight has shown a positive trend, decreasing by 1.5kg over the past week. Your water intake has been consistent, averaging 2.2L per day.

Keep up the good work with your hydration habits!`,
  recommendations: `1. Consider increasing your water intake slightly to reach the recommended 2.5L per day
2. Try to maintain a consistent meal schedule
3. Add more protein-rich foods to your diet to support muscle maintenance
4. Consider incorporating strength training to improve BMI composition`,
  goals: `Short-term:
- Maintain current weight loss trajectory
- Reach daily water intake target of 2.5L

Long-term:
- Achieve target BMI of 22.5
- Establish sustainable healthy eating habits
- Build a consistent exercise routine`
};