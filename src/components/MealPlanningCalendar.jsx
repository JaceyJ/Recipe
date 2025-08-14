import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MealSelectionDialog from '@/components/meal-planner/MealSelectionDialog';
import CalendarGrid from '@/components/meal-planner/CalendarGrid';
import DraggableMeal from '@/components/meal-planner/DraggableMeal';
import ShoppingList from '@/components/meal-planner/ShoppingList';

const PREDEFINED_MEALS = [
  { id: 'pre-1', name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 15, fat: 18, ingredients: ['Chicken Breast', 'Lettuce', 'Tomato', 'Cucumber', 'Olive Oil'] },
  { id: 'pre-2', name: 'Salmon with Quinoa', calories: 450, protein: 30, carbs: 40, fat: 20, ingredients: ['Salmon Fillet', 'Quinoa', 'Broccoli', 'Lemon'] },
  { id: 'pre-3', name: 'Greek Yogurt Bowl', calories: 280, protein: 20, carbs: 35, fat: 8, ingredients: ['Greek Yogurt', 'Granola', 'Honey', 'Berries'] },
  { id: 'pre-4', name: 'Avocado Toast', calories: 320, protein: 12, carbs: 30, fat: 22, ingredients: ['Avocado', 'Whole Wheat Bread', 'Red Pepper Flakes', 'Salt'] },
  { id: 'pre-5', name: 'Protein Smoothie', calories: 250, protein: 25, carbs: 20, fat: 10, ingredients: ['Protein Powder', 'Banana', 'Almond Milk', 'Spinach'] },
  { id: 'pre-6', name: 'Turkey Wrap', calories: 380, protein: 28, carbs: 35, fat: 15, ingredients: ['Turkey Slices', 'Tortilla', 'Lettuce', 'Cheese'] },
  { id: 'pre-7', name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 55, fat: 7, ingredients: ['Oats', 'Berries', 'Cinnamon', 'Maple Syrup'] },
  { id: 'pre-8', name: 'Lentil Soup', calories: 250, protein: 15, carbs: 45, fat: 2, ingredients: ['Lentils', 'Carrots', 'Celery', 'Onion', 'Vegetable Broth'] },
];

const MealPlanningCalendar = () => {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mealPlan, setMealPlan] = useState({});
  const [customMeals, setCustomMeals] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingMeals, setPendingMeals] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const savedCustomMeals = localStorage.getItem('customMeals');
    setCustomMeals(savedCustomMeals ? JSON.parse(savedCustomMeals) : []);

    const savedMealPlan = localStorage.getItem('mealPlan');
    if (savedMealPlan) setMealPlan(JSON.parse(savedMealPlan));
  }, []);

  useEffect(() => {
    localStorage.setItem('customMeals', JSON.stringify(customMeals));
  }, [customMeals]);

  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const getWeekDays = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const getDayMeals = (date, mealType) => {
    const dateKey = formatDate(date);
    return mealPlan[dateKey]?.[mealType] || [];
  };

  const calculateDayNutrition = (date) => {
    const dateKey = formatDate(date);
    const dayMeals = mealPlan[dateKey] || {};
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    Object.values(dayMeals).flat().forEach(meal => {
      totals.calories += meal.calories * (meal.servings || 1);
      totals.protein += meal.protein * (meal.servings || 1);
      totals.carbs += meal.carbs * (meal.servings || 1);
      totals.fat += meal.fat * (meal.servings || 1);
    });

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat)
    };
  };

  const handleMealSelect = (meal) => {
    setPendingMeals(prev => [...prev, { ...meal, id: Date.now() + Math.random(), servings: 1 }]);
  };

  const handleDragStart = (e, meal) => {
    setDraggedItem(meal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, date, mealType) => {
    e.preventDefault();
    if (!draggedItem) return;

    const dateKey = formatDate(date);
    setMealPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      if (!newPlan[dateKey]) newPlan[dateKey] = {};
      if (!newPlan[dateKey][mealType]) newPlan[dateKey][mealType] = [];
      newPlan[dateKey][mealType].push({ ...draggedItem, id: Date.now() });
      return newPlan;
    });

    setPendingMeals(prev => prev.filter(m => m.id !== draggedItem.id));
    setDraggedItem(null);

    toast({
      title: "Meal Added! 🍽️",
      description: `${draggedItem.name} added to ${mealType}`,
    });
  };

  const addNewMeal = (meal) => {
    setCustomMeals(prev => [...prev, meal]);
    toast({
      title: "New Meal Added! 🎉",
      description: `${meal.name} is now available for planning`,
    });
  };

  const removeMealFromSlot = (date, mealType, mealIndex) => {
    const dateKey = formatDate(date);
    setMealPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      if (newPlan[dateKey]?.[mealType]) {
        newPlan[dateKey][mealType].splice(mealIndex, 1);
      }
      return newPlan;
    });
  };

  const weekDays = getWeekDays();
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const weeklyShoppingList = useMemo(() => {
    const ingredients = new Set();
    weekDays.forEach(day => {
      const dateKey = formatDate(day);
      const dayMeals = mealPlan[dateKey] || {};
      Object.values(dayMeals).flat().forEach(meal => {
        if (meal.ingredients) {
          meal.ingredients.forEach(ingredient => ingredients.add(ingredient));
        }
      });
    });
    return Array.from(ingredients);
  }, [mealPlan, currentWeek]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Calendar className="text-emerald-600" />
            Meal Planning Calendar
          </h1>
          <p className="text-gray-600">Plan your weekly meals and track nutrition effortlessly</p>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))} variant="outline">Prev</Button>
            <Button onClick={() => setCurrentWeek(new Date())} variant="outline">Today</Button>
            <Button onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))} variant="outline">Next</Button>
          </div>
          <MealSelectionDialog
            predefinedMeals={PREDEFINED_MEALS}
            customMeals={customMeals}
            onMealSelect={handleMealSelect}
            onAddNewMeal={addNewMeal}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>

        {pendingMeals.length > 0 && (
          <motion.div layout className="mb-6 p-4 bg-emerald-100/50 rounded-lg border border-emerald-200">
            <h3 className="font-semibold mb-3 text-emerald-800">Drag your selected meals to the calendar:</h3>
            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {pendingMeals.map(meal => (
                  <DraggableMeal key={meal.id} meal={meal} onDragStart={handleDragStart} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <CalendarGrid
          weekDays={weekDays}
          mealPlan={mealPlan}
          mealTypes={mealTypes}
          handleDrop={handleDrop}
          getDayMeals={getDayMeals}
          removeMealFromSlot={removeMealFromSlot}
          calculateDayNutrition={calculateDayNutrition}
          handleDragOver={handleDragOver}
        />

        <ShoppingList ingredients={weeklyShoppingList} />
      </div>
    </div>
  );
};

export default MealPlanningCalendar;