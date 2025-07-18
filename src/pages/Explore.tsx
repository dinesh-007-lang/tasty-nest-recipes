import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilters } from '@/components/CategoryFilters';
import { RecipeGrid } from '@/components/RecipeGrid';
import { useRecipes } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Shuffle, 
  TrendingUp, 
  Clock, 
  Star, 
  Filter,
  SlidersHorizontal,
  Search
} from 'lucide-react';

const Explore = () => {
  const {
    displayedRecipes,
    loading,
    hasMore,
    totalCount,
    uniqueCount,
    loadMore,
    searchRecipes,
    filterByCategory,
    recipeCounts
  } = useRecipes();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [maxCookTime, setMaxCookTime] = useState('');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterByCategory(category);
  };

  const getRandomRecipe = () => {
    const randomIndex = Math.floor(Math.random() * displayedRecipes.length);
    const randomRecipe = displayedRecipes[randomIndex];
    if (randomRecipe) {
      window.location.href = `/recipe/${randomRecipe.id}`;
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setDifficultyFilter('all');
    setMaxCookTime('');
    setSortBy('newest');
    filterByCategory('all');
    searchRecipes('');
  };

  // Filter featured/trending recipes (highest rated)
  const featuredRecipes = displayedRecipes
    .filter(recipe => recipe.rating >= 4.5)
    .slice(0, 8);

  const quickMeals = displayedRecipes
    .filter(recipe => {
      const time = parseInt(recipe.cookingTime);
      return time <= 30;
    })
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-2">
              Explore Recipes 🔍
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover amazing recipes from our collection of {uniqueCount.toLocaleString()} dishes
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar 
              onSearch={searchRecipes}
              placeholder="Search by recipe name, ingredients, or tags..."
              className="flex-1 max-w-2xl"
            />
            <Button
              onClick={getRandomRecipe}
              variant="outline"
              className="border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 whitespace-nowrap"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Surprise Me!
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-soft">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Recipes
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Featured ({featuredRecipes.length})
            </TabsTrigger>
            <TabsTrigger 
              value="quick" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Quick Meals ({quickMeals.length})
            </TabsTrigger>
          </TabsList>

          {/* All Recipes Tab */}
          <TabsContent value="all" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-soft bg-gradient-warm text-primary-foreground">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{totalCount.toLocaleString()}</h3>
                  <p className="text-primary-foreground/80 text-sm">Available Recipes</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-soft bg-gradient-cool text-white">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">25</h3>
                  <p className="text-white/80 text-sm">Avg Cook Time (min)</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-soft bg-sage text-white">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 mx-auto mb-2 fill-current" />
                  <h3 className="text-xl font-bold">4.2</h3>
                  <p className="text-white/80 text-sm">Average Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select 
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="all">All Levels</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Cook Time</label>
                    <Input
                      type="number"
                      placeholder="Minutes"
                      value={maxCookTime}
                      onChange={(e) => setMaxCookTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="newest">Newest</option>
                      <option value="rating">Highest Rated</option>
                      <option value="time">Cook Time</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Badge variant="outline" className="border-primary text-primary">
                      {selectedCategory === 'all' ? 'All Categories' : selectedCategory.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                <CategoryFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  recipeCounts={recipeCounts}
                />
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {displayedRecipes.length} of {totalCount} recipes
                {selectedCategory !== 'all' && (
                  <span> in <strong className="text-primary">{selectedCategory.replace('-', ' ')}</strong></span>
                )}
              </p>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Recipe Grid */}
            <RecipeGrid
              recipes={displayedRecipes}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              emptyMessage="No recipes found. Try adjusting your search or filters."
            />
          </TabsContent>

          {/* Featured Recipes Tab */}
          <TabsContent value="featured" className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 mx-auto text-yellow-400 fill-current mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Featured Recipes</h2>
                  <p className="text-muted-foreground">
                    Hand-picked recipes with ratings of 4.5 stars and above
                  </p>
                </div>
                
                <RecipeGrid
                  recipes={featuredRecipes}
                  emptyMessage="No featured recipes available at the moment. Check back soon!"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Meals Tab */}
          <TabsContent value="quick" className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Clock className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Quick Meals</h2>
                  <p className="text-muted-foreground">
                    Delicious recipes that can be prepared in 30 minutes or less
                  </p>
                </div>
                
                <RecipeGrid
                  recipes={quickMeals}
                  emptyMessage="No quick meals found. Try browsing our full collection!"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;