import { Recipe } from '@/data/recipes';
import { RecipeCard } from './RecipeCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RecipeGridProps {
  recipes: Recipe[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

export const RecipeGrid = ({ 
  recipes, 
  loading = false, 
  hasMore = false, 
  onLoadMore, 
  emptyMessage = "No recipes found. Try adjusting your search or filters." 
}: RecipeGridProps) => {
  if (recipes.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading delicious recipes...</span>
          </div>
        </div>
      )}
      
      {hasMore && !loading && (
        <div className="flex justify-center py-8">
          <Button 
            onClick={onLoadMore}
            variant="outline" 
            size="lg"
            className="border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Load More Recipes
          </Button>
        </div>
      )}
    </div>
  );
};