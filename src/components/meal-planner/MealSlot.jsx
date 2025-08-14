import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple } from 'lucide-react';

const MealSlot = ({ day, mealType, meals, onDrop, onDragOver, onRemoveMeal }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    setIsDragOver(false);
    onDrop(e, day, mealType);
  };

  return (
    <div>
      <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
        <Apple className="w-3 h-3" />
        {mealType}
      </h4>
      <div
        className={`meal-slot ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded p-2 mb-1 shadow-sm border border-gray-100 group hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-xs">{meal.name}</div>
                  <div className="text-xs text-gray-500">
                    {meal.calories * (meal.servings || 1)} cal
                  </div>
                </div>
                <button
                  onClick={() => onRemoveMeal(day, mealType, index)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {meals.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-2">
            Drop meals here
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSlot;