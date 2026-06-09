import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Stethoscope, Cpu, Info, MessageSquare, CheckCircle,
  ArrowLeft, Eye, EyeOff, Save, Activity, Calendar, AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { apiService } from '../../../services/api';
import type { PredictResponse } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';

const MODEL_OPTIONS = [
  { value: 'densenet', label: 'DenseNet (Recommended)' },
  { value: 'inception', label: 'Inception v3' },
  { value: 'mobilenet', label: 'MobileNet' },
  { value: 'xception', label: 'Xception' },
];

export const ReviewCase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Editable fields
  const [selectedModel, setSelectedModel] = useState('densenet');
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [comparison, setComparison] = useState<Record<string, PredictResponse> | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (id) fetchDiagnosis();
  }, [id]);

  const fetchDiagnosis = async () => {
    setLoading(true);
    try {
      const data = await apiService.getDiagnosisById(id!);
      setDiagnosis(data);
      if (data.prediction) setPrediction(data.prediction);
      if (data.doctorNotes) setDoctorNotes(data.doctorNotes);
      if (data.recommendations) setRecommendations(data.recommendations.join('\n'));
      setIsVisible(data.isVisibleToPatient);
      setIsUrgent(data.isUrgent || false);
    } catch (err) {
      showError('Fetch failed', 'Could not load the consultation case.');
      navigate('/app/pending-list');
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    setPredicting(true);
    try {
      // In this demo, we use a placeholder image URL for prediction or the real one if it was a real File
      // For now, let's simulate a real fetch to the python backend if we have a way
      // Since it's a URL in the database, the python backend would need to support URLs
      // For now, let's just trigger a simulation or a mock call if it's on a URL
      
      // Use the patient's uploaded image URL for prediction
      const result = await apiService.predictSkinImage(diagnosis.imageUrl, selectedModel);
      setPrediction(result);
      showSuccess('AI Prediction Complete', `${result.disease} detected.`);
    } catch (err) {
      showError('Prediction Error', 'The AI engine could not process the image.');
    } finally {
      setPredicting(false);
    }
  };

  const handleCompare = async () => {
    setIsComparing(true);
    setComparison(null);
    try {
      const data = await apiService.compareModels(diagnosis.imageUrl);
      setComparison(data.results);
      showSuccess('Comparison Complete', `Analyzed using ${Object.keys(data.results).length} models.`);
    } catch (err) {
      showError('Comparison Error', 'Multi-model analysis failed.');
    } finally {
      setIsComparing(false);
    }
  };

  const handleFinalize = async () => {
    if (!prediction) {
      showError('Missing Data', 'Please run the AI diagnosis before finalizing.');
      return;
    }
    setSaving(true);
    try {
      await apiService.finalizeDiagnosis(id!, {
        prediction: {
          disease: prediction.disease,
          confidence: prediction.confidence,
          modelUsed: selectedModel
        },
        doctorNotes,
        status: 'finalized',
        isVisibleToPatient: isVisible,
        isUrgent,
        recommendations: recommendations.split('\n').filter(r => r.trim() !== '')
      });
      showSuccess('Case Finalized', 'The patient can now view their report.' );
      navigate('/app/pending-list');
    } catch (err) {
      showError('Finalize Failed', 'Could not save the diagnostic report.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/app/pending-list')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pending
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Patient Info & Image */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-primary/20 bg-card/50">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                            {diagnosis.user.firstName[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{diagnosis.user.firstName} {diagnosis.user.lastName}</h2>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Submitted on {new Date(diagnosis.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Still Pending Review
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 space-y-4">
                        <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" /> Reported Symptoms
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {diagnosis.symptoms.map((s: string, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 bg-muted rounded-xl text-sm font-medium border border-border">
                                    {s}
                                </span>
                            ))}
                        </div>
                        <div className="pt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 italic text-sm text-blue-800 leading-relaxed min-h-[80px]">
                            {diagnosis.description ? (
                                `"${diagnosis.description}"`
                            ) : (
                                <span className="text-blue-400">No additional context provided by patient.</span>
                            )}
                        </div>
                    </div>
                    <div className="bg-black relative group aspect-square md:aspect-auto">
                        <img 
                            src={diagnosis.imageUrl} 
                            alt="Skin condition" 
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-xs font-medium">Digital Dermatoscopy Capture</p>
                        </div>
                    </div>
                </div>
            </CardBody>
          </Card>

          {/* AI Workbench */}
          <Card className="border-secondary/20 bg-secondary/[0.02]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-secondary" />
                    <h2 className="text-xl font-bold">AI Diagnostics Engine</h2>
                </div>
                <div className="max-w-[200px] w-full">
                    <Select
                        options={MODEL_OPTIONS}
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-card"
                    />
                </div>
            </CardHeader>
            <CardBody className="p-8">
                {prediction ? (
                    <div className="flex flex-col md:flex-row items-center gap-8 animate-in slide-in-from-top-2">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center overflow-hidden">
                                <div 
                                    className="absolute bottom-0 w-full bg-primary transition-all duration-1000"
                                    style={{ height: `${prediction.confidence}%` }}
                                />
                                <span className="relative z-10 text-2xl font-black text-foreground">{prediction.confidence}%</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                           <p className="text-xs font-bold text-primary uppercase tracking-widest">Matched Condition</p>
                           <h3 className="text-4xl font-extrabold text-foreground tracking-tight">{prediction.disease}</h3>
                           <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5">
                                <CheckCircle className="w-4 h-4 text-green-500" /> AI confidence score validated via {selectedModel.toUpperCase()}
                           </p>
                        </div>
                        <Button variant="secondary" onClick={() => setPrediction(null)}>Re-Scan</Button>
                    </div>
                ) : (
                    <div className="text-center py-12 space-y-6">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Activity className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">Processor Ready</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto">Analyze the patient's skin image using balanced models or compare multiple expert systems.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button 
                                size="lg" 
                                className="px-8 shadow-md hover:shadow-xl transition-all" 
                                onClick={handlePredict}
                                isLoading={predicting}
                                disabled={isComparing}
                            >
                                Run Single-Model AI
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline"
                                className="px-8 border-secondary text-secondary hover:bg-secondary/10" 
                                onClick={handleCompare}
                                isLoading={isComparing}
                                disabled={predicting}
                            >
                                Compare All Models
                            </Button>
                        </div>
                    </div>
                )}

                {comparison && (
                    <div className="mt-8 pt-8 border-t border-border animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-2 mb-6 text-secondary">
                            <Activity className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Multi-Model Cross-Validation</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(comparison).map(([mName, res]) => (
                                <div key={mName} className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">{mName} Architecture</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${res.confidence > 80 ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                            {res.confidence}% Conf.
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground truncate">{res.disease}</p>
                                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${res.confidence > 80 ? 'bg-green-500' : 'bg-amber-500'}`}
                                                style={{ width: `${res.confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="w-full text-[10px] h-7"
                                        onClick={() => {
                                            setSelectedModel(mName);
                                            setPrediction(res);
                                        }}
                                    >
                                        Use This Result
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardBody>
          </Card>
        </div>

        {/* Right: Review & Finalize */}
        <div className="space-y-6">
            <Card className="shadow-lg border-primary/30 h-full flex flex-col">
                <CardHeader className="bg-muted/50 border-b border-border">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold">Scientific View</h2>
                    </div>
                </CardHeader>
                <CardBody className="p-6 flex-1 flex flex-col space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">Scientific Commentary</label>
                        <textarea
                            className="w-full h-32 bg-muted/30 border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                            placeholder="Add your clinical observations and medical advice here..."
                            value={doctorNotes}
                            onChange={(e) => setDoctorNotes(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">Treatment Recommendations</label>
                        <textarea
                            className="w-full h-32 bg-muted/30 border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                            placeholder="One recommendation per line (e.g. Apply cream 2x daily)..."
                            value={recommendations}
                            onChange={(e) => setRecommendations(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border mt-auto">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                            <div className="flex items-center gap-3">
                                {isVisible ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
                                <div>
                                    <p className="text-sm font-bold leading-none">Visible to Patient</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Control report access</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsVisible(!isVisible)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isVisible ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVisible ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Urgent flag */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border ${isUrgent ? 'bg-red-50 border-red-300 dark:bg-red-900/10 dark:border-red-800' : 'bg-muted/50 border-border'}`}>
                            <div className="flex items-center gap-3">
                                <AlertTriangle className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-muted-foreground'}`} />
                                <div>
                                    <p className={`text-sm font-bold leading-none ${isUrgent ? 'text-red-700 dark:text-red-400' : ''}`}>Mark as Urgent</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Flags case for priority attention</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsUrgent(!isUrgent)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isUrgent ? 'bg-red-500' : 'bg-muted-foreground/30'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isUrgent ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Info size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Publication Note</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Once finalized, this case will be moved to the history archives. If visibility is ON, the patient will be able to see this record in their dashboard.
                            </p>
                        </div>

                        <Button 
                            className="w-full h-14 text-lg font-bold shadow-lg" 
                            onClick={handleFinalize}
                            isLoading={saving}
                            disabled={!prediction}
                        >
                            <Save className="w-5 h-5 mr-3" /> Finalize Case
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>

      </div>
    </div>
  );
};
