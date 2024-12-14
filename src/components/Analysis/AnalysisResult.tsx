import React from 'react';
import { MacroDisplay } from './MacroDisplay';
import { MacroChart } from './MacroChart';
import type { FoodAnalysis } from '../../types/food';

interface AnalysisResultProps {
  analysis: FoodAnalysis;
  imageUrl: string;
}

export function AnalysisResult({ analysis, imageUrl }: AnalysisResultProps) {
  return (
    <div className="bg-white dark:bg-brand-800/50 rounded-lg shadow-sm p-6 transition-colors">
      <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
        <img
          src={imageUrl}
          alt="Analyzed meal"
          className="object-cover w-full h-full"
        />
      </div>
      
      <p className="text-brand-700 dark:text-brand-300 text-lg text-center mb-6">
        {analysis.description}
      </p>
      
      <div className="space-y-8">
        <MacroDisplay macros={analysis.macros} />
        
        <div className="pt-4 border-t border-brand-100 dark:border-brand-700">
          <h3 className="text-brand-700 dark:text-brand-300 text-center font-medium mb-4">
            Caloric Distribution
          </h3>
          <MacroChart macros={analysis.macros} />
        </div>
      </div>
    </div>
  );
}