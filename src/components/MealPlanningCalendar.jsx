import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MealSelectionDialog from '@/components/meal-planner/MealSelectionDialog';
import CalendarGrid from '@/components/meal-planner/CalendarGrid';
import DraggableMeal from '@/components/meal-planner/DraggableMeal';
import ShoppingList from '@/components/meal-planner/ShoppingList';
import { db } from '../firebase'; // adjust path if needed
import { collection, getDocs, addDoc } from 'firebase/firestore';


const MealPlanningCalendar = () => {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mealPlan, setMealPlan] = useState({});
  const [customMeals, setCustomMeals] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingMeals, setPendingMeals] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

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
  const startDate = new Date(currentWeek);

  //==== RETRIEVE MEALS FROM DATABASE ==================================
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const mealsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMeals(mealsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, []);

// ==================================================================================================

  // === LOAD MEAL ENTRIES =============================
  useEffect(() => {
    async function loadMealPlan() {
      if(!startDate) return;

      const entriesRef = collection(db, "mealPlans");
      const snapshot = await getDocs(entriesRef);

      const plan = {};
      snapshot.forEach(doc => {
        const{ dateKey, mealType, meal } = doc.data();
        if(!plan[dateKey]) plan[dateKey] = {};
        if(!plan[dateKey][mealType]) plan[dateKey][mealType] = [];
        plan[dateKey][mealType].push({ id: doc.id, ...meal });
      });

      setMealPlan(plan);
    }
    loadMealPlan();
  }, [startDate]);


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
    if(meal.servings <= 0){
      console.log("[ERROR]: invalid number of servings");
      return;
    }
    const newMeals = [];

    for (let i = 0; i < meal.servings; i++) {
      newMeals.push({ ...meal, id: Date.now() + Math.random(), servings: 1 });
    }

    setPendingMeals(prev => [...prev, ...newMeals]);
  };

  const handleDragStart = (e, meal) => {
    setDraggedItem(meal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, date, mealType) => {
    e.preventDefault();
    if (!draggedItem) return;

    const dateKey = formatDate(date);
    const newMeal = { ...draggedItem};

    setMealPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      if (!newPlan[dateKey]) newPlan[dateKey] = {};
      if (!newPlan[dateKey][mealType]) newPlan[dateKey][mealType] = [];
      newPlan[dateKey][mealType] = [...newPlan[dateKey][mealType], newMeal];
      return newPlan;
    });

    try {
      await addDoc(collection(db, "mealPlans"), {
        dateKey,
        mealType,
        meal: { ...draggedItem, id: Date.now()},
      });
    
      setPendingMeals(prev => prev.filter(m => m.id !== draggedItem.id));
      setDraggedItem(null);


      toast({
        title: "Meal Added!",
        description: `${draggedItem.name} added to ${mealType}`,
      });
    } catch (err) {
      console.error("Error saving meal to Firebase: ", err);
    }
  };

  const addNewMeal = (meal) => {
    setCustomMeals(prev => [...prev, meal]);
    toast({
      title: "New Meal Added!",
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
            predefinedMeals={meals}
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