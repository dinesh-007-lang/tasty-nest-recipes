import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/recipes';

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  recipeCounts?: Record<string, number>;
}

const categoryIcons: Record<string, string> = {
  all: '🍽️',
  breakfast: '🥞',
  lunch: '🥗',
  dinner: '🍝',
  dessert: '🍰',
  snacks: '🍿',
  drinks: '🥤',
  soups: '🍲',
  vegan: '🌱',
  kids: '👶',
  'quick-meals': '⚡'
};

export const CategoryFilters = ({ selectedCategory, onCategoryChange, recipeCounts }: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        const count = recipeCounts?.[category] || 0;
        
        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`
              relative transition-all duration-300 hover:scale-105 
              ${isSelected 
                ? 'bg-primary text-primary-foreground shadow-warm' 
                : 'border-primary/30 hover:border-primary hover:bg-primary/10'
              }
            `}
          >
            <span className="mr-2 text-lg">
              {categoryIcons[category] || '🍽️'}
            </span>
            <span className="capitalize font-medium">
              {category.replace('-', ' ')}
            </span>
            {count > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs bg-white/20 text-current border-0"
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};