import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Card, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole } from '../../../types/auth.types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get role from navigation state
  const preSelectedRole = (location.state as { role?: UserRole })?.role || 'user';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    mobile: '',
    role: preSelectedRole as UserRole,
    acceptedTerms: false,
  });

  // Update role if it changes from navigation state
  useEffect(() => {
    if (preSelectedRole) {
      setFormData(prev => ({ ...prev, role: preSelectedRole }));
    }
  }, [preSelectedRole]);

  const getRoleInfo = (role: UserRole) => {
    const roles = {
      user: { label: 'Patient', color: 'bg-primary', icon: '👤' },
      manager: { label: 'Doctor', color: 'bg-secondary', icon: '🩺' },
    };
    return roles[role];
  };

  const roleInfo = getRoleInfo(formData.role);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.acceptedTerms) {
      setError('You must accept the terms and conditions');
      return false;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.mobile.replace(/\s/g, ''))) {
      setError('Please enter a valid mobile number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/verify-otp', {
        state: {
          email: formData.email,
          isRegistration: true,
          userData: JSON.parse(sessionStorage.getItem('userData') || '{}')
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-destructive' };
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-primary' };
  };

  const passwordCheck = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 w-full">
      <Card className="w-full max-w-2xl">
        <CardBody className="p-8">
          <Link
            to="/select-role"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change role
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className={`${roleInfo.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl text-primary-foreground`}>
                {roleInfo.icon}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create {roleInfo.label} Account
            </h1>
            <p className="text-muted-foreground">Complete your registration as a {roleInfo.label.toLowerCase()}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                icon={<User className="w-5 h-5 text-muted-foreground" />}
                required
              />

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                icon={<User className="w-5 h-5 text-muted-foreground" />}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="w-5 h-5 text-muted-foreground" />}
              required
            />

            <Input
              label="Mobile Number"
              type="tel"
              name="mobile"
              placeholder="+1234567890"
              value={formData.mobile}
              onChange={handleChange}
              icon={<Phone className="w-5 h-5 text-muted-foreground" />}
              helperText="Include country code (e.g., +1 for US)"
              required
            />

            {/* Hidden role field - already selected */}
            <input type="hidden" name="role" value={formData.role} />

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                icon={<Lock className="w-5 h-5 text-muted-foreground" />}
                required
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordCheck.label === 'Weak' ? 'text-destructive' :
                      passwordCheck.label === 'Medium' ? 'text-yellow-500' : 'text-primary'
                      }`}>
                      {passwordCheck.label}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${passwordCheck.color}`}
                      style={{ width: `${(passwordCheck.strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={
                formData.confirmPassword && formData.password === formData.confirmPassword ? (
                  <CheckCircle className="w-5 h-5 text-primary" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )
              }
              required
            />

            <Checkbox
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              label={
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary/80 font-medium">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              }
              required
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Want a different role?{' '}
              <Link
                to="/select-role"
                className="font-medium text-primary hover:text-primary/80"
              >
                Change role
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};