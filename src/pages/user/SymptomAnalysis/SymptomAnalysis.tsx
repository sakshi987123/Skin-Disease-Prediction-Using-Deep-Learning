import React, { useState } from 'react';
import {
  Stethoscope, AlertCircle, CheckCircle, ArrowRight, Activity, Thermometer,
  Info, AlertTriangle, Download, FileText, Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { apiService } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { getDiseaseInfo } from '../../../utils/diseaseInfo';
import { generateMedicalReport } from '../../../utils/reportGenerator';
import { useAuth } from '../../../contexts/AuthContext';

const SYMPTOMS_LIST = [
  { id: 'itch', label: 'Severe Itching', icon: Activity },
  { id: 'red', label: 'Redness/Inflammation', icon: Thermometer },
  { id: 'pain', label: 'Pain or Tenderness', icon: AlertCircle },
  { id: 'burn', label: 'Burning Sensation', icon: Thermometer },
  { id: 'dry', label: 'Dry or Cracked Skin', icon: Activity },
  { id: 'scale', label: 'Scaling or Peeling', icon: Activity },
  { id: 'blist', label: 'Blisters or Pimples', icon: Activity },
  { id: 'bleed', label: 'Bleeding or Oozing', icon: AlertCircle },
  { id: 'fever', label: 'Accompanying Fever', icon: Thermometer },
];

const URGENCY_COLORS: Record<string, string> = {
  None: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
  Low: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
  Moderate: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
  High: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
};

export const SymptomAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { showSuccess, showError } = useToast();

  const toggleSymptom = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAnalyze = async () => {
    if (selected.length === 0) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const symptomLabels = selected.map(id => SYMPTOMS_LIST.find(s => s.id === id)?.label || id);
      const data = await apiService.analyzeSymptoms(symptomLabels);
      setResult({ ...data, symptomLabels });
      showSuccess('Analysis complete', `Detected: ${data.diagnosis}`);
    } catch (err) {
      console.error(err);
      showError('Analysis failed', err instanceof Error ? err.message : 'Could not analyze symptoms.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    generateMedicalReport({
      patientName: user ? `${user.firstName} ${user.lastName}` : undefined,
      disease: result.diagnosis || result.disease,
      confidence: result.confidence,
      severity: result.severity,
      advice: result.advice,
      symptoms: result.symptomLabels,
      analysisType: 'symptom',
    });
  };

  const diseaseInfo = result ? getDiseaseInfo(result.diagnosis || result.disease) : null;
  const isLowConfidence = result ? result.confidence < 50 : false;

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-2">
          <Stethoscope className="w-3.5 h-3.5" /> NLP Diagnostic Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight drop-shadow-sm">
          Symptom-Based <span className="text-primary">Intelligence</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          No image? No problem. Describe your clinical signs and our NLP AI will provide a laboratory-grade preliminary assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Symptom Selection ── */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-primary/10 shadow-2xl overflow-hidden backdrop-blur-sm bg-card/80">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
            <CardHeader className="pt-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Clinical Manifestations</h2>
                  <p className="text-sm text-muted-foreground">Select all symptoms that describe your condition.</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-8 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SYMPTOMS_LIST.map(item => {
                  const Icon = item.icon;
                  const isActive = selected.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleSymptom(item.id)}
                      className={`flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all group relative overflow-hidden ${
                        isActive
                          ? 'bg-primary/5 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                          : 'bg-muted/30 border-transparent hover:border-primary/20 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-4 h-4 text-primary animate-in zoom-in" />
                        </div>
                      )}
                      <div className={`p-3 w-fit rounded-xl transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-background group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={selected.length === 0 || analyzing}
                  isLoading={analyzing}
                  size="lg"
                  className="flex-1 h-16 text-lg font-bold shadow-xl shadow-primary/20"
                >
                  Predict Condition
                </Button>
                <Button variant="outline" onClick={() => { setSelected([]); setResult(null); }} className="h-16 px-8 hover:bg-destructive/5 hover:text-destructive hover:border-destructive transition-all">
                  Clear All
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* ── Comparison Results (if available) ── */}
          {result?.comparison && result.comparison.length > 0 && (
            <Card className="border-border shadow-lg overflow-hidden">
              <CardHeader>
                <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" /> Multi-Model Comparison
                </h3>
                <p className="text-xs text-muted-foreground">Results from three diagnostic engines</p>
              </CardHeader>
              <CardBody className="space-y-3">
                {result.comparison.map((comp: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="font-bold text-sm text-foreground">{comp.model}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{comp.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{comp.diagnosis?.replace(/_/g, ' ')}</p>
                      <p className={`text-sm font-bold ${comp.confidence < 50 ? 'text-amber-500' : 'text-primary'}`}>
                        {comp.confidence}%
                      </p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
        </div>

        {/* ── Results Sidebar ── */}
        <div className="lg:col-span-4 space-y-6">
          {result && diseaseInfo ? (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">

              {/* Low Confidence Warning */}
              {isLowConfidence && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-300 dark:bg-amber-900/20 dark:border-amber-700">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                      ⚠️ Low Confidence ({result.confidence}%)
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                      This prediction is below the 50% reliability threshold. <strong>Please consult a doctor</strong> for a proper diagnosis.
                    </p>
                  </div>
                </div>
              )}

              {/* Main Result Card */}
              <Card className="border-secondary/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <CardBody className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest rounded-full">
                      NLP Result
                    </span>
                    {result.severity === 'High' && (
                      <span className="flex items-center gap-1 text-red-500 font-black text-[10px] tracking-widest uppercase animate-pulse">
                        <AlertCircle className="w-3 h-3" /> Urgent
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                      {(result.diagnosis || result.disease).replace(/_/g, ' ')}
                    </h3>
                    <p className="text-xs text-muted-foreground">{diseaseInfo.fullName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-muted-foreground font-semibold">Reliability Index</p>
                      <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 rounded-full ${isLowConfidence ? 'bg-amber-500' : 'bg-secondary'}`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className={`text-xs font-black ${isLowConfidence ? 'text-amber-600' : 'text-secondary'}`}>
                        {result.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Urgency badge */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-sm ${URGENCY_COLORS[diseaseInfo.urgency]}`}>
                    <span className="text-xs font-black uppercase tracking-widest">Urgency Level</span>
                    <span className="font-bold">{diseaseInfo.urgency}</span>
                  </div>

                  {/* Severity */}
                  <div className={`p-3 rounded-xl flex items-center justify-between ${
                    result.severity === 'High' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    <span className="text-xs font-black uppercase tracking-widest">Severity</span>
                    <span className="text-sm font-bold uppercase">{result.severity || 'Moderate'}</span>
                  </div>

                  {/* AI Advice */}
                  {result.advice && (
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 relative">
                      <Info className="absolute top-3 right-3 w-4 h-4 text-muted-foreground/30" />
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">AI Medical Advice</p>
                      <p className="text-sm leading-relaxed text-foreground italic">"{result.advice}"</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="space-y-2 pt-1">
                    <Button
                      onClick={handleDownloadReport}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 h-11"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF Report
                    </Button>
                    <Link to="/app/consult">
                      <Button className="w-full flex items-center justify-center gap-2 h-11 bg-secondary hover:bg-secondary/90">
                        <FileText className="w-4 h-4" />
                        Request Doctor Review
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>

              {/* Medical Suggestions */}
              <Card className="border-border shadow-md">
                <CardBody className="p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Medical Suggestions
                  </h4>
                  <div className="space-y-2">
                    {diseaseInfo.suggestions.slice(0, 4).map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[400px]">
              <Card className="h-full bg-muted/10 border-dashed border-2 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center rotate-3 border border-border">
                  <Info className="w-10 h-10 text-muted-foreground/40 -rotate-3" />
                </div>
                <div className="max-w-[200px]">
                  <h3 className="font-black text-foreground uppercase tracking-widest text-xs mb-2">Awaiting Clinical Data</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Select your symptoms on the left to activate the NLP diagnostic processor.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Medical Protocol Info */}
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4 shadow-sm relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
              <Info className="w-4 h-4" /> Medical Protocol
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This intelligence engine uses pattern matching based on clinical datasets. It is an assistive tool for early screening. If you experience severe pain, spreading infection, or fever, please contact <strong>Emergency Services</strong> immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
