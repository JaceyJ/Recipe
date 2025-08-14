import React from 'react';
import { Target, Zap } from 'lucide-react';

const NutritionSummary = ({ nutrition }) => {
  return (
    <div className="nutrition-card mt-4">
      <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
        <Target className="w-3 h-3" />
        Daily Totals
      </h4>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-orange-500" />
          <span>{nutrition.calories} cal</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span>{nutrition.protein}g protein</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>{nutrition.carbs}g carbs</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span>{nutrition.fat}g fat</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;