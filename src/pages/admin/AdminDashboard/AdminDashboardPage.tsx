import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { PageLayout } from '../../../components/layout/PageLayout';

export const AdminDashboardPage: React.FC = () => {
  return (
    <PageLayout title="Admin Dashboard">
      <AdminDashboard />
    </PageLayout>
  );
};