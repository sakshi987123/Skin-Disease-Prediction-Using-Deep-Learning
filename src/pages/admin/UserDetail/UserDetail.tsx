import React from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, MapPin, Building, Shield } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { PageLayout } from '../../../components/layout/PageLayout';

// Mock user data - in a real app this would come from an API
const mockUsers = [
  { 
    id: 1, 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john.doe@example.com', 
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    status: 'active',
    joinDate: '2023-01-15',
    lastActive: '2024-01-20',
    address: '123 Main St, New York, NY 10001',
    department: 'Engineering',
    position: 'Senior Developer'
  },
  { 
    id: 2, 
    firstName: 'Jane', 
    lastName: 'Smith', 
    email: 'jane.smith@example.com', 
    phone: '+1 (555) 987-6543',
    role: 'Manager',
    status: 'active',
    joinDate: '2023-03-22',
    lastActive: '2024-01-19',
    address: '456 Park Ave, Los Angeles, CA 90210',
    department: 'Marketing',
    position: 'Marketing Manager'
  },
  { 
    id: 3, 
    firstName: 'Robert', 
    lastName: 'Johnson', 
    email: 'robert.johnson@example.com', 
    phone: '+1 (555) 456-7890',
    role: 'User',
    status: 'inactive',
    joinDate: '2023-07-10',
    lastActive: '2023-12-15',
    address: '789 Broadway, Chicago, IL 60601',
    department: 'Sales',
    position: 'Sales Representative'
  }
];

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '1');
  const user = mockUsers.find(u => u.id === userId) || mockUsers[0];

  const statusColor = user.status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';

  return (
    <PageLayout title="User Details" showBackButton>
      <div className="space-y-6">
        {/* User Profile Card */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto md:mx-0">
                  <span className="text-primary-foreground text-3xl font-bold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-muted-foreground">{user.position}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.department}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Joined: {user.joinDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Last Active: {user.lastActive}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Edit User</Button>
          <Button variant="secondary">Send Message</Button>
          {user.status === 'active' ? (
            <Button variant="danger">Deactivate User</Button>
          ) : (
            <Button variant="primary">Activate User</Button>
          )}
        </div>
        
        {/* User Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                { action: 'Logged in', time: '2 hours ago', ip: '192.168.1.100' },
                { action: 'Updated profile', time: '1 day ago', ip: '192.168.1.100' },
                { action: 'Changed password', time: '3 days ago', ip: '192.168.1.100' },
                { action: 'Logged in', time: '1 week ago', ip: '192.168.1.100' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">IP: {activity.ip}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </PageLayout>
  );
};