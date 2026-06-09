import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { MobileHeader } from './MobileHeader';
import { Chatbot } from '../Chatbot';
import { useAuth } from '../../contexts/AuthContext';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [title, setTitle] = useState('Dashboard');
  const { user } = useAuth();

  // Apply role-specific theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    const isDoctor = user?.role === 'manager' || user?.role === 'doctor';
    if (isDoctor) {
      root.classList.add('doctor');
    } else {
      root.classList.remove('doctor');
    }
    return () => { root.classList.remove('doctor'); };
  }, [user?.role]);

  // Check if current page uses PageLayout (has its own header) - only on mobile
  const usesPageLayout = location.pathname.includes('/profile') ||
                         location.pathname.includes('/security') ||
                         location.pathname.includes('/notifications') ||
                         location.pathname.includes('/preferences') ||
                         location.pathname.includes('/view-profile') ||
                         location.pathname.includes('/user-settings') ||
                         location.pathname.includes('/analytics') ||
                         location.pathname.includes('/reports');

  useEffect(() => {
    // Determine title based on current route
    const path = location.pathname;
    if (path.includes('dashboard')) setTitle('Dashboard');
    else if (path.includes('analytics')) setTitle('Healthcare Analytics');
    else if (path.includes('reports')) setTitle('Diagnostic Reports');
    else if (path.includes('users') && !path.includes('settings')) setTitle('User Management');
    else if (path.includes('profile')) setTitle('Profile');
    else if (path.includes('security')) setTitle('Security');
    else if (path.includes('notifications')) setTitle('Notifications');
    else if (path.includes('preferences')) setTitle('Preferences');
    else if (path.includes('view-profile')) setTitle('View Profile');
    else if (path.includes('settings')) setTitle('Settings');
    else if (path.includes('upload')) setTitle('Upload Image');
    else if (path.includes('my-history')) setTitle('My Consultations');
    else if (path.includes('completed-cases')) setTitle('Completed Cases');
    else if (path.includes('recommendations')) setTitle('Care Recommendations');
    else setTitle('DermaCure AI');
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-background w-full max-w-full">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Navigation isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-full">
        {/* Mobile Header - Only visible on mobile and only if page doesn't have its own header */}
        {!usesPageLayout && (
          <div className="lg:hidden">
            <MobileHeader 
              onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
              title={title}
            />
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 w-full max-w-full">
          <div className="container mx-auto  max-w-7xl w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation - Only visible on mobile */}
        <div className="lg:hidden">
          <Navigation isOpen={false} onToggle={() => {}} isMobile={true} />
        </div>
      </div>

      {/* Floating AI Chatbot */}
      <Chatbot />
    </div>
  );
};