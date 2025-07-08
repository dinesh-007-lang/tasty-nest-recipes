import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/recipes';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recipe, setRecipe] = useState({
    title: '',
    category: '',
    image: '',
    cookingTime: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    servings: 4,
    ingredients: [''],
    instructions: [''],
    tags: [] as string[],
    author: 'You'
  });
  
  const [newTag, setNewTag] = useState('');

  const updateRecipe = (field: string, value: any) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? value : ingredient
      )
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) => 
        i === index ? value : instruction
      )
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !recipe.tags.includes(newTag.trim())) {
      setRecipe(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateRecipe = () => {
    if (!recipe.title.trim()) return 'Recipe title is required';
    if (!recipe.category) return 'Category is required';
    if (!recipe.cookingTime.trim()) return 'Cooking time is required';
    if (recipe.ingredients.filter(i => i.trim()).length < 2) return 'At least 2 ingredients required';
    if (recipe.instructions.filter(i => i.trim()).length < 2) return 'At least 2 instructions required';
    return null;
  };

  const saveRecipe = (isDraft = false) => {
    const error = validateRecipe();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      title: recipe.title,
      category: recipe.category,
      image: recipe.image || `https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop&auto=format`,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      ingredients: recipe.ingredients.filter(i => i.trim()),
      instructions: recipe.instructions.filter(i => i.trim()),
      tags: recipe.tags,
      rating: 0,
      author: recipe.author,
      nutrition: {
        calories: Math.floor(Math.random() * 400) + 200,
        protein: `${Math.floor(Math.random() * 30) + 5}g`,
        carbs: `${Math.floor(Math.random() * 50) + 10}g`,
        fat: `${Math.floor(Math.random() * 25) + 5}g`
      }
    };

    // Save to localStorage
    const storageKey = isDraft ? 'draftRecipes' : 'userRecipes';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    localStorage.setItem(storageKey, JSON.stringify([...existing, newRecipe]));

    toast({
      title: isDraft ? "Recipe Saved as Draft" : "Recipe Published",
      description: isDraft 
        ? "Your recipe has been saved as a draft" 
        : "Your recipe has been published successfully!"
    });

    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Recipe</h1>
            <p className="text-muted-foreground">Share your delicious creation with the TastyNest community</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipe Title *</label>
                    <Input
                      placeholder="Enter your recipe title..."
                      value={recipe.title}
                      onChange={(e) => updateRecipe('title', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <Select value={recipe.category} onValueChange={(value) => updateRecipe('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c !== 'all').map((category) => (
                            <SelectItem key={category} value={category} className="capitalize">
                              {category.replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty</label>
                      <Select 
                        value={recipe.difficulty} 
                        onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => updateRecipe('difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Cooking Time *</label>
                      <Input
                        placeholder="e.g., 30 minutes"
                        value={recipe.cookingTime}
                        onChange={(e) => updateRecipe('cookingTime', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Servings</label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={recipe.servings}
                        onChange={(e) => updateRecipe('servings', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
                    <Input
                      placeholder="Enter image URL..."
                      value={recipe.image}
                      onChange={(e) => updateRecipe('image', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Or leave empty for a default image
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                  <p className="text-sm text-muted-foreground">Add at least 2 ingredients</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Ingredient ${index + 1}...`}
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                      />
                      {recipe.ingredients.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addIngredient}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ingredient
                  </Button>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                  <p className="text-sm text-muted-foreground">Add step-by-step cooking instructions</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm mt-1">
                        {index + 1}
                      </div>
                      <Textarea
                        placeholder={`Step ${index + 1}...`}
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        className="min-h-[80px]"
                      />
                      {recipe.instructions.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeInstruction(index)}
                          className="mt-1"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addInstruction}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Instruction
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tags */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <p className="text-sm text-muted-foreground">Add tags to help people find your recipe</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button variant="outline" size="sm" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{recipe.title || 'Recipe Title'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {recipe.category ? recipe.category.replace('-', ' ') : 'Category'} • {recipe.cookingTime || 'Cooking time'} • {recipe.servings} servings
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-0 shadow-soft">
                <CardContent className="p-4 space-y-3">
                  <Button
                    onClick={() => saveRecipe(false)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Publish Recipe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => saveRecipe(true)}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;