import React from 'react';
import { motion } from 'framer-motion';

const DraggableMeal = ({ meal, onDragStart }) => {
  return (
    <motion.div
      draggable
      onDragStart={(e) => onDragStart(e, meal)}
      className="meal-item bg-gradient-to-r from-emerald-200 to-teal-200 border-emerald-400 p-3 rounded-lg shadow-lg cursor-move flex flex-col items-center"
      layoutId={`pending-meal-${meal.id}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileDrag={{ scale: 1.1, zIndex: 10, rotate: 3, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
    >
      <div className="font-bold text-sm text-emerald-900">{meal.name}</div>
      <div className="text-xs text-emerald-800">{meal.calories} cal</div>
    </motion.div>
  );
};

export default DraggableMeal;