import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart } from 'lucide-react';

const ShoppingList = ({ ingredients }) => {
  if (ingredients.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="mt-8"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
            <ShoppingCart className="text-emerald-600" />
            Weekly Shopping List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-3"
              >
                <Checkbox id={`ingredient-${index}`} />
                <label
                  htmlFor={`ingredient-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {ingredient}
                </label>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShoppingList;