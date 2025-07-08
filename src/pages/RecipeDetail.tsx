import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Recipe, recipes } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Users, 
  Star, 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  ChefHat,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (id) {
      const foundRecipe = recipes.find(r => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setCheckedIngredients(new Array(foundRecipe.ingredients.length).fill(false));
        
        // Check if recipe is favorited
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorited(favorites.includes(id));
      }
    }
  }, [id]);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const toggleFavorite = () => {
    if (!recipe) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorited 
      ? favorites.filter((fav: string) => fav !== recipe.id)
      : [...favorites, recipe.id];
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
    
    toast({
      title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorited 
        ? `${recipe.title} has been removed from your favorites`
        : `${recipe.title} has been added to your favorites`,
    });
  };

  const addToShoppingList = () => {
    if (!recipe) return;
    
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    const newItems = recipe.ingredients.map(ingredient => ({
      id: Date.now() + Math.random(),
      text: ingredient,
      completed: false,
      recipeTitle: recipe.title
    }));
    
    localStorage.setItem('shoppingList', JSON.stringify([...shoppingList, ...newItems]));
    
    toast({
      title: "Added to Shopping List",
      description: `${recipe.ingredients.length} ingredients added to your shopping list`,
    });
  };

  const startCookingMode = () => {
    setCookingMode(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (recipe && currentStep < recipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">Recipe not found</h2>
          <p className="text-muted-foreground mb-4">The recipe you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cookingMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCookingMode(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Cooking Mode
            </Button>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Step {currentStep + 1} of {recipe.instructions.length}
            </Badge>
          </div>

          <Card className="border-0 shadow-warm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">{recipe.title}</CardTitle>
              <p className="text-muted-foreground">Follow the steps below to create this delicious dish</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">👨‍🍳</div>
                <h3 className="text-2xl font-semibold mb-4">
                  Step {currentStep + 1}
                </h3>
                <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                  {recipe.instructions[currentStep]}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous Step
                </Button>
                
                <div className="text-center">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(((currentStep + 1) / recipe.instructions.length) * 100)}% Complete
                  </p>
                </div>

                <Button
                  onClick={nextStep}
                  disabled={currentStep === recipe.instructions.length - 1}
                  className="bg-primary hover:bg-primary/90"
                >
                  {currentStep === recipe.instructions.length - 1 ? 'Finished!' : 'Next Step'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
      {/* Header */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-6 left-6">
          <Link to="/">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-white">
            <Badge className="mb-3 bg-primary text-primary-foreground">
              {recipe.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-white/80 text-lg">by {recipe.author}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Info */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">{recipe.cookingTime}</p>
                    <p className="text-sm text-muted-foreground">Cook Time</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">{recipe.servings}</p>
                    <p className="text-sm text-muted-foreground">Servings</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">{recipe.difficulty}</p>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400 fill-current" />
                    <p className="font-semibold">{recipe.rating}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-primary/30 text-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={toggleFavorite}
                    variant={isFavorited ? "default" : "outline"}
                    className="flex-1"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  <Button onClick={addToShoppingList} variant="outline" className="flex-1">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Shopping List
                  </Button>
                  <Button onClick={startCookingMode} className="flex-1 bg-primary hover:bg-primary/90">
                    <ChefHat className="w-4 h-4 mr-2" />
                    Start Cooking
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-2xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-lg leading-relaxed pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Ingredients</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Check off ingredients as you prepare them
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Checkbox
                        id={`ingredient-${index}`}
                        checked={checkedIngredients[index]}
                        onCheckedChange={() => toggleIngredient(index)}
                      />
                      <label
                        htmlFor={`ingredient-${index}`}
                        className={`flex-1 cursor-pointer ${
                          checkedIngredients[index] 
                            ? 'line-through text-muted-foreground' 
                            : ''
                        }`}
                      >
                        {ingredient}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nutrition */}
            {recipe.nutrition && (
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl">Nutrition Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{recipe.nutrition.calories}</p>
                      <p className="text-sm text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{recipe.nutrition.protein}</p>
                      <p className="text-sm text-muted-foreground">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{recipe.nutrition.carbs}</p>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{recipe.nutrition.fat}</p>
                      <p className="text-sm text-muted-foreground">Fat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;