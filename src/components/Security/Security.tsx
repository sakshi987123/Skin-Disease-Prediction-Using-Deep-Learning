import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const Security: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-card-foreground">Security Settings</h2>
      </CardHeader>
      <CardBody>
        <form className="space-y-5">
          <Input
            label="Current Password"
            type="password"
          />
          <Input
            label="New Password"
            type="password"
          />
          <Input
            label="Confirm New Password"
            type="password"
          />
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Update Password</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
