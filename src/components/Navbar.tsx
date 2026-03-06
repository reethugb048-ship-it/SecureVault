
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Upload, 
  User, 
  Home, 
  Menu, 
  X
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 glass-effect shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-semibold text-xl flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Lock className="h-5 w-5 text-primary" />
          <span>Vaultify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" current={location.pathname}>
            <Home className="h-4 w-4 mr-1" />
            Home
          </NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" current={location.pathname}>
                <Lock className="h-4 w-4 mr-1" />
                Dashboard
              </NavLink>
              <NavLink to="/upload" current={location.pathname}>
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </NavLink>
              <NavLink to="/profile" current={location.pathname}>
                <User className="h-4 w-4 mr-1" />
                Profile
              </NavLink>
            </>
          )}
        </nav>

        {/* Authentication Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              onClick={logout}
              className="font-medium"
            >
              Sign Out
            </Button>
          ) : (
            <Link to="/dashboard">
              <Button className="font-medium">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-5 px-4 glass-effect animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <MobileNavLink to="/" label="Home" icon={<Home className="h-5 w-5" />} />
            
            {isAuthenticated && (
              <>
                <MobileNavLink to="/dashboard" label="Dashboard" icon={<Lock className="h-5 w-5" />} />
                <MobileNavLink to="/upload" label="Upload" icon={<Upload className="h-5 w-5" />} />
                <MobileNavLink to="/profile" label="Profile" icon={<User className="h-5 w-5" />} />
              </>
            )}
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={logout}
                className="w-full justify-start font-medium"
              >
                Sign Out
              </Button>
            ) : (
              <Link to="/dashboard" className="w-full">
                <Button className="w-full">
                  Get Started
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

// Desktop NavLink component
const NavLink = ({ 
  to, 
  current, 
  children 
}: { 
  to: string; 
  current: string; 
  children: React.ReactNode;
}) => {
  const isActive = current === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center px-1 py-1 text-sm font-medium transition-all ${
        isActive 
          ? 'text-primary border-b-2 border-primary' 
          : 'text-foreground/80 hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
};

// Mobile NavLink component
const MobileNavLink = ({ 
  to, 
  label, 
  icon 
}: { 
  to: string; 
  label: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Navbar;
