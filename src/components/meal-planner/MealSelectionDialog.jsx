import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Utensils, Search, Star, BookHeart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";




const MealCard = ({ meal, onSelect, navigate }) => (
  
  <motion.div
    layout
    whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
    className="p-4 rounded-lg border-2 cursor-pointer transition-all border-gray-200 bg-white hover:border-emerald-300"
    onClick={() => onSelect(meal)}
  >
{/* eye icon button */}
    <button 
      className = "absolute top-2 right-3 text gray-500 hover:text-emerald-500"
      onClick={(e) => {
        e.stopPropagation(); // prevent triggering onSelect
        navigate(`/meal/${meal.id}`); // go to detail page
      }}
    >
      <FaEye size={18} />
    </button>

    <h4 className="font-semibold text-gray-800">{meal.name}</h4>
    <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-2">
      <span>🔥 {meal.calories} cal</span>
      <span>💪 {meal.protein}g protein</span>
      <span>🌾 {meal.carbs}g carbs</span>
      <span>🥑 {meal.fat}g fat</span>
    </div>
  </motion.div>
);

const MealSelectionDialog = ({ predefinedMeals, customMeals, onMealSelect, onAddNewMeal, isDialogOpen, setIsDialogOpen }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', ingredients: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNewMeal = () => {
    if (!newMeal.name || !newMeal.calories) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the meal name and calories",
        variant: "destructive"
      });
      return;
    }
    const meal = {
      id: `custom-${Date.now()}`,
      name: newMeal.name,
      calories: parseInt(newMeal.calories) || 0,
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fat: parseInt(newMeal.fat) || 0,
      ingredients: newMeal.ingredients.split(',').map(item => item.trim()).filter(Boolean)
    };
    onAddNewMeal(meal);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', ingredients: '' });
  };

  const handleSelectAndClose = (meal) => {
    onMealSelect(meal);
    setIsDialogOpen(false);
  };

  const filteredPredefinedMeals = useMemo(() => 
    predefinedMeals.filter(meal => meal.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [predefinedMeals, searchTerm]
  );

  const filteredCustomMeals = useMemo(() => 
    customMeals.filter(meal => meal.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [customMeals, searchTerm]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Meals
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="text-emerald-600" />
            Select a Meal
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">Create New Meal</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Input placeholder="Meal name" value={newMeal.name} onChange={(e) => setNewMeal({...newMeal, name: e.target.value})} className="md:col-span-1" />
            <Input placeholder="Calories" type="number" value={newMeal.calories} onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})} />
            <Input placeholder="Protein (g)" type="number" value={newMeal.protein} onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})} />
            <Input placeholder="Carbs (g)" type="number" value={newMeal.carbs} onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})} />
            <Input placeholder="Fat (g)" type="number" value={newMeal.fat} onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})} />
            <Input placeholder="Ingredients (comma-separated)" value={newMeal.ingredients} onChange={(e) => setNewMeal({...newMeal, ingredients: e.target.value})} className="col-span-2 md:col-span-3" />
            <Button onClick={handleAddNewMeal} className="bg-emerald-500 hover:bg-emerald-600 col-span-2 md:col-span-3">Add Meal</Button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search for a meal..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto flex-grow pr-2">
          {filteredCustomMeals.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg text-gray-700"><BookHeart className="text-teal-600" /> Your Custom Meals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCustomMeals.map(meal => <MealCard key={meal.id} meal={meal} onSelect={handleSelectAndClose} navigate={navigate} />)}
              </div>
            </div>
          )}

          {filteredPredefinedMeals.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg text-gray-700"><Star className="text-amber-500" /> Predefined Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPredefinedMeals.map(meal => <MealCard key={meal.id} meal={meal} onSelect={handleSelectAndClose} navigate={navigate}/>)}
              </div>
            </div>
          )}

          {filteredCustomMeals.length === 0 && filteredPredefinedMeals.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>No meals found for "{searchTerm}".</p>
              <p className="text-sm">Try a different search or create a new meal!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealSelectionDialog;