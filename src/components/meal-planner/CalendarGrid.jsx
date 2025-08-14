import React from 'react';
import { motion } from 'framer-motion';
import DayCard from '@/components/meal-planner/DayCard';

const CalendarGrid = ({ weekDays, mealPlan, mealTypes, handleDrop, getDayMeals, removeMealFromSlot, calculateDayNutrition, handleDragOver }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {weekDays.map((day, dayIndex) => (
        <motion.div
          key={dayIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
        >
          <DayCard
            day={day}
            mealPlan={mealPlan}
            mealTypes={mealTypes}
            handleDrop={handleDrop}
            getDayMeals={getDayMeals}
            removeMealFromSlot={removeMealFromSlot}
            calculateDayNutrition={calculateDayNutrition}
            handleDragOver={handleDragOver}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CalendarGrid;