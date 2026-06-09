import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { useAuth } from '../../../../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-1">Update your personal details here</p>
        </CardHeader>
        <CardBody>
          <form className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="First Name"
                defaultValue={user?.firstName || ''}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                defaultValue={user?.lastName || ''}
                placeholder="Enter your last name"
              />
              <Input
                label="Email"
                type="email"
                defaultValue={user?.email || ''}
                placeholder="Enter your email"
                disabled
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button variant="secondary" className="w-full sm:w-auto">Cancel</Button>
              <Button className="w-full sm:w-auto">Save Changes</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};