import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';

export const ToastDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, clearAllToasts } = useToast();

  return (
    <div className="p-6 space-y-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Demo</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={() => showSuccess('Success!', 'This is a success message')}
          variant="primary"
        >
          Show Success Toast
        </Button>
        
        <Button
          onClick={() => showError('Error!', 'This is an error message')}
          variant="danger"
        >
          Show Error Toast
        </Button>
        
        <Button
          onClick={() => showWarning('Warning!', 'This is a warning message')}
          variant="secondary"
        >
          Show Warning Toast
        </Button>
        
        <Button
          onClick={() => showInfo('Info', 'This is an info message')}
          variant="ghost"
        >
          Show Info Toast
        </Button>
        
        <Button
          onClick={clearAllToasts}
          variant="secondary"
          className="sm:col-span-2"
        >
          Clear All Toasts
        </Button>
      </div>
    </div>
  );
};

export default ToastDemo;