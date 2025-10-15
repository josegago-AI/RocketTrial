import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  const pathMap = {
    '/dashboard': 'Dashboard',
    '/transactions': 'Transactions',
    '/budgets': 'Budgets',
    '/goals': 'Goals',
    '/reports': 'Reports'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [];

    // Always start with Dashboard as home
    if (location?.pathname !== '/dashboard') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/dashboard',
        isActive: false
      });
    }

    // Add current page
    const currentPath = `/${pathSegments?.[0]}`;
    if (pathMap?.[currentPath]) {
      breadcrumbs?.push({
        label: pathMap?.[currentPath],
        path: currentPath,
        isActive: true
      });
    }

    // Handle sub-pages (like transaction details, budget editing, etc.)
    if (pathSegments?.length > 1) {
      const subPage = pathSegments?.[1];
      let subPageLabel = subPage?.charAt(0)?.toUpperCase() + subPage?.slice(1);
      
      // Handle common sub-page patterns
      if (subPage === 'new' || subPage === 'create') {
        subPageLabel = `New ${pathMap?.[currentPath]?.slice(0, -1)}`; // Remove 's' from plural
      } else if (subPage === 'edit') {
        subPageLabel = `Edit ${pathMap?.[currentPath]?.slice(0, -1)}`;
      } else if (!isNaN(subPage)) {
        subPageLabel = `${pathMap?.[currentPath]?.slice(0, -1)} Details`;
      }

      breadcrumbs?.push({
        label: subPageLabel,
        path: location?.pathname,
        isActive: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumbs if only one item (current page)
  if (breadcrumbs?.length <= 1 && location?.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-muted-foreground" />
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          )}
          
          {crumb?.isActive ? (
            <span className="font-medium text-foreground" aria-current="page">
              {crumb?.label}
            </span>
          ) : (
            <Link
              to={crumb?.path}
              className="hover:text-foreground transition-smooth focus-ring rounded-sm px-1 py-0.5"
            >
              {crumb?.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;