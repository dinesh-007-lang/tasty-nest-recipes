import { useState, useEffect } from 'react';
import { Recipe, recipes } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RecipeGrid } from '@/components/RecipeGrid';
import { Edit, User, ChefHat, Heart, BookOpen, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  joinDate: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile>({
    name: 'Food Enthusiast',
    bio: 'Passionate home cook sharing delicious recipes with the community. Love experimenting with flavors and creating memorable meals.',
    avatar: '',
    joinDate: new Date().toLocaleDateString()
  });
  
  const [editedUser, setEditedUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [draftRecipes, setDraftRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Load user profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUser(profile);
      setEditedUser(profile);
    }

    // Load user's recipes
    const savedUserRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
    setUserRecipes(savedUserRecipes);

    // Load draft recipes
    const savedDraftRecipes = JSON.parse(localStorage.getItem('draftRecipes') || '[]');
    setDraftRecipes(savedDraftRecipes);

    // Load favorite recipes
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favorites = recipes.filter(recipe => favoriteIds.includes(recipe.id));
    setFavoriteRecipes(favorites);
  }, []);

  const saveProfile = () => {
    setUser(editedUser);
    localStorage.setItem('userProfile', JSON.stringify(editedUser));
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully!"
    });
  };

  const cancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const deleteDraft = (recipeId: string) => {
    const updatedDrafts = draftRecipes.filter(recipe => recipe.id !== recipeId);
    setDraftRecipes(updatedDrafts);
    localStorage.setItem('draftRecipes', JSON.stringify(updatedDrafts));
    
    toast({
      title: "Draft Deleted",
      description: "Recipe draft has been removed"
    });
  };

  const publishDraft = (recipeId: string) => {
    const draftToPublish = draftRecipes.find(recipe => recipe.id === recipeId);
    if (draftToPublish) {
      // Move from drafts to published recipes
      const updatedDrafts = draftRecipes.filter(recipe => recipe.id !== recipeId);
      const updatedUserRecipes = [...userRecipes, draftToPublish];
      
      setDraftRecipes(updatedDrafts);
      setUserRecipes(updatedUserRecipes);
      
      localStorage.setItem('draftRecipes', JSON.stringify(updatedDrafts));
      localStorage.setItem('userRecipes', JSON.stringify(updatedUserRecipes));
      
      toast({
        title: "Recipe Published",
        description: "Your recipe is now live!"
      });
    }
  };

  const allUserRecipes = [...userRecipes, ...draftRecipes];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-mint-light">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-warm mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-gradient-warm text-primary-foreground">
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <Input
                            value={editedUser.name}
                            onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Bio</label>
                          <Textarea
                            value={editedUser.bio}
                            onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Avatar URL</label>
                          <Input
                            placeholder="Enter image URL..."
                            value={editedUser.avatar}
                            onChange={(e) => setEditedUser(prev => ({ ...prev, avatar: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={saveProfile} className="flex-1">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={cancelEdit} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <p className="text-muted-foreground mb-4 max-w-2xl">{user.bio}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <ChefHat className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-2xl">{allUserRecipes.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Recipes Created</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-2xl">{favoriteRecipes.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-2xl">{draftRecipes.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Tabs */}
        <Tabs defaultValue="my-recipes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-soft">
            <TabsTrigger value="my-recipes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Recipes ({userRecipes.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Favorites ({favoriteRecipes.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Drafts ({draftRecipes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-recipes">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  My Published Recipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRecipes.length > 0 ? (
                  <RecipeGrid 
                    recipes={userRecipes} 
                    emptyMessage="You haven't published any recipes yet. Create your first recipe to get started!"
                  />
                ) : (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No published recipes yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your culinary creations with the community
                    </p>
                    <Button onClick={() => window.location.href = '/create'}>
                      Create Your First Recipe
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Favorite Recipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteRecipes.length > 0 ? (
                  <RecipeGrid 
                    recipes={favoriteRecipes} 
                    emptyMessage="You haven't favorited any recipes yet. Explore recipes and save your favorites!"
                  />
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No favorite recipes yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Discover amazing recipes and save them to your favorites
                    </p>
                    <Button onClick={() => window.location.href = '/'} variant="outline">
                      Explore Recipes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Draft Recipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {draftRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {draftRecipes.map((recipe) => (
                      <Card key={recipe.id} className="border-0 shadow-soft hover:shadow-warm transition-all duration-300">
                        <div className="relative">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-50">
                            Draft
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {recipe.category} • {recipe.cookingTime} • {recipe.servings} servings
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => publishDraft(recipe.id)}
                              className="flex-1"
                            >
                              Publish
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDraft(recipe.id)}
                              className="flex-1"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No draft recipes</h3>
                    <p className="text-muted-foreground mb-4">
                      Draft recipes are automatically saved when you create them
                    </p>
                    <Button onClick={() => window.location.href = '/create'} variant="outline">
                      Create New Recipe
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;