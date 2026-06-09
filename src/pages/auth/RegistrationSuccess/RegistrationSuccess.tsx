import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

export const RegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Get user data from session storage and log them in
    const userData = sessionStorage.getItem('userData');
    const registrationEmail = sessionStorage.getItem('registrationEmail');
    
    if (userData && registrationEmail) {
      setIsLoggingIn(true);
      try {
        const user = JSON.parse(userData);
        setUser(user);
        // Clear session storage
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('registrationEmail');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Auto redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/app/user-dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 w-full">
      <Card className="w-full max-w-md">
        <CardBody className="p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Registration Successful!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Your account has been created successfully. You'll be redirected to your dashboard in a moment.
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/app/user-dashboard')}
              fullWidth
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-sm text-muted-foreground">
              Redirecting automatically in 3 seconds...
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};