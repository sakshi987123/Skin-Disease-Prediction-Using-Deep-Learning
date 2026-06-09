import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, User, FileText, ChevronRight, History,
  Stethoscope, AlertCircle, Download, Search,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { apiService } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { generateMedicalReport } from '../../../utils/reportGenerator';

export const CompletedCases: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    apiService.getCompletedCases()
      .then(setCases)
      .catch(() => showError('Load failed', 'Could not fetch completed cases.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = `${c.user?.firstName} ${c.user?.lastName}`.toLowerCase();
    const disease = (c.prediction?.disease || '').toLowerCase();
    return name.includes(q) || disease.includes(q);
  });

  const handleDownload = (c: any) => {
    generateMedicalReport({
      patientName: c.user ? `${c.user.firstName} ${c.user.lastName}` : undefined,
      disease: c.prediction?.disease,
      confidence: c.prediction?.confidence,
      model: c.prediction?.modelUsed,
      symptoms: c.symptoms,
      advice: c.recommendations?.[0],
      analysisType: c.imageUrl ? 'image' : 'symptom',
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Completed Cases</h1>
          </div>
          <p className="text-muted-foreground">All finalized patient consultations reviewed by your team.</p>
        </div>
        <Link to="/app/pending-list">
          <Button variant="outline" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" /> View Pending Queue
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardBody className="py-4">
            <p className="text-2xl font-black text-foreground">{cases.length}</p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Total Completed</p>
          </CardBody>
        </Card>
        <Card className="text-center border-green-200 dark:border-green-800">
          <CardBody className="py-4">
            <p className="text-2xl font-black text-green-600">
              {cases.filter(c => c.isVisibleToPatient).length}
            </p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Shared with Patient</p>
          </CardBody>
        </Card>
        <Card className="text-center border-primary/20 hidden md:block">
          <CardBody className="py-4">
            <p className="text-2xl font-black text-primary">
              {cases.filter(c => c.prediction?.confidence >= 80).length}
            </p>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">High Confidence</p>
          </CardBody>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by patient name or diagnosis..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Cases list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed py-16">
          <CardBody className="text-center space-y-3">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-40">
              <CheckCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {search ? 'No matching cases' : 'No completed cases yet'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {search ? 'Try a different search term.' : 'Finalized cases will appear here after you review pending consultations.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const isExpanded = expanded === c._id;

            return (
              <Card
                key={c._id}
                className={`overflow-hidden transition-all ${isExpanded ? 'shadow-lg border-primary/30' : 'hover:shadow-md'}`}
              >
                <button
                  className="w-full text-left"
                  onClick={() => setExpanded(isExpanded ? null : c._id)}
                >
                  <div className="flex items-center gap-4 p-5">
                    {/* Patient image or avatar */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt="skin" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-foreground">
                          {c.user?.firstName} {c.user?.lastName}
                        </p>
                        {c.isVisibleToPatient ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700">
                            Shared
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                            Not shared
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {c.user?.email} · Finalized {new Date(c.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      {c.symptoms?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {c.symptoms.slice(0, 3).map((s: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground border border-border">
                              {s}
                            </span>
                          ))}
                          {c.symptoms.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{c.symptoms.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Disease + confidence */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {c.prediction && (
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-foreground text-sm">
                            {c.prediction.disease?.replace(/_/g, ' ')}
                          </p>
                          <p className={`text-sm font-black ${c.prediction.confidence < 50 ? 'text-amber-500' : 'text-primary'}`}>
                            {c.prediction.confidence}%
                          </p>
                        </div>
                      )}
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Diagnosis */}
                      {c.prediction && (
                        <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">AI Diagnosis</p>
                          <h3 className="text-xl font-extrabold text-foreground uppercase">
                            {c.prediction.disease?.replace(/_/g, ' ')}
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${c.prediction.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-black text-primary">{c.prediction.confidence}%</span>
                          </div>
                          {c.prediction.modelUsed && (
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                              Model: {c.prediction.modelUsed}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Doctor notes */}
                      {c.doctorNotes && (
                        <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Doctor's Notes</p>
                          <p className="text-sm text-foreground leading-relaxed italic">"{c.doctorNotes}"</p>
                          {c.doctor && (
                            <p className="text-[10px] text-muted-foreground font-semibold">
                              — Dr. {c.doctor.firstName} {c.doctor.lastName}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Recommendations */}
                    {c.recommendations?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Recommendations Given</p>
                        <div className="space-y-1.5">
                          {c.recommendations.map((rec: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border/50">
                              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-sm text-foreground">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-1">
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(c)}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Download Report
                      </Button>
                      <Link to={`/app/review/${c._id}`}>
                        <Button variant="secondary" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" /> View / Edit Case
                        </Button>
                      </Link>
                    </div>
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
