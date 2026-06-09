import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { Button } from '../../../../components/ui/Button';

export const Notifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose how you want to be notified</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-5 pt-4">
            <div className="space-y-4">
              <Checkbox label="Email notifications" defaultChecked />
              <Checkbox label="SMS notifications" />
              <Checkbox label="Push notifications" defaultChecked />
              <Checkbox label="Weekly summary" defaultChecked />
              <Checkbox label="Marketing emails" />
              <Checkbox label="Security alerts" defaultChecked />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <Button variant="secondary" className="w-full sm:w-auto">Cancel</Button>
              <Button className="w-full sm:w-auto">Save Preferences</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};