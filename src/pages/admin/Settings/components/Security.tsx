import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

export const Security: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Security Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your password and security preferences</p>
        </CardHeader>
        <CardBody>
          <form className="space-y-6 pt-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button variant="secondary" className="w-full sm:w-auto">Cancel</Button>
              <Button className="w-full sm:w-auto">Update Password</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};