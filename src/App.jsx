import React from 'react';
import { Helmet } from 'react-helmet';
import MealPlanningCalendar from '@/components/MealPlanningCalendar';
import MealDetail from '@/components/MealDetail';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<MealPlanningCalendar />} />
        {/* Recipe Detail Page */}
        <Route path="/meal/:id" element={<MealDetail />} />
      </Routes>

      <Helmet>
        <title>Meal Planning Calendar - Plan Your Weekly Nutrition</title>
        <meta name="description" content="Organize your weekly meals with our intuitive drag-and-drop meal planning calendar. Track nutrition, plan balanced meals, and maintain healthy eating habits effortlessly." />
        <meta property="og:title" content="Meal Planning Calendar - Plan Your Weekly Nutrition" />
        <meta property="og:description" content="Organize your weekly meals with our intuitive drag-and-drop meal planning calendar. Track nutrition, plan balanced meals, and maintain healthy eating habits effortlessly." />
      </Helmet>
      
      <Toaster />
    </BrowserRouter>
  );
}

export default App;