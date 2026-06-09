import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Select } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { Button } from '../../../../components/ui/Button';

export const Preferences: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">General Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize your application experience</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-6 pt-4">
            <div className="space-y-5">
              <Select
                label="Language"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'jp', label: 'Japanese' },
                ]}
                defaultValue="en"
              />
              <Select
                label="Timezone"
                options={[
                  { value: 'utc', label: 'UTC' },
                  { value: 'est', label: 'Eastern Time' },
                  { value: 'pst', label: 'Pacific Time' },
                  { value: 'cet', label: 'Central European Time' },
                  { value: 'ist', label: 'Indian Standard Time' },
                ]}
                defaultValue="utc"
              />
              <Checkbox label="Dark mode" defaultChecked />
              <Checkbox label="Auto-save drafts" defaultChecked />
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