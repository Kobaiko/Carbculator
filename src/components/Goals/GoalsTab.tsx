import React, { useState } from 'react';
import { GoalItem } from './GoalItem';
import { WaterGoal } from './WaterGoal';
import type { MacroGoals } from '../../types/goals';
import type { WaterGoal as WaterGoalType } from '../../types/water';

interface GoalsTabProps {
  goals: MacroGoals;
  waterGoal: WaterGoalType;
  onUpdateGoals: (goals: MacroGoals) => void;
  onUpdateWaterGoal: (target: number) => void;
  progress: {
    consumed: MacroGoals;
    remaining: MacroGoals;
  };
}

export function GoalsTab({ 
  goals, 
  waterGoal,
  onUpdateGoals, 
  onUpdateWaterGoal,
  progress 
}: GoalsTabProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState({
    calories: goals.calories,
    protein: goals.protein,
    fat: goals.fat,
    carbs: goals.carbs,
    water: waterGoal.target
  });

  const handleSave = (field: string) => {
    if (field === 'water') {
      onUpdateWaterGoal(editedValues.water);
    } else {
      onUpdateGoals({
        ...goals,
        [field]: editedValues[field as keyof MacroGoals]
      });
    }
    setEditingField(null);
  };

  const macros = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
  ];

  return (
    <div className="grid gap-4">
      {macros.map(({ key, label, unit }) => (
        <GoalItem
          key={key}
          label={label}
          value={goals[key as keyof MacroGoals]}
          unit={unit}
          consumed={progress.consumed[key as keyof MacroGoals]}
          remaining={progress.remaining[key as keyof MacroGoals]}
          isEditing={editingField === key}
          editedValue={editedValues[key as keyof MacroGoals]}
          onEdit={() => setEditingField(key)}
          onSave={() => handleSave(key)}
          onChange={(value) => setEditedValues(prev => ({ ...prev, [key]: value }))}
        />
      ))}

      <WaterGoal
        waterGoal={waterGoal}
        isEditing={editingField === 'water'}
        editedValue={editedValues.water}
        onEdit={() => setEditingField('water')}
        onSave={() => handleSave('water')}
        onChange={(value) => setEditedValues(prev => ({ ...prev, water: value }))}
      />
    </div>
  );
}