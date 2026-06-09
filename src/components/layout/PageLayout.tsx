import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false,
  onBack 
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header with Back Button - shown only on small screens */}
      <div className="bg-background border-b border-border p-4 sticky top-0 z-20 md:hidden">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button 
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-accent text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="p-4 pb-6">
        {children}
      </div>
    </div>
  );
};