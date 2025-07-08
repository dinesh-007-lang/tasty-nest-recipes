import { useState, useMemo, useCallback } from 'react';
import { Recipe, recipes, recipeStats } from '@/data/recipes';
import { isRecipeDuplicate } from '@/utils/recipeDeduplication';

interface UseRecipesReturn {
  filteredRecipes: Recipe[];
  displayedRecipes: Recipe[];
  loading: boolean;
  hasMore: boolean;
  totalCount: number;
  uniqueCount: number;
  duplicatesRemoved: number;
  loadMore: () => void;
  searchRecipes: (query: string) => void;
  filterByCategory: (category: string) => void;
  resetPagination: () => void;
  recipeCounts: Record<string, number>;
  checkIfRecipeDuplicate: (recipe: Recipe) => { isDuplicate: boolean; reason?: string; similarRecipe?: Recipe };
}

const ITEMS_PER_PAGE = 24;

export const useRecipes = (): UseRecipesReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filter recipes based on search and category
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(recipe => {
        // Search in title
        if (recipe.title.toLowerCase().includes(query)) return true;
        
        // Search in ingredients
        if (recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(query)
        )) return true;
        
        // Search in tags
        if (recipe.tags.some(tag => 
          tag.toLowerCase().includes(query)
        )) return true;
        
        // Search in author
        if (recipe.author.toLowerCase().includes(query)) return true;
        
        return false;
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Calculate recipe counts for each category
  const recipeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Count all recipes
    counts.all = filteredRecipes.length;
    
    // Count by category
    recipes.forEach(recipe => {
      const category = recipe.category.toLowerCase();
      counts[category] = (counts[category] || 0) + 1;
    });
    
    return counts;
  }, [filteredRecipes.length]);

  // Paginated recipes
  const displayedRecipes = useMemo(() => {
    return filteredRecipes.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

  const hasMore = displayedRecipes.length < filteredRecipes.length;

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setLoading(true);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setLoading(false);
      }, 500);
    }
  }, [hasMore, loading]);

  const searchRecipes = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset pagination when searching
  }, []);

  const filterByCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset pagination when filtering
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const checkIfRecipeDuplicate = useCallback((recipe: Recipe) => {
    return isRecipeDuplicate(recipe, recipes);
  }, []);

  return {
    filteredRecipes,
    displayedRecipes,
    loading,
    hasMore,
    totalCount: filteredRecipes.length,
    uniqueCount: recipeStats.unique,
    duplicatesRemoved: recipeStats.duplicatesRemoved,
    loadMore,
    searchRecipes,
    filterByCategory,
    resetPagination,
    recipeCounts,
    checkIfRecipeDuplicate
  };
};