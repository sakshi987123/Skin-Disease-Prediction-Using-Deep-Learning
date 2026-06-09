import React, { useEffect, useState } from 'react';
import {
  TrendingUp, Activity, Users, CheckCircle, Clock,
  BarChart3, Cpu, AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { apiService } from '../../../services/api';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiService.getAnalytics()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const maxWeeklyCount = data ? Math.max(...data.weeklyVolume.map((d: any) => d.count), 1) : 1;
  const maxDiseaseCount = data?.diseaseDistribution?.[0]?.count || 1;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Healthcare Analytics</h1>
        <p className="text-muted-foreground mt-1">Real-time statistics from the DermaCure AI platform.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive font-medium">Could not load analytics. Make sure the backend server is running.</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: data?.totalCases, icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Pending Review', value: data?.pendingCases, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Completed', value: data?.completedCases, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Unique Patients', value: data?.uniquePatients, icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  <div className={`w-9 h-9 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <p className={`text-3xl font-black ${kpi.color}`}>{data ? kpi.value ?? 0 : '—'}</p>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Avg Confidence */}
      {!loading && data && (
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Average AI Confidence</p>
                <p className="text-4xl font-black text-primary">{data.avgConfidence}%</p>
                <p className="text-xs text-muted-foreground mt-1">Across all finalized diagnoses</p>
              </div>
              <div className="w-24 h-24 relative flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--muted)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="var(--primary)" strokeWidth="3"
                    strokeDasharray={`${data.avgConfidence} ${100 - data.avgConfidence}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-sm font-black text-primary">{data.avgConfidence}%</span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Volume Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-card-foreground">Cases This Week</h2>
            </div>
          </CardHeader>
          <CardBody className="p-5">
            {loading ? (
              <div className="flex items-end gap-2 h-40">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="flex-1" style={{ height: `${Math.random() * 80 + 20}%` } as any} />
                ))}
              </div>
            ) : data?.weeklyVolume ? (
              <div className="flex items-end gap-2 h-40">
                {data.weeklyVolume.map((d: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground">{d.count > 0 ? d.count : ''}</span>
                    <div className="w-full rounded-t-sm bg-primary/20 relative overflow-hidden" style={{ height: '100px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-700"
                        style={{ height: `${(d.count / maxWeeklyCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold">{d.day}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
            )}
          </CardBody>
        </Card>

        {/* Model Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-secondary" />
              <h2 className="text-base font-bold text-card-foreground">Model Performance</h2>
            </div>
          </CardHeader>
          <CardBody className="p-5 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)
            ) : data?.modelPerformance?.length > 0 ? (
              data.modelPerformance.map((m: any) => (
                <div key={m.model}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-foreground capitalize">{m.model}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{m.count} cases</span>
                      <span className={`text-sm font-black ${m.avgConfidence >= 75 ? 'text-green-600' : m.avgConfidence >= 55 ? 'text-amber-600' : 'text-destructive'}`}>
                        {m.avgConfidence}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${m.avgConfidence >= 75 ? 'bg-green-500' : m.avgConfidence >= 55 ? 'bg-amber-500' : 'bg-destructive'}`}
                      style={{ width: `${m.avgConfidence}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No finalized cases with model data yet</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Disease Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-card-foreground">Disease Distribution</h2>
            <span className="text-xs text-muted-foreground ml-auto">Top diagnosed conditions</span>
          </div>
        </CardHeader>
        <CardBody className="p-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : data?.diseaseDistribution?.length > 0 ? (
            <div className="space-y-3">
              {data.diseaseDistribution.map((d: any, i: number) => (
                <div key={d.disease}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-foreground">{d.disease.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">avg {d.avgConfidence}%</span>
                      <span className="text-xs font-bold text-foreground">{d.count} cases</span>
                      <span className="text-xs font-black text-primary w-10 text-right">{d.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${(d.count / maxDiseaseCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No finalized diagnoses yet. Complete some cases to see disease distribution.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
