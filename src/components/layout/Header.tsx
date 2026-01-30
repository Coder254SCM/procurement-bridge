import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, X, User, LogOut, Settings, ChevronDown, FileText, ShoppingCart, Gavel, Handshake, Target, Award, PenTool, ClipboardList, Package } from 'lucide-react';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const Header = () => {
  const { user, signOut } = useAuth();
  const { isBuyer, isSupplier, primaryRole, loading: rolesLoading } = useUserRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const procurementMethods = [
    { name: 'Open Tender', href: '/tenders?method=open_tender', icon: FileText },
    { name: 'Restricted Tender', href: '/tenders?method=restricted_tender', icon: Target },
    { name: 'Direct Procurement', href: '/tenders?method=direct_procurement', icon: Handshake },
    { name: 'Request for Proposal', href: '/tenders?method=request_for_proposal', icon: PenTool },
    { name: 'Request for Quotation', href: '/tenders?method=request_for_quotation', icon: ShoppingCart },
    { name: 'Framework Agreement', href: '/framework-agreements', icon: Award },
    { name: 'Reverse Auction', href: '/tenders?method=reverse_auction', icon: Gavel },
  ];

  // Role-based navigation
  const getNavigation = (): Array<{ name: string; href: string; dropdown?: boolean }> => {
    const base = [
      { name: 'Dashboard', href: '/dashboard' },
    ];

    // Buyers get full procurement menu
    if (isBuyer) {
      return [
        ...base,
        { name: 'Catalog', href: '/catalog' },
        { name: 'Requisitions', href: '/requisitions' },
        { name: 'Procurement', href: '', dropdown: true },
        { name: 'Marketplace', href: '/marketplace' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Team', href: '/team' },
      ];
    }

    // Suppliers get different menu
    if (isSupplier) {
      return [
        ...base,
        { name: 'Tenders', href: '/tenders' },
        { name: 'My Bids', href: '/supplier-dashboard' },
        { name: 'Contracts', href: '/contracts' },
        { name: 'Marketplace', href: '/marketplace' },
        { name: 'Verification', href: '/verification' },
      ];
    }

    // Default/evaluator
    return [
      ...base,
      { name: 'Evaluations', href: '/evaluations' },
      { name: 'Tenders', href: '/tenders' },
    ];
  };

  const navigation = getNavigation();

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                ProcureChain
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-6 items-center">
              {user && !rolesLoading && navigation.map((item) => (
                item.dropdown ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <button className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="start">
                      <DropdownMenuLabel>Procurement Methods</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {procurementMethods.map((method) => (
                          <DropdownMenuItem key={method.name} asChild>
                            <Link to={method.href} className="flex items-center">
                              <method.icon className="mr-2 h-4 w-4" />
                              {method.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs">More</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to="/budgets" className="flex items-center">Budgets</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/qualifications" className="flex items-center">Qualifications</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/contract-performance" className="flex items-center">Performance</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/contracts" className="flex items-center">Contracts</Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                          {primaryRole || 'User'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/verification" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Verification
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {user && <NotificationCenter />}
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {navigation.map((item) => (
                    !item.dropdown && (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                  {isBuyer && (
                    <>
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">Procurement</div>
                      {procurementMethods.slice(0, 4).map((method) => (
                        <Link
                          key={method.name}
                          to={method.href}
                          className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-6 pr-4 py-2 border-l-4 text-base font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {method.name}
                        </Link>
                      ))}
                    </>
                  )}
                  <Link
                    to="/profile"
                    className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-2 p-3">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
