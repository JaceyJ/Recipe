import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MealSlot from '@/components/meal-planner/MealSlot';
import NutritionSummary from '@/components/meal-planner/NutritionSummary';

const DayCard = ({ day, mealTypes, getDayMeals, handleDrop, handleDragOver, removeMealFromSlot, calculateDayNutrition }) => {
  const dayNutrition = calculateDayNutrition(day);

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-center">
          <div className="font-bold text-gray-800">
            {day.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className="text-sm font-normal text-gray-600">
            {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mealTypes.map(mealType => (
          <MealSlot
            key={mealType}
            day={day}
            mealType={mealType}
            meals={getDayMeals(day, mealType)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onRemoveMeal={removeMealFromSlot}
          />
        ))}
        <NutritionSummary nutrition={dayNutrition} />
      </CardContent>
    </Card>
  );
};

export default DayCard;