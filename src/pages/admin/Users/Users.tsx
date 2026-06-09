import React from 'react';
import { Search, UserPlus, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Users: React.FC = () => {
  const navigate = useNavigate();
  
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', role: 'Manager', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', role: 'User', status: 'active' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1234567893', role: 'User', status: 'inactive' },
  ];

  const handleUserClick = (userId: number) => {
    navigate(`/app/users/${userId}`);
  };

  return (
    <div className="w-full">
      {/* Mobile view - custom header */}
      <div className="md:hidden">
        <div className="w-full min-h-screen bg-background">
          {/* Custom centered header for mobile */}
          <div className="bg-background border-b border-border p-4 sticky top-0 z-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Users</h1>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-4 pb-6">
            <div className="space-y-4 pt-2">
              <div className="flex justify-end mb-4">
                <Button className="w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search users..."
                        icon={<Search className="w-5 h-5 text-muted-foreground" />}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-0 overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-accent cursor-pointer" onClick={() => handleUserClick(user.id)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                  <span className="text-primary-foreground font-semibold">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-foreground">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-foreground flex items-center gap-1">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="break-all">{user.email}</span>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span className="break-all">{user.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-destructive/10 text-destructive'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-primary hover:text-primary/80 mr-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserClick(user.id);
                              }}
                            >
                              View
                            </button>
                            <button 
                              className="text-destructive hover:text-destructive/80"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block space-y-6 w-full p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">Users</h1>
            <p className="text-muted-foreground">Manage your team members and their roles</p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users..."
                  icon={<Search className="w-5 h-5 text-muted-foreground" />}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0 overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-accent cursor-pointer" onClick={() => handleUserClick(user.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground flex items-center gap-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="break-all">{user.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="break-all">{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-primary hover:text-primary/80 mr-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user.id);
                        }}
                      >
                        View
                      </button>
                      <button 
                        className="text-destructive hover:text-destructive/80"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};