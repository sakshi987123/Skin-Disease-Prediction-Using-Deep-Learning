import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-card-foreground">Profile Information</h2>
      </CardHeader>
      <CardBody>
        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="First Name"
              defaultValue={user?.firstName || ''}
            />
            <Input
              label="Last Name"
              defaultValue={user?.lastName || ''}
            />
          </div>
          <Input
            label="Email"
            type="email"
            defaultValue={user?.email || ''}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="Enter your phone number"
          />
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
