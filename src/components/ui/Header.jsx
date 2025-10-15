import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Transactions', path: '/transactions', icon: 'Receipt' },
    { label: 'Budgets', path: '/budgets', icon: 'PiggyBank' },
    { label: 'Goals', path: '/goals', icon: 'Target' },
    { label: 'Reports', path: '/reports', icon: 'BarChart3' },
    { label: 'Guide', path: '/guide', icon: 'BookOpen' }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border elevation-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2 hover-lift">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="DollarSign" size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-foreground">FinanceFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover-lift ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" iconName="Bell" iconPosition="left">
            Notifications
          </Button>
          <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
            Settings
          </Button>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="var(--color-muted-foreground)" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMobileMenu}
          iconName={isMobileMenuOpen ? "X" : "Menu"}
        >
          Menu
        </Button>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border elevation-2">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border space-y-2">
              <Button variant="ghost" size="sm" fullWidth iconName="Bell" iconPosition="left">
                Notifications
              </Button>
              <Button variant="outline" size="sm" fullWidth iconName="Settings" iconPosition="left">
                Settings
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;