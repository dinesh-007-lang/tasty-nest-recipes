import { useState, useEffect } from 'react';
import { Recipe, recipes } from '@/data/recipes';
import { RecipeGrid } from '@/components/RecipeGrid';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const Favorites = () => {
  const {
    toast
  } = useToast();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    loadFavorites();
  }, []);
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = favoriteRecipes.filter(recipe => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery.toLowerCase())) || recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(favoriteRecipes);
    }
  }, [searchQuery, favoriteRecipes]);
  const loadFavorites = () => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favorites = recipes.filter(recipe => favoriteIds.includes(recipe.id));
    setFavoriteRecipes(favorites);
    setFilteredRecipes(favorites);
  };
  const clearAllFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify([]));
    setFavoriteRecipes([]);
    setFilteredRecipes([]);
    toast({
      title: "Favorites Cleared",
      description: "All favorite recipes have been removed"
    });
  };
  const removeFavorite = (recipeId: string) => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favoriteIds.filter((id: string) => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    const removedRecipe = favoriteRecipes.find(recipe => recipe.id === recipeId);
    loadFavorites();
    toast({
      title: "Removed from Favorites",
      description: `${removedRecipe?.title} has been removed from your favorites`
    });
  };
  const groupedByCategory = filteredRecipes.reduce((acc, recipe) => {
    const category = recipe.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<string, Recipe[]>);
  return <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-warm bg-clip-text mb-2 text-orange-900">
              My Favorites ❤️
            </h1>
            <p className="text-lg text-slate-950">
              Your saved recipes collection ({favoriteRecipes.length} recipes)
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar onSearch={setSearchQuery} placeholder="Search your favorite recipes..." className="flex-1 max-w-2xl" />
            {favoriteRecipes.length > 0 && <Button onClick={clearAllFavorites} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 whitespace-nowrap">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 text-amber-950">
        {favoriteRecipes.length === 0 ?
      // Empty State
      <Card className="border-0 shadow-warm max-w-2xl mx-auto text-slate-950">
            <CardContent className="p-12 text-center">
              <Heart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-3xl font-bold mb-4">No Favorites Yet</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Start exploring our amazing recipes and add them to your favorites by clicking the heart icon. 
                Your saved recipes will appear here for easy access.
              </p>
              <div className="space-y-4">
                <Button onClick={() => window.location.href = '/'} className="bg-gradient-warm hover:opacity-90 text-gray-950">
                  <Search className="w-4 h-4 mr-2" />
                  Explore Recipes
                </Button>
                <div className="text-sm text-muted-foreground">
                  or browse by category to find something you'll love
                </div>
              </div>
            </CardContent>
          </Card> :
      // Favorites Content
      <div className="space-y-8">
            {/* Search Results Summary */}
            {searchQuery && <Card className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <p className="text-muted-foreground">
                    {filteredRecipes.length > 0 ? <>Showing {filteredRecipes.length} of {favoriteRecipes.length} favorite recipes matching "{searchQuery}"</> : <>No favorite recipes found matching "{searchQuery}"</>}
                  </p>
                </CardContent>
              </Card>}

            {filteredRecipes.length === 0 && searchQuery ?
        // No Search Results
        <Card className="border-0 shadow-soft text-zinc-950">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No favorite recipes match your search. Try a different keyword or browse all your favorites.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Show All Favorites
                  </Button>
                </CardContent>
              </Card> :
        // Recipe Groups by Category
        <div className="space-y-8">
                {Object.entries(groupedByCategory).map(([category, categoryRecipes]) => <Card key={category} className="border-0 shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {category === 'breakfast' && '🥞'}
                            {category === 'lunch' && '🥗'}
                            {category === 'dinner' && '🍝'}
                            {category === 'dessert' && '🍰'}
                            {category === 'snacks' && '🍿'}
                            {category === 'drinks' && '🥤'}
                            {category === 'soups' && '🍲'}
                            {category === 'vegan' && '🌱'}
                            {category === 'kids' && '👶'}
                            {category === 'quick-meals' && '⚡'}
                          </span>
                          <span className="capitalize text-xl">
                            {category.replace('-', ' ')} Favorites
                          </span>
                        </div>
                        <Badge variant="outline" className="border-primary text-primary">
                          {categoryRecipes.length} recipes
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RecipeGrid recipes={categoryRecipes} emptyMessage={`No ${category} recipes in your favorites`} />
                    </CardContent>
                  </Card>)}
              </div>}

            {/* Quick Actions */}
            {filteredRecipes.length > 0 && <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Manage Your Favorites</h3>
                      <p className="text-sm text-muted-foreground">
                        You have {favoriteRecipes.length} favorite recipes saved
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => window.location.href = '/shopping-list'}>
                        Add All to Shopping List
                      </Button>
                      <Button variant="outline" onClick={() => window.location.href = '/explore'}>
                        Find More Recipes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>}
          </div>}
      </div>
    </div>;
};
export default Favorites;