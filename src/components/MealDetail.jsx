import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { FaArrowLeft } from "react-icons/fa";
import { FaFingerprint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from '@/components/ui/use-toast';




const MealDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();  // get the ":id" from the URL
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast(); 


    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const mealRef = doc(db, "recipes", id);
                const mealSnap = await getDoc(mealRef);

                if(mealSnap.exists()) {
                    setMeal({ id: mealSnap.id, ...mealSnap.data() });
                } else {
                    console.log("No meal matching id");
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching meal:", error);
                setLoading(false);
            }
        };

        fetchMeal();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!meal) return <p>Meal not found</p>;

    const handleSave = async () => {
        if (!meal?.id) return; // ensure the meal has an id
      
        try {
          const mealRef = doc(db, "recipes", meal.id); // reference the meal doc
          await updateDoc(mealRef, {
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            fat: meal.fat,
            sugar: meal.sugar,
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || []
          });
      
          toast({
            title: "Meal Updated!",
            description: `${meal.name} has been saved successfully`,
          });
      
          setIsEditing(false); // exit edit mode
        } catch (error) {
          console.error("Error updating meal:", error);
          toast({
            title: "Error",
            description: "Could not save changes. Try again.",
            variant: "destructive"
          });
        }
      };
      

    return ( // overall visual component of page
        <div className="p-6">
             <button 
                  className = "absolute top-2 left-3 text gray-500 hover:text-emerald-500"
                  onClick={(e) => {
                    navigate(`/`); // go to detail page
                  }}
                >
                    <FaArrowLeft size={18} />
                </button>
            <button 
                className = "absolute top-2 right-5 text gray 500 hover:text-emerald-500"
                onClick={() => {
                    if(isEditing){
                        handleSave();
                    } else {
                        setIsEditing(true);
                    }
                    }
                }
                >
                  {isEditing ? "Save" : "Edit"}
                
                    <FaFingerprint size={18} />
                </button>
            
                {/* Recipe Name */}
                {isEditing ? (
                    <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => setMeal(prev => ({ ...prev, name: e.target.value }))}
                        className="border px-2 py-1 rounded"
                    />
                    ) : (
                    <h1 className="text-2xl font-bold">{meal.name}</h1>
                    )}    
                {/* Servings */}
                {isEditing ? (
                    <input
                    type="text"
                    value={meal.servings}
                    onChange={(e) => setMeal(prev => ({ ...prev, servings: e.target.value }))}
                        className="border px-2 py-1 rounded"
                    />
                    ) : (
                    <h1 className="text-2xl font-bold">{meal.servings} servings</h1>
                    )}            
                {/* Calories */}
                {isEditing ? (
                    <input
                    type="text"
                    value={meal.calories}
                    onChange={(e) => setMeal(prev => ({ ...prev, calories: e.target.value }))} //TODO: make a for loop of this
                        className="border px-2 py-1 rounded"
                    />
                    ) : (
                    <h1 className="text-2xl font-bold">{meal.calories} calories</h1>
                    )}  
                {/* Fat */}
                {isEditing ? (
                    <input
                    type="text"
                    value={meal.fat}
                    onChange={(e) => setMeal(prev => ({ ...prev, fat: e.target.value }))}
                        className="border px-2 py-1 rounded"
                    />
                    ) : (
                    <h1 className="text-2xl font-bold">{meal.fat} g fat</h1>
                    )}    
                {/* Protein */}
                {isEditing ? (
                    <input
                    type="text"
                    value={meal.protein}
                    onChange={(e) => setMeal(prev => ({ ...prev, protein: e.target.value }))}
                        className="border px-2 py-1 rounded"
                    />
                    ) : (
                    <h1 className="text-2xl font-bold">{meal.protein} g protein</h1>
                    )}         
                {/* Recipe Ingredients */}
                {isEditing ? (
                    <input
                    type="text"
                    value={meal.ingredients}
                    onChange={(e) => setMeal(prev => ({ ...prev, ingredients: e.target.value }))}
                        className="border px-2 py-1 rounded"
                    />
                    ) : (
                    <div>
                        <h1 className="text-2xl font-bold">Ingredients: {meal.ingredients}</h1>
                    </div>
                    )}  
                {/* Recipe Instructions*/}
                {isEditing ? (
                    <input
                    type="text"
                    value={meal.instructions}
                    onChange={(e) => setMeal(prev => ({ ...prev, instructions: e.target.value }))}
                        className="border px-2 py-1 rounded"
                    />
                    ) : (
                    <h1 className="text-2xl font-bold">Instructions: {meal.instructions}</h1>
                    )}                                   
 
        </div>

    );
};

export default MealDetail;