import { Recipe } from '@/data/recipes';

interface DeduplicationResult {
  uniqueRecipes: Recipe[];
  duplicatesRemoved: number;
  duplicateLog: string[];
}

interface SimilarityThresholds {
  titleSimilarity: number;
  ingredientSimilarity: number;
  instructionSimilarity: number;
}

const DEFAULT_THRESHOLDS: SimilarityThresholds = {
  titleSimilarity: 0.8, // 80% similarity threshold
  ingredientSimilarity: 0.7, // 70% ingredient overlap
  instructionSimilarity: 0.6, // 60% instruction similarity
};

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity ratio between two strings (0-1)
 */
function stringSimilarity(str1: string, str2: string): number {
  const normalizedStr1 = str1.toLowerCase().trim();
  const normalizedStr2 = str2.toLowerCase().trim();
  
  if (normalizedStr1 === normalizedStr2) return 1;
  
  const maxLength = Math.max(normalizedStr1.length, normalizedStr2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(normalizedStr1, normalizedStr2);
  return 1 - distance / maxLength;
}

/**
 * Calculate ingredient list similarity
 */
function ingredientSimilarity(ingredients1: string[], ingredients2: string[]): number {
  if (ingredients1.length === 0 && ingredients2.length === 0) return 1;
  if (ingredients1.length === 0 || ingredients2.length === 0) return 0;
  
  // Normalize ingredients (remove measurements, lowercase)
  const normalize = (ingredient: string) => 
    ingredient.toLowerCase().replace(/^\d+\s*(cup|tbsp|tsp|lb|oz|pieces?|g|kg|ml|l)\s*/i, '').trim();
  
  const normalized1 = ingredients1.map(normalize);
  const normalized2 = ingredients2.map(normalize);
  
  let matches = 0;
  normalized1.forEach(ing1 => {
    if (normalized2.some(ing2 => stringSimilarity(ing1, ing2) > 0.8)) {
      matches++;
    }
  });
  
  return matches / Math.max(normalized1.length, normalized2.length);
}

/**
 * Calculate instruction similarity
 */
function instructionSimilarity(instructions1: string[], instructions2: string[]): number {
  if (instructions1.length === 0 && instructions2.length === 0) return 1;
  if (instructions1.length === 0 || instructions2.length === 0) return 0;
  
  const combined1 = instructions1.join(' ').toLowerCase();
  const combined2 = instructions2.join(' ').toLowerCase();
  
  return stringSimilarity(combined1, combined2);
}

/**
 * Check if two recipes are considered duplicates
 */
function isDuplicate(recipe1: Recipe, recipe2: Recipe, thresholds = DEFAULT_THRESHOLDS): boolean {
  // Check exact title match first
  if (recipe1.title.toLowerCase() === recipe2.title.toLowerCase()) {
    return true;
  }
  
  // Check fuzzy title similarity
  const titleSim = stringSimilarity(recipe1.title, recipe2.title);
  if (titleSim >= thresholds.titleSimilarity) {
    return true;
  }
  
  // Check if images are the same
  if (recipe1.image === recipe2.image) {
    return true;
  }
  
  // Check combined similarity (title + ingredients + instructions)
  const ingredientSim = ingredientSimilarity(recipe1.ingredients, recipe2.ingredients);
  const instructionSim = instructionSimilarity(recipe1.instructions, recipe2.instructions);
  
  // If ingredients and instructions are very similar, even with different titles, it's likely a duplicate
  if (ingredientSim >= thresholds.ingredientSimilarity && 
      instructionSim >= thresholds.instructionSimilarity) {
    return true;
  }
  
  // Check for high overall similarity
  const overallSimilarity = (titleSim + ingredientSim + instructionSim) / 3;
  return overallSimilarity >= 0.75;
}

/**
 * Generate a reason why a recipe was considered a duplicate
 */
function getDuplicateReason(original: Recipe, duplicate: Recipe): string {
  const titleSim = stringSimilarity(original.title, duplicate.title);
  const ingredientSim = ingredientSimilarity(original.ingredients, duplicate.ingredients);
  const instructionSim = instructionSimilarity(original.instructions, duplicate.instructions);
  
  if (original.title.toLowerCase() === duplicate.title.toLowerCase()) {
    return `Identical title: "${duplicate.title}"`;
  }
  
  if (original.image === duplicate.image) {
    return `Same image used`;
  }
  
  if (titleSim >= DEFAULT_THRESHOLDS.titleSimilarity) {
    return `Similar title (${Math.round(titleSim * 100)}% match): "${duplicate.title}" vs "${original.title}"`;
  }
  
  if (ingredientSim >= DEFAULT_THRESHOLDS.ingredientSimilarity && 
      instructionSim >= DEFAULT_THRESHOLDS.instructionSimilarity) {
    return `Similar recipe content (${Math.round(ingredientSim * 100)}% ingredients, ${Math.round(instructionSim * 100)}% instructions)`;
  }
  
  return `High overall similarity (${Math.round(((titleSim + ingredientSim + instructionSim) / 3) * 100)}%)`;
}

/**
 * Remove duplicates from a list of recipes
 */
export function deduplicateRecipes(
  recipes: Recipe[], 
  thresholds = DEFAULT_THRESHOLDS
): DeduplicationResult {
  const uniqueRecipes: Recipe[] = [];
  const duplicateLog: string[] = [];
  let duplicatesRemoved = 0;
  
  console.log(`🔍 Starting deduplication process for ${recipes.length} recipes...`);
  
  for (const recipe of recipes) {
    let isDupe = false;
    
    for (const existingRecipe of uniqueRecipes) {
      if (isDuplicate(recipe, existingRecipe, thresholds)) {
        const reason = getDuplicateReason(existingRecipe, recipe);
        const logMessage = `Skipped: "${recipe.title}" (${recipe.category}) - ${reason}`;
        duplicateLog.push(logMessage);
        console.log(`❌ ${logMessage}`);
        isDupe = true;
        duplicatesRemoved++;
        break;
      }
    }
    
    if (!isDupe) {
      uniqueRecipes.push(recipe);
      console.log(`✅ Added: "${recipe.title}" (${recipe.category})`);
    }
  }
  
  console.log(`🎯 Deduplication complete: ${uniqueRecipes.length} unique recipes, ${duplicatesRemoved} duplicates removed`);
  
  return {
    uniqueRecipes,
    duplicatesRemoved,
    duplicateLog
  };
}

/**
 * Check if a single recipe would be a duplicate in an existing list
 */
export function isRecipeDuplicate(
  newRecipe: Recipe, 
  existingRecipes: Recipe[], 
  thresholds = DEFAULT_THRESHOLDS
): { isDuplicate: boolean; reason?: string; similarRecipe?: Recipe } {
  for (const existingRecipe of existingRecipes) {
    if (isDuplicate(newRecipe, existingRecipe, thresholds)) {
      return {
        isDuplicate: true,
        reason: getDuplicateReason(existingRecipe, newRecipe),
        similarRecipe: existingRecipe
      };
    }
  }
  
  return { isDuplicate: false };
}

/**
 * Get recipe statistics including duplicates
 */
export function getRecipeStats(recipes: Recipe[]): {
  totalRecipes: number;
  uniqueRecipes: number;
  duplicatesRemoved: number;
  categoryCounts: Record<string, number>;
} {
  const deduplicationResult = deduplicateRecipes(recipes);
  
  const categoryCounts: Record<string, number> = {};
  deduplicationResult.uniqueRecipes.forEach(recipe => {
    const category = recipe.category.toLowerCase();
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  return {
    totalRecipes: recipes.length,
    uniqueRecipes: deduplicationResult.uniqueRecipes.length,
    duplicatesRemoved: deduplicationResult.duplicatesRemoved,
    categoryCounts
  };
}