import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  LogOut,
  ChevronLeft,
  Menu,
  Upload,
  Heart,
  Image as ImageIcon,
  FilePlus,
  Send,
  ClipboardList,
  Stethoscope,
  History,
  CheckSquare,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle, isMobile = false }) => {
  const { user, logout } = useAuth();
  const isDoctor = user?.role === 'manager' || user?.role === 'doctor';
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    if (!isDoctor) return;
    import('../../services/api').then(({ apiService }) => {
      apiService.getPendingRequests()
        .then((data: any[]) => setPendingCount(data.length))
        .catch(() => {});
    });
  }, [isDoctor]);

  const navItems = [
    // Patient/Doctor Dashboard
    { path: '/app/user-dashboard', icon: LayoutDashboard, label: 'Dashboard', mobileLabel: 'Home', roles: ['user', 'patient', 'manager', 'doctor'] },
    
    // Patient-only features
    { path: '/app/consult', icon: Send, label: 'Consult Doctor', mobileLabel: 'Consult', roles: ['user', 'patient'] },
    { path: '/app/my-history', icon: History, label: 'My Consultations', mobileLabel: 'History', roles: ['user', 'patient'] },

    // Doctor-only features
    { path: '/app/pending-list', icon: ClipboardList, label: 'Pending Consultations', mobileLabel: 'Pending', roles: ['manager', 'doctor'] },
    { path: '/app/completed-cases', icon: CheckSquare, label: 'Completed Cases', mobileLabel: 'Completed', roles: ['manager', 'doctor'] },
    { path: '/app/upload-image', icon: Upload, label: 'AI Diagnostic Tools', mobileLabel: 'Predict', roles: ['manager', 'doctor'] },
    { path: '/app/symptoms', icon: Stethoscope, label: 'Symptom Analysis', mobileLabel: 'Symptoms', roles: ['manager', 'doctor'] },

    // Patient: doctor-shared reports (read-only, finalized only)
    { path: '/app/reports', icon: FileText, label: 'Doctor Reports', mobileLabel: 'Reports', roles: ['user', 'patient'] },

    // Doctor: analytics
    { path: '/app/analytics', icon: BarChart3, label: 'Healthcare Analytics', mobileLabel: 'Analytics', roles: ['manager', 'doctor'] },
    
    // Settings
    { path: '/app/user-settings', icon: Settings, label: 'Settings', mobileLabel: 'Settings', roles: ['user', 'patient', 'manager', 'doctor'] },
  ].map(item => {
    if (item.path === '/app/user-dashboard' && user) {
      return {
        ...item,
        label: (user.role === 'user' || user.role === 'patient') ? 'Patient Dashboard' : 'Doctor Dashboard'
      };
    }
    return item;
  });

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  // For mobile bottom nav, show all available items (no logout button)
  const displayItems = filteredNavItems;

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-30">
        <div className="flex">
          {displayItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-1 flex-1 min-w-0 transition-colors
                  ${isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      {item.path === '/app/pending-list' && pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center leading-tight mt-1">{item.mobileLabel || item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-background border-r border-border
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
          lg:relative
          max-w-full
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {isOpen && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Stethoscope className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-foreground truncate">DermaCure AI</h2>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    (user?.role === 'user' || user?.role === 'patient')
                      ? 'bg-primary/10 text-primary'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {(user?.role === 'user' || user?.role === 'patient') ? 'Patient Portal' : 'Doctor Portal'}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hidden lg:block"
            >
              {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {displayItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                          : 'text-foreground hover:bg-primary/10 hover:text-primary'
                        }`
                      }
                      title={!isOpen ? item.label : undefined}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {isOpen && <span className="font-medium truncate flex-1">{item.label}</span>}
                      {isOpen && item.path === '/app/pending-list' && pendingCount > 0 && (
                        <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                          {pendingCount}
                        </span>
                      )}
                      {!isOpen && item.path === '/app/pending-list' && pendingCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            {isOpen && user && (
              <div className="mb-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-semibold truncate">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Theme Toggle */}
            {isOpen && (
              <div className="mb-3">
                <ThemeToggle className="w-full" />
              </div>
            )}
            
            <button
              onClick={logout}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-destructive hover:bg-destructive/10 transition-colors w-full
                ${!isOpen && 'justify-center'}
              `}
              title={!isOpen ? 'Logout' : undefined}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};