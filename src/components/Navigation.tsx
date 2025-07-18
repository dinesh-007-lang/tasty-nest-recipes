import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  Plus, 
  User, 
  ShoppingCart, 
  Menu,
  ChefHat,
  Heart,
  LogOut
} from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get shopping list count
  const shoppingListCount = JSON.parse(localStorage.getItem('shoppingList') || '[]').length;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Plus, label: 'Create', path: '/create' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
    { 
      icon: ShoppingCart, 
      label: 'Shopping List', 
      path: '/shopping-list',
      badge: shoppingListCount > 0 ? shoppingListCount : undefined
    }
  ];

  const NavLink = ({ item, mobile = false }: { item: typeof navItems[0], mobile?: boolean }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        onClick={() => mobile && setIsOpen(false)}
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
          ${isActive 
            ? 'bg-primary text-primary-foreground shadow-warm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
          ${mobile ? 'w-full' : ''}
        `}
      >
        <Icon className="w-5 h-5" />
        {mobile && <span className="font-medium">{item.label}</span>}
        {item.badge && (
          <Badge 
            variant="secondary" 
            className={`
              text-xs min-w-[20px] h-5 px-1.5
              ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary text-primary-foreground'}
              ${mobile ? 'ml-auto' : 'absolute -top-2 -right-2'}
            `}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm border border-primary/10 rounded-full px-6 py-3 shadow-warm">
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg bg-gradient-warm bg-clip-text text-transparent">
                TastyNest
              </span>
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-warm bg-clip-text text-transparent">
                      TastyNest
                    </span>
                  </div>
                  
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} mobile />
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t border-primary/10 px-4 py-2">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {navItems.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 text-xs min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};