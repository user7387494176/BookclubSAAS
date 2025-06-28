import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useTheme } from '../../contexts/ThemeContext';

const Layout: React.FC = () => {
  const { customBackground } = useTheme();

  return (
    <div 
      className="min-h-screen theme-background transition-colors"
      style={customBackground ? { 
        backgroundImage: `url(${customBackground})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      <Header />
      <main className={customBackground ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm min-h-screen' : ''}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;