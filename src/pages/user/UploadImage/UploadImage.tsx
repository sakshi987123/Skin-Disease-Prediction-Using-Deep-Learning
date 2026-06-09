import React, { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, AlertCircle, CheckCircle, Stethoscope,
  Info, Cpu, Download, FileText, ArrowRight, AlertTriangle, Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { apiService } from '../../../services/api';
import type { PredictResponse } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { ModelArchitectures } from '../../../components/ModelArchitectures';
import { getDiseaseInfo } from '../../../utils/diseaseInfo';
import { generateMedicalReport } from '../../../utils/reportGenerator';
import { useAuth } from '../../../contexts/AuthContext';

const MODEL_OPTIONS = [
  { value: 'densenet', label: 'DenseNet (Recommended)' },
  { value: 'inception', label: 'Inception v3' },
  { value: 'mobilenet', label: 'MobileNet' },
  { value: 'xception', label: 'Xception' },
];

const COMMON_SYMPTOMS = [
  'Itching', 'Redness', 'Swelling', 'Pain', 'Burning sensation',
  'Dryness', 'Scaling', 'Blisters', 'Bleeding', 'Crusting',
];

const URGENCY_STYLES: Record<string, string> = {
  None: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
  Low: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
  Moderate: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
  High: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
};

export const UploadImage: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [model, setModel] = useState<string>('densenet');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setResult(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (e.g. JPG, PNG).');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!selectedFile && selectedSymptoms.length === 0) {
      setError('Input Required');
      showError('No Input', 'Please select an image OR choose symptoms for analysis.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      if (selectedFile) {
        const data = await apiService.predictSkinImage(selectedFile, model);
        setResult(data);
        showSuccess('Vision Analysis Complete', `${data.disease} (${data.confidence}% confidence)`);
      } else {
        const data = await apiService.analyzeSymptoms(selectedSymptoms);
        setResult({ disease: data.disease, confidence: data.confidence, mock_mode: data.mock_mode });
        showSuccess('Symptom Analysis Complete', `${data.disease} (${data.confidence}% match)`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed.';
      setError(message);
      showError('Analysis failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedSymptoms([]);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadReport = () => {
    if (!result) return;
    generateMedicalReport({
      patientName: user ? `${user.firstName} ${user.lastName}` : undefined,
      disease: result.disease,
      confidence: result.confidence,
      model: selectedFile ? model : undefined,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
      analysisType: selectedFile ? 'image' : 'symptom',
    });
  };

  const diseaseInfo = result ? getDiseaseInfo(result.disease) : null;
  const isLowConfidence = result ? result.confidence < 50 : false;

  return (
    <div className="space-y-8 w-full p-4 md:p-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

        {/* Left Column: Input and Analysis */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-card-foreground">Skin Analysis</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a clear photo and/or select symptoms for a multi-modal AI prediction.
              </p>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Model selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-primary" /> Select AI Model
                </label>
                <Select options={MODEL_OPTIONS} value={model} onChange={e => setModel(e.target.value)} />
              </div>

              {/* Symptoms selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-secondary" /> Accompanying Symptoms
                  <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-secondary text-secondary-foreground border-secondary shadow-sm'
                          : 'bg-muted/50 text-muted-foreground border-border hover:border-secondary/50'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* File input */}
              <div className="p-6 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="skin-upload"
                />
                <label htmlFor="skin-upload" className="flex flex-col items-center justify-center cursor-pointer min-h-[200px]">
                  {previewUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center gap-4">
                      <div className="relative group/preview w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                        <img src={previewUrl} alt="Skin Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <p className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" /> Image Captured
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 max-w-[200px] truncate">
                          {selectedFile?.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 py-6">
                      <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground">Click to upload or drag & drop</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WEBP (max 5MB)</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={(!selectedFile && selectedSymptoms.length === 0) || loading}
                  isLoading={loading}
                  className="flex-1 shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  {loading ? 'Analyzing...' : (!selectedFile && selectedSymptoms.length > 0 ? 'Analyze Symptoms' : 'Run Diagnostics')}
                </Button>
                <Button variant="secondary" onClick={handleReset} disabled={loading}>
                  Reset
                </Button>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-destructive text-sm">Analysis Interrupted</p>
                    <p className="text-xs text-destructive/90">{error}</p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* ─── Result Area ─── */}
          {result && !error && diseaseInfo && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">

              {/* ── Low Confidence Warning ── */}
              {isLowConfidence && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-300 dark:bg-amber-900/20 dark:border-amber-700 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                      ⚠️ Low Confidence Prediction ({result.confidence}%)
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                      The AI model is below the 50% reliability threshold. This result may not be accurate.
                      <strong> Please consult a qualified doctor</strong> before drawing any conclusions.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Main Result Card ── */}
              <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
                <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {previewUrl && (
                      <div className="w-full md:w-28 h-28 rounded-xl overflow-hidden border-2 border-primary/20 shadow-inner flex-shrink-0">
                        <img src={previewUrl} alt="Analyzed Skin" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
                          AI Diagnosis Result
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Info className="w-3.5 h-3.5" /> {model.toUpperCase()}
                        </div>
                      </div>
                      <h2 className="text-2xl font-extrabold text-foreground tracking-tight uppercase">
                        {result.disease.replace(/_/g, ' ')}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">{diseaseInfo.fullName}</p>
                      <div className="flex items-end gap-4 mt-3">
                        <div className="flex-1">
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ease-out rounded-full ${isLowConfidence ? 'bg-amber-500' : 'bg-primary'}`}
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-2xl font-bold ${isLowConfidence ? 'text-amber-600' : 'text-primary'}`}>
                            {result.confidence}%
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">Confidence</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-2.5 rounded-lg bg-muted/50 border border-border text-center">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Category</p>
                          <p className="text-xs font-semibold text-foreground">{diseaseInfo.category}</p>
                        </div>
                        <div className={`p-2.5 rounded-lg border text-center ${URGENCY_STYLES[diseaseInfo.urgency]}`}>
                          <p className="text-[10px] uppercase font-bold mb-0.5">Urgency</p>
                          <p className="text-xs font-semibold">{diseaseInfo.urgency}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> About this Condition
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">{diseaseInfo.description}</p>
                  </div>

                  {/* Medical Suggestions */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Medical Suggestions
                    </h3>
                    <div className="space-y-2">
                      {diseaseInfo.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-foreground leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock mode notice */}
                  {result.mock_mode && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30">
                      <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                        <strong>Demo Notice:</strong> Simulation active. Connect the Python engine for live predictions.
                      </p>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      <strong>Medical Disclaimer:</strong> This AI model is an assistive screening tool and not a definitive diagnosis.
                      Always consult a qualified dermatologist for professional advice.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleDownloadReport}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </Button>
                    <Link to="/app/consult" className="flex-1">
                      <Button className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90">
                        <FileText className="w-4 h-4" />
                        Request Doctor Review
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Information & Architecture */}
        <div className="space-y-6">
          <ModelArchitectures />
        </div>
      </div>
    </div>
  );
};
