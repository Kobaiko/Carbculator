import React from 'react';
import type { FoodAnalysis } from '../../../types/food';
import { MacroDisplay } from '../../Analysis/MacroDisplay';
import { MacroChart } from '../../Analysis/MacroChart';

interface CurrentAnalysisProps {
  imageUrl: string;
  analysis: FoodAnalysis;
}

export function CurrentAnalysis({ imageUrl, analysis }: CurrentAnalysisProps) {
  return (
    <div className="bg-white dark:bg-brand-800/50 rounded-lg p-6 space-y-6">
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt="Analyzed meal"
          className="object-cover w-full h-full"
        />
      </div>
      
      <p className="text-brand-700 dark:text-brand-300 text-lg text-center">
        {analysis.description}
      </p>
      
      <MacroDisplay macros={analysis.macros} />
      
      <div className="pt-6 border-t border-brand-100 dark:border-brand-700">
        <h3 className="text-brand-700 dark:text-brand-300 text-center font-medium mb-4">
          Macronutrient Distribution
        </h3>
        <MacroChart macros={analysis.macros} />
      </div>
    </div>
  );
}