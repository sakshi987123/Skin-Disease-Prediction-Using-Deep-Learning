import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, CheckCircle, FileText, AlertCircle, ChevronRight,
  User, Stethoscope, Download, ArrowRight, History, AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { apiService } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { getDiseaseInfo } from '../../../utils/diseaseInfo';
import { generateMedicalReport } from '../../../utils/reportGenerator';
import { useAuth } from '../../../contexts/AuthContext';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<any> }> = {
  pending: {
    label: 'Awaiting Doctor Review',
    color: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700',
    icon: Clock,
  },
  reviewed: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700',
    icon: Stethoscope,
  },
  finalized: {
    label: 'Report Ready',
    color: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700',
    icon: CheckCircle,
  },
};

export const DiagnosisHistory: React.FC = () => {
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'finalized'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    apiService.getMyDiagnoses()
      .then(setDiagnoses)
      .catch(() => showError('Load failed', 'Could not fetch your diagnosis history.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = diagnoses.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'pending') return d.status === 'pending' || d.status === 'reviewed';
    if (filter === 'finalized') return d.status === 'finalized';
    return true;
  });

  const pendingCount = diagnoses.filter(d => d.status === 'pending' || d.status === 'reviewed').length;
  const finalizedCount = diagnoses.filter(d => d.status === 'finalized').length;

  const handleDownload = (diag: any) => {
    generateMedicalReport({
      patientName: user ? `${user.firstName} ${user.lastName}` : undefined,
      disease: diag.prediction?.disease,
      confidence: diag.prediction?.confidence,
      model: diag.prediction?.modelUsed,
      symptoms: diag.symptoms,
      advice: diag.recommendations?.[0],
      analysisType: diag.imageUrl ? 'image' : 'symptom',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">My Consultation History</h1>
          </div>
          <p className="text-muted-foreground">Track all your submitted consultations and doctor reports.</p>
        </div>
        <Link to="/app/consult">
          <Button className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" /> New Consultation
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardBody className="py-4">
            <p className="text-2xl font-black text-foreground">{diagnoses.length}</p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Total</p>
          </CardBody>
        </Card>
        <Card className="text-center border-amber-200 dark:border-amber-800">
          <CardBody className="py-4">
            <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Pending</p>
          </CardBody>
        </Card>
        <Card className="text-center border-green-200 dark:border-green-800">
          <CardBody className="py-4">
            <p className="text-2xl font-black text-green-600">{finalizedCount}</p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Completed</p>
          </CardBody>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'finalized'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              filter === f
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'pending' ? 'Awaiting Review' : 'Completed'}
            {f === 'all' && ` (${diagnoses.length})`}
            {f === 'pending' && ` (${pendingCount})`}
            {f === 'finalized' && ` (${finalizedCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="border-dashed py-16">
          <CardBody className="text-center space-y-3">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-40">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No records found</h3>
            <p className="text-muted-foreground text-sm">
              {filter === 'all' ? "You haven't submitted any consultations yet." : `No ${filter} consultations.`}
            </p>
            {filter === 'all' && (
              <Link to="/app/consult">
                <Button className="mt-2">Request Your First Consultation</Button>
              </Link>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((diag) => {
            const cfg = STATUS_CONFIG[diag.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            const isExpanded = expanded === diag._id;
            const diseaseInfo = diag.prediction?.disease ? getDiseaseInfo(diag.prediction.disease) : null;

            return (
              <Card
                key={diag._id}
                className={`overflow-hidden transition-all ${isExpanded ? 'shadow-lg border-primary/30' : 'hover:shadow-md'}`}
              >
                {/* Card header row */}
                <button
                  className="w-full text-left"
                  onClick={() => setExpanded(isExpanded ? null : diag._id)}
                >
                  <div className="flex items-center gap-4 p-5">
                    {/* Image thumbnail or icon */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                      {diag.imageUrl ? (
                        <img src={diag.imageUrl} alt="skin" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        {diag.isUrgent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/20 dark:text-red-400 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Urgent
                          </span>
                        )}
                        {diag.prediction?.disease && (
                          <span className="text-xs font-bold text-foreground">
                            {diag.prediction.disease.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(diag.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {diag.doctor && ` · Dr. ${diag.doctor.firstName} ${diag.doctor.lastName}`}
                      </p>
                      {diag.symptoms?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {diag.symptoms.slice(0, 3).map((s: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground border border-border">
                              {s}
                            </span>
                          ))}
                          {diag.symptoms.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{diag.symptoms.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Confidence + chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {diag.prediction?.confidence != null && (
                        <div className="text-right">
                          <p className={`text-lg font-black ${diag.prediction.confidence < 50 ? 'text-amber-500' : 'text-primary'}`}>
                            {diag.prediction.confidence}%
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Confidence</p>
                        </div>
                      )}
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Pending notice */}
                    {(diag.status === 'pending' || diag.status === 'reviewed') && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-800">
                        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-800 dark:text-amber-400 text-sm">Waiting for Doctor Review</p>
                          <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
                            Your consultation has been submitted and is in the doctor's queue. You'll see the report here once it's finalized.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Diagnosis result (finalized) */}
                    {diag.status === 'finalized' && diag.prediction && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">AI Diagnosis</p>
                          <h3 className="text-xl font-extrabold text-foreground uppercase tracking-tight">
                            {diag.prediction.disease.replace(/_/g, ' ')}
                          </h3>
                          {diseaseInfo && (
                            <p className="text-xs text-muted-foreground">{diseaseInfo.fullName}</p>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${diag.prediction.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-black text-primary">{diag.prediction.confidence}%</span>
                          </div>
                          {diag.prediction.modelUsed && (
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                              Model: {diag.prediction.modelUsed}
                            </p>
                          )}
                        </div>

                        {/* Doctor notes */}
                        {diag.doctorNotes && (
                          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" /> Doctor's Notes
                            </p>
                            <p className="text-sm text-foreground leading-relaxed italic">"{diag.doctorNotes}"</p>
                            {diag.doctor && (
                              <p className="text-[10px] text-muted-foreground font-semibold">
                                — Dr. {diag.doctor.firstName} {diag.doctor.lastName}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recommendations */}
                    {diag.recommendations?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Doctor's Recommendations</p>
                        <div className="space-y-1.5">
                          {diag.recommendations.map((rec: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border/50">
                              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disease info from local DB */}
                    {diseaseInfo && diag.status === 'finalized' && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-primary">About This Condition</p>
                        <p className="text-sm text-foreground leading-relaxed">{diseaseInfo.description}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {diag.status === 'finalized' && (
                      <div className="flex flex-wrap gap-3 pt-1">
                        <Button
                          variant="outline"
                          onClick={() => handleDownload(diag)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Download Report
                        </Button>
                        <Link to="/app/consult" state={{ followup: { disease: diag.prediction?.disease, symptoms: diag.symptoms } }}>
                          <Button variant="secondary" className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" /> Request Follow-up
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
