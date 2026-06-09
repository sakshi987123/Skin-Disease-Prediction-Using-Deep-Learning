import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuToggle, title }) => {
  const { user } = useAuth();
  
  return (
    <header className="lg:hidden bg-background border-b border-border px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-accent text-foreground"
          >
            <Menu size={20} />
          </button>
        </div>
        
        <div className="flex-grow text-center">
          <h1 className="text-lg font-bold text-foreground truncate">
            {title || 'DermaCure AI'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-accent text-foreground relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">
              {user?.firstName?.[0] || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};