import React from 'react';
import { Crown, Users, BarChart3, Settings, Shield, Database, Activity, Stethoscope, Image, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const adminFeatures = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage all patients, doctors, and administrators',
      status: 'Available',
      color: 'bg-primary',
    },
    {
      icon: Image,
      title: 'Image Analysis',
      description: 'Monitor AI model performance and image processing',
      status: 'Available',
      color: 'bg-secondary',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Advanced analytics and reporting for healthcare insights',
      status: 'Available',
      color: 'bg-accent',
    },
    {
      icon: Shield,
      title: 'Security Center',
      description: 'Security settings, audit logs, and compliance monitoring',
      status: 'Available',
      color: 'bg-destructive',
    },
    {
      icon: Database,
      title: 'AI Model Management',
      description: 'Manage and update deep learning models for diagnosis',
      status: 'Coming Soon',
      color: 'bg-muted',
    },
    {
      icon: Activity,
      title: 'System Monitoring',
      description: 'Real-time system health and performance monitoring',
      status: 'Available',
      color: 'bg-card',
    },
    {
      icon: FileText,
      title: 'Report Management',
      description: 'View and manage all diagnostic reports across the platform',
      status: 'Available',
      color: 'bg-primary',
    },
    {
      icon: Settings,
      title: 'System Configuration',
      description: 'Configure system-wide settings and preferences',
      status: 'Available',
      color: 'bg-secondary',
    },
  ];

  return (
    <div className="space-y-6 w-full p-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName}! 👑
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Administrator Dashboard - DermaCure AI
            </p>
          </div>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          You have full administrative access to manage users, monitor AI model performance, 
          configure system settings, and ensure the platform operates securely and efficiently.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">1,234</p>
                <p className="text-xs text-muted-foreground mt-1">Patients, Doctors, Admins</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diagnoses Today</p>
                <p className="text-2xl font-bold text-foreground">89</p>
                <p className="text-xs text-muted-foreground mt-1">AI analyses performed</p>
              </div>
              <Stethoscope className="w-8 h-8 text-secondary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
                <p className="text-xs text-muted-foreground mt-1">Uptime & performance</p>
              </div>
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-muted-foreground mt-1">Current users online</p>
              </div>
              <Activity className="w-8 h-8 text-accent" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-foreground">5,432</p>
                <p className="text-xs text-muted-foreground mt-1">Diagnostic reports generated</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
                <p className="text-2xl font-bold text-foreground">87.5%</p>
                <p className="text-xs text-muted-foreground mt-1">Model performance</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </div>
              <BarChart3 className="w-8 h-8 text-accent" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Admin Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Administrative Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className={`${feature.color} p-3 rounded-lg w-fit`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        feature.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {feature.status}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Model Health Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">AI Model Engine Health</h2>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Status
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                { name: 'EfficientNet-B0', accuracy: '92.4%', latency: '45ms', status: 'Active', load: '12%' },
                { name: 'ResNet50-V2', accuracy: '89.1%', latency: '120ms', status: 'Active', load: '45%' },
                { name: 'MobileNet-V3', accuracy: '86.2%', latency: '18ms', status: 'Active', load: '8%' },
                { name: 'VGG16-Legacy', accuracy: '84.5%', latency: '210ms', status: 'Maintenance', load: '0%' },
              ].map((model, index) => (
                <div key={index} className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground">{model.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      model.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Accuracy</p>
                      <p className="text-sm font-semibold">{model.accuracy}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Latency</p>
                      <p className="text-sm font-semibold">{model.latency}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Server Load</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: model.load }} />
                        </div>
                        <span className="text-[10px] font-bold">{model.load}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-semibold text-card-foreground">Deployment Alerts</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-2">
                <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase">
                  <AlertCircle className="w-3 h-3" /> Critical Alert
                </div>
                <p className="text-sm font-semibold">Legacy VGG16 model latency high</p>
                <p className="text-xs text-muted-foreground">Response time exceeded 200ms threshold. Recommend switching to MobileNet.</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                  <Activity className="w-3 h-3" /> System Update
                </div>
                <p className="text-sm font-semibold">EfficientNet-B3 retraining scheduled</p>
                <p className="text-xs text-muted-foreground"> रिट्रेनिंग scheduled for 15th April 12:00 AM.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent System Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-card-foreground">Recent System Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { action: 'New patient registered', user: 'john.doe@example.com', time: '2 minutes ago', type: 'user' },
              { action: 'AI diagnosis completed', user: 'Patient #1234', time: '5 minutes ago', type: 'diagnosis' },
              { action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'system' },
              { action: 'Security scan completed', user: 'Security Bot', time: '2 hours ago', type: 'security' },
              { action: 'Database optimization', user: 'System', time: '3 hours ago', type: 'system' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-primary' :
                    activity.type === 'diagnosis' ? 'bg-secondary' :
                    activity.type === 'system' ? 'bg-accent' :
                    'bg-destructive'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
