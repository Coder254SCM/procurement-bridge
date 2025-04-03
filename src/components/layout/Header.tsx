
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tenders', path: '/tenders' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Analytics', path: '/analytics' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md',
        isScrolled 
          ? 'py-3 bg-white/80 shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/2767cbb7-f0e0-4434-a008-9c44991b8a8b.png" 
                alt="ProcureChain Logo" 
                className="h-8 w-auto mr-2" 
              />
              <span className="text-2xl font-semibold text-primary tracking-tight">ProcureChain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-foreground/80">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground/80">
              <Bell size={20} />
            </Button>
            <div className="w-px h-6 bg-border mx-1"></div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 aspect-square">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" className="text-foreground/80" onClick={() => navigate('/auth')}>
                <User size={18} className="mr-2" />
                <span>Sign In</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-3 rounded-md text-base font-medium transition-colors',
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="flex justify-between pt-4 border-t border-border">
              <Button variant="ghost" className="w-1/2 justify-start" onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/search');
              }}>
                <Search size={18} className="mr-2" />
                <span>Search</span>
              </Button>
              
              {user ? (
                <Button variant="ghost" className="w-1/2 justify-start" onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}>
                  <LogOut size={18} className="mr-2" />
                  <span>Sign Out</span>
                </Button>
              ) : (
                <Button variant="ghost" className="w-1/2 justify-start" onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/auth');
                }}>
                  <User size={18} className="mr-2" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
