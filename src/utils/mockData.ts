const generateDailyData = (startDate: Date, days: number) => {
  const data = [];
  let weight = 77.0; // Starting weight
  let waterIntake = 2500; // Starting water intake

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);

    // Add some random daily variations
    weight += (Math.random() - 0.5) * 0.4; // Daily weight fluctuates by ±0.2kg
    waterIntake += (Math.random() - 0.5) * 400; // Daily water intake fluctuates by ±200ml

    data.push({
      date: date.toISOString(),
      weight: Number(weight.toFixed(1)),
      bmi: Number((weight / (1.75 * 1.75)).toFixed(1)), // Assuming height of 1.75m
      waterIntake: Math.round(waterIntake),
    });
  }
  return data;
};

const dailyData = generateDailyData(new Date(), 30); // Generate 30 days of data

export const mockMeasurements = dailyData.map(({ date, weight, bmi }) => ({
  created_at: date,
  weight,
  bmi,
}));

export const mockWaterIntake = dailyData.map(({ date, waterIntake }) => ({
  created_at: date,
  amount: waterIntake,
}));

export const mockInsights = {
  trends: `Your weight has shown a positive trend, decreasing by ${(mockMeasurements[0].weight - mockMeasurements[6].weight).toFixed(1)}kg over the past week. Your water intake has been consistent, averaging ${Math.round(mockWaterIntake.slice(0, 7).reduce((acc, curr) => acc + curr.amount, 0) / 7)}ml per day.

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