import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilters } from '@/components/CategoryFilters';
import { RecipeGrid } from '@/components/RecipeGrid';
import { useRecipes } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, TrendingUp, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
const Home = () => {
  const {
    displayedRecipes,
    loading,
    hasMore,
    totalCount,
    uniqueCount,
    duplicatesRemoved,
    loadMore,
    searchRecipes,
    filterByCategory,
    recipeCounts
  } = useRecipes();
  const [selectedCategory, setSelectedCategory] = useState('all');
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
  return <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 bg-gray-950">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-white">
                Welcome to TastyNest 🍽️
              </h1>
              <p className="text-[#752d2d]">
                Discover {uniqueCount.toLocaleString()} unique recipes from our curated collection
                {duplicatesRemoved > 0 && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {duplicatesRemoved} duplicates removed
                  </span>}
              </p>
            </div>
            <Button onClick={getRandomRecipe} variant="outline" className="border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              <Shuffle className="w-4 h-4 mr-2" />
              Surprise Me!
            </Button>
          </div>
          
          <SearchBar onSearch={searchRecipes} placeholder="Search by recipe name, ingredients, or tags..." className="max-w-2xl mx-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 bg-slate-200">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-soft bg-gradient-warm text-primary-foreground">
            <CardContent className="p-6 text-center bg-red-700">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{uniqueCount.toLocaleString()}</h3>
              <p className="text-primary-foreground/80">Unique Recipes</p>
              {duplicatesRemoved > 0 && <p className="text-xs text-primary-foreground/60 mt-1">
                  {duplicatesRemoved} duplicates removed
                </p>}
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-soft bg-gradient-cool text-white">
            <CardContent className="p-6 text-center bg-lime-900">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">25</h3>
              <p className="text-white/80">Avg Cook Time (min)</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-soft bg-sage text-white">
            <CardContent className="p-6 text-center bg-green-800">
              <span className="text-3xl mb-2 block">⭐</span>
              <h3 className="text-2xl font-bold">4.2</h3>
              <p className="text-white/80">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Browse by Category</h2>
            <Badge variant="outline" className="border-primary text-primary">
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory.replace('-', ' ')}
            </Badge>
          </div>
          <CategoryFilters selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} recipeCounts={recipeCounts} />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {displayedRecipes.length} of {totalCount} recipes
            {selectedCategory !== 'all' && <span> in <strong className="text-primary">{selectedCategory.replace('-', ' ')}</strong></span>}
          </p>
        </div>

        {/* Recipe Grid */}
        <RecipeGrid recipes={displayedRecipes} loading={loading} hasMore={hasMore} onLoadMore={loadMore} emptyMessage="No recipes found. Try adjusting your search or browse different categories." />
      </main>
    </div>;
};
export default Home;