import React from 'react';
import { Helmet } from 'react-helmet';
import MealPlanningCalendar from '@/components/MealPlanningCalendar';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Meal Planning Calendar - Plan Your Weekly Nutrition</title>
        <meta name="description" content="Organize your weekly meals with our intuitive drag-and-drop meal planning calendar. Track nutrition, plan balanced meals, and maintain healthy eating habits effortlessly." />
        <meta property="og:title" content="Meal Planning Calendar - Plan Your Weekly Nutrition" />
        <meta property="og:description" content="Organize your weekly meals with our intuitive drag-and-drop meal planning calendar. Track nutrition, plan balanced meals, and maintain healthy eating habits effortlessly." />
      </Helmet>
      
      <MealPlanningCalendar />
      <Toaster />
    </>
  );
}

export default App;