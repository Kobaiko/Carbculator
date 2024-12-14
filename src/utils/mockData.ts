const generateDailyData = (startDate: Date, days: number) => {
  const data = [];
  let weight = 77.0;
  let waterIntake = 2500;
  let calories = 2000;
  let protein = 80;
  let carbs = 250;
  let fat = 65;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);

    // Add some random daily variations
    weight += (Math.random() - 0.5) * 0.4;
    waterIntake += (Math.random() - 0.5) * 400;
    calories += (Math.random() - 0.5) * 200;
    protein += (Math.random() - 0.5) * 10;
    carbs += (Math.random() - 0.5) * 30;
    fat += (Math.random() - 0.5) * 8;

    data.push({
      date: date.toISOString(),
      weight: Number(weight.toFixed(1)),
      bmi: Number((weight / (1.75 * 1.75)).toFixed(1)),
      waterIntake: Math.round(waterIntake),
      nutrition: {
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
      }
    });
  }
  return data;
};

const dailyData = generateDailyData(new Date(), 7); // Generate 7 days of data

export const mockMeasurements = dailyData.map(({ date, weight, bmi }) => ({
  created_at: date,
  weight,
  bmi,
}));

export const mockWaterIntake = dailyData.map(({ date, waterIntake }) => ({
  created_at: date,
  amount: waterIntake,
}));

export const mockNutrition = dailyData.map(({ date, nutrition }) => ({
  created_at: date,
  ...nutrition,
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