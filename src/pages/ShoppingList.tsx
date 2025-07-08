import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, CheckCircle2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShoppingListItem {
  id: number;
  text: string;
  completed: boolean;
  recipeTitle?: string;
}

const ShoppingList = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('shoppingList') || '[]');
    setItems(savedItems);
  }, []);

  const saveItems = (newItems: ShoppingListItem[]) => {
    setItems(newItems);
    localStorage.setItem('shoppingList', JSON.stringify(newItems));
  };

  const toggleItem = (id: number) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveItems(newItems);
  };

  const removeItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    saveItems(newItems);
  };

  const clearCompleted = () => {
    const newItems = items.filter(item => !item.completed);
    saveItems(newItems);
    
    toast({
      title: "Completed items cleared",
      description: "All checked items have been removed from your list"
    });
  };

  const clearAll = () => {
    saveItems([]);
    
    toast({
      title: "Shopping list cleared",
      description: "All items have been removed from your shopping list"
    });
  };

  const pendingItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  // Group items by recipe
  const groupedItems = items.reduce((groups, item) => {
    const recipe = item.recipeTitle || 'Other Items';
    if (!groups[recipe]) groups[recipe] = [];
    groups[recipe].push(item);
    return groups;
  }, {} as Record<string, ShoppingListItem[]>);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-warm">
              <CardContent className="p-12 text-center">
                <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
                <h1 className="text-3xl font-bold mb-4">Your Shopping List is Empty</h1>
                <p className="text-muted-foreground mb-6">
                  Add ingredients from recipes to build your shopping list automatically
                </p>
                <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90">
                  Browse Recipes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Shopping List 🛒</h1>
              <p className="text-muted-foreground">
                {pendingItems.length} items remaining • {completedItems.length} completed
              </p>
            </div>
            
            <div className="flex gap-2">
              {completedItems.length > 0 && (
                <Button variant="outline" onClick={clearCompleted} size="sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Clear Completed
                </Button>
              )}
              <Button variant="outline" onClick={clearAll} size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Shopping List */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([recipeTitle, recipeItems]) => (
              <Card key={recipeTitle} className="border-0 shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {recipeTitle}
                    <Badge variant="secondary" className="ml-auto">
                      {recipeItems.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recipeItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`flex-1 cursor-pointer transition-all ${
                          item.completed 
                            ? 'line-through text-muted-foreground' 
                            : 'text-foreground'
                        }`}
                      >
                        {item.text}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="border-0 shadow-soft mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{items.length}</h3>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-cool rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{pendingItems.length}</h3>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{completedItems.length}</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
              
              {pendingItems.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      You're {Math.round((completedItems.length / items.length) * 100)}% done with your shopping!
                    </p>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-warm transition-all duration-500"
                        style={{ width: `${(completedItems.length / items.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;