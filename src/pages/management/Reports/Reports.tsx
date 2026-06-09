import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  FileText, Download, Clock, CheckCircle, User,
  ArrowRight, Stethoscope, Info, Lightbulb,
} from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { apiService } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { useAuth } from '../../../contexts/AuthContext';
import { generateMedicalReport } from '../../../utils/reportGenerator';
import { getDiseaseInfo } from '../../../utils/diseaseInfo';

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'manager' || user?.role === 'doctor';

  // Doctors have their own completed-cases page — redirect them
  if (isDoctor) {
    return <Navigate to="/app/completed-cases" replace />;
  }

  return <PatientReports />;
};

const PatientReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    apiService.getMyDiagnoses()
      .then(data => {
        // Only show reports the doctor has explicitly finalised and marked visible
        const visible = data.filter(
          (r: any) => r.status === 'finalized' && r.isVisibleToPatient === true
        );
        setReports(visible);
      })
      .catch(() => showError('Load failed', 'Could not load your reports.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = (report: any) => {
    const info = report.prediction?.disease ? getDiseaseInfo(report.prediction.disease) : null;
    generateMedicalReport({
      patientName: user ? `${user.firstName} ${user.lastName}` : undefined,
      disease: report.prediction?.disease,
      confidence: report.prediction?.confidence,
      model: report.prediction?.modelUsed,
      symptoms: report.symptoms,
      advice: report.recommendations?.[0] || (info?.suggestions?.[0]),
      analysisType: report.imageUrl ? 'image' : 'symptom',
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
    <div className="w-full max-w-5xl mx-auto space-y-8 p-4 md:p-6 pb-24">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Doctor Reports</h1>
          <p className="text-muted-foreground mt-1">
            Finalized reports reviewed and shared by your doctor.
          </p>
        </div>
        <Link to="/app/my-history">
          <Button variant="outline" className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> View All Consultations
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          This page shows only reports your doctor has <strong>officially finalised and released</strong> to you.
          To track all your submitted consultations (including pending ones), visit{' '}
          <Link to="/app/my-history" className="font-semibold text-primary hover:underline">My Consultations</Link>.
        </p>
      </div>

      {reports.length === 0 ? (
        <Card className="border-dashed py-20 bg-muted/5">
          <CardBody className="text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-30">
              <FileText size={40} className="text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">No Reports Available Yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Reports will appear here once a doctor reviews and finalises your consultation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/app/consult">
                <Button className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" /> Request a Consultation
                </Button>
              </Link>
              <Link to="/app/my-history">
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Check Pending Status
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => {
            const diseaseInfo = report.prediction?.disease ? getDiseaseInfo(report.prediction.disease) : null;
            const conf = Number(report.prediction?.confidence) || 0;

            return (
              <Card key={report._id} className="overflow-hidden hover:shadow-lg transition-all group border-primary/10">
                <CardBody className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">

                    {/* Image / icon panel */}
                    <div className="w-full md:w-56 bg-muted relative flex-shrink-0 min-h-[140px]">
                      {report.imageUrl ? (
                        <img
                          src={report.imageUrl}
                          alt="Diagnosis"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Stethoscope className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded flex items-center gap-1 shadow">
                        <CheckCircle className="w-3 h-3" /> Doctor Verified
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-4">
                      <div className="space-y-4">

                        {/* Title row */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight truncate">
                              {report.prediction?.disease?.replace(/_/g, ' ') || 'Condition Analysis'}
                            </h3>
                            {diseaseInfo && (
                              <p className="text-xs text-muted-foreground mt-0.5">{diseaseInfo.fullName}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                              <span>·</span>
                              <span>ID: {report._id.slice(-6).toUpperCase()}</span>
                            </div>
                          </div>

                          {/* Confidence */}
                          <div className="text-right flex-shrink-0">
                            <div className={`text-2xl font-black ${conf < 50 ? 'text-amber-500' : 'text-primary'}`}>
                              {conf}%
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Confidence</div>
                            {report.prediction?.modelUsed && (
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {report.prediction.modelUsed.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Confidence bar */}
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${conf < 50 ? 'bg-amber-500' : 'bg-primary'}`}
                            style={{ width: `${conf}%` }}
                          />
                        </div>

                        {/* Doctor notes */}
                        {report.doctorNotes && (
                          <div className="p-3.5 bg-primary/5 border border-primary/15 rounded-xl">
                            <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <User className="w-3 h-3" /> Doctor's Clinical Notes
                            </p>
                            <p className="text-sm text-foreground/90 leading-relaxed italic">"{report.doctorNotes}"</p>
                            {report.doctor && (
                              <p className="text-[10px] text-muted-foreground mt-2 font-semibold">
                                — Dr. {report.doctor.firstName} {report.doctor.lastName}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Recommendations */}
                        {report.recommendations?.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                              <Lightbulb className="w-3 h-3 text-amber-500" /> Recommendations
                            </p>
                            <div className="space-y-1">
                              {report.recommendations.slice(0, 3).map((rec: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span className="leading-relaxed">{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                        {/* Symptoms chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {report.symptoms?.slice(0, 3).map((s: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-muted rounded text-[10px] uppercase font-bold text-muted-foreground border border-border">
                              {s}
                            </span>
                          ))}
                          {report.symptoms?.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{report.symptoms.length - 3}</span>
                          )}
                        </div>

                        {/* Download — only for finalized, visible reports */}
                        <Button
                          size="sm"
                          onClick={() => handleDownload(report)}
                          className="flex items-center gap-2 shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
