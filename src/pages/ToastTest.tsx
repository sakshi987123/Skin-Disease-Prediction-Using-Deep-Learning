import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

export const ToastTest: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, clearAllToasts } = useToast();

  return (
    <div className="min-h-screen bg-background py-8 w-full">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardBody className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-6">Toast Notification Test</h1>
            <p className="text-muted-foreground mb-8">
              Click the buttons below to test different types of toast notifications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => showSuccess('Success!', 'This is a success message that will appear as a toast notification.')}
                variant="primary"
              >
                Show Success Toast
              </Button>
              
              <Button
                onClick={() => showError('Error!', 'This is an error message that will appear as a toast notification.')}
                variant="danger"
              >
                Show Error Toast
              </Button>
              
              <Button
                onClick={() => showWarning('Warning!', 'This is a warning message that will appear as a toast notification.')}
                variant="secondary"
              >
                Show Warning Toast
              </Button>
              
              <Button
                onClick={() => showInfo('Info', 'This is an info message that will appear as a toast notification.')}
                variant="ghost"
              >
                Show Info Toast
              </Button>
              
              <Button
                onClick={() => {
                  showSuccess('Multiple Toasts', 'First toast');
                  setTimeout(() => showError('Multiple Toasts', 'Second toast'), 500);
                  setTimeout(() => showWarning('Multiple Toasts', 'Third toast'), 1000);
                }}
                variant="primary"
                className="md:col-span-2"
              >
                Show Multiple Toasts
              </Button>
              
              <Button
                onClick={clearAllToasts}
                variant="secondary"
                className="md:col-span-2"
              >
                Clear All Toasts
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-2">Instructions:</h3>
              <ul className="text-primary/80 space-y-1">
                <li>• Click any button to show a toast notification</li>
                <li>• Toasts will appear in the top-right corner (desktop) or full-width on mobile</li>
                <li>• They will auto-dismiss after 5 seconds</li>
                <li>• You can click the X button to close them manually</li>
                <li>• Multiple toasts will stack vertically</li>
                <li>• <strong>Mobile Test:</strong> Resize your browser or use mobile view to test responsiveness</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ToastTest;