import React, { useEffect, useState, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle, Stethoscope, Clock } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { apiService } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';

const COMMON_SYMPTOMS = [
  'Itching', 'Redness', 'Swelling', 'Pain', 'Burning sensation', 
  'Dryness', 'Scaling', 'Blisters', 'Bleeding', 'Crusting'
];

interface ConsultationFollowup {
  disease?: string;
  symptoms?: string[];
}

interface AiInsight {
  imageResult: { disease: string; confidence: number } | null;
  textResult: { disease: string; confidence: number } | null;
}

export const RequestConsultation: React.FC = () => {
  const location = useLocation();
  const followup = (location.state as { followup?: ConsultationFollowup } | null)?.followup;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(followup?.symptoms || []);
  const [description, setDescription] = useState(
    followup?.disease ? `Follow-up for: ${followup.disease.replace(/_/g, ' ')}` : ''
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const runAIAnalysis = async () => {
    if (!selectedFile && selectedSymptoms.length === 0) {
      showError('Input Required', 'Please provide an image or select symptoms for AI analysis.');
      return;
    }
    
    setAnalyzing(true);
    setError(null);
    try {
      let imageResult = null;
      let textResult = null;
      
      if (selectedFile) {
        imageResult = await apiService.predictSkinImage(selectedFile, 'densenet');
      }
      
      if (selectedSymptoms.length > 0) {
        textResult = await apiService.analyzeSymptoms(selectedSymptoms);
      }
      
      setAiInsight({ imageResult, textResult });
      showSuccess('AI Insight Generated', 'Preliminary analysis completed.');
    } catch (err) {
      console.error(err);
      showError('AI Analysis Failed', 'Could not generate preliminary insight.');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Convert image to base64 for real persistence in this demo
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      
      // REAL: Sending actual patient data
      await apiService.requestDiagnosis({
        imageUrl: base64Image,
        symptoms: selectedSymptoms,
        description: description,
        aiInsight: aiInsight // Include AI insight in the request
      });

      setSubmitted(true);
      showSuccess(
        'Request Sent',
        'Your skin image has been sent to the doctor for review.'
      );
      
      setTimeout(() => {
        navigate('/app/user-dashboard');
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed.';
      setError(message);
      showError('Submission failed', message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-green-500/20 shadow-2xl animate-in zoom-in-95">
          <CardBody className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Request Submitted!</h2>
              <p className="text-muted-foreground">
                Your consultation request is now in the doctor's queue. You will receive a notification once the diagnosis is ready.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-primary font-bold">
                <Clock className="w-4 h-4" /> Redirecting to Dashboard...
              </div>
              <Button onClick={() => navigate('/app/user-dashboard')}>Back to Dashboard</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 md:p-6 pb-20">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Consult with Doctor</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload a clear image and describe your symptoms. A qualified doctor will review your case and provide an AI-assisted diagnosis.
        </p>
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">New Consultation Request</h2>
            </div>
            <div className="hidden md:flex gap-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">ResNet-50</span>
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase">NLP Engine</span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-8">
          {/* Symptoms selection */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-secondary" /> What symptoms are you experiencing?
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
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

          {/* Image Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-foreground flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-primary" /> Upload Affected Area Image
            </label>
            <div className="p-10 border-2 border-dashed border-border rounded-2xl bg-muted/20 hover:bg-muted/30 transition-all group relative overflow-hidden">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="skin-upload"
              />
              <label 
                htmlFor="skin-upload" 
                className="flex flex-col items-center justify-center cursor-pointer space-y-4"
              >
                {previewUrl ? (
                  <div className="w-full max-w-[280px] aspect-video rounded-xl overflow-hidden border border-primary/30 shadow-lg">
                    <img src={previewUrl} alt="Affected area preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="p-5 rounded-full transition-all duration-300 bg-primary/10">
                    <ImageIcon className="w-10 h-10 text-primary" />
                  </div>
                )}
                <div className="text-center space-y-1">
                  <p className="font-bold text-foreground">
                    {selectedFile ? selectedFile.name : 'Click to upload photo'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ensure image is well-lit and in focus
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          {/* AI Preliminary Insight Section */}
          <div className="p-1 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20">
            <div className="bg-card rounded-[15px] p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground leading-none mb-1">AI Preliminary Insight</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Multi-Model Analysis</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={runAIAnalysis}
                  disabled={analyzing || (!selectedFile && selectedSymptoms.length === 0)}
                  isLoading={analyzing}
                  className="rounded-full px-6"
                >
                  {aiInsight ? 'Refresh Analysis' : 'Get AI Insight'}
                </Button>
              </div>

              {aiInsight ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold uppercase text-primary">Visual Prediction</span>
                    </div>
                    {aiInsight.imageResult ? (
                      <div className="space-y-1">
                        <p className="text-lg font-black text-foreground">{aiInsight.imageResult.disease}</p>
                        <p className="text-xs text-muted-foreground">Confidence: <span className={`font-bold ${aiInsight.imageResult.confidence < 50 ? 'text-amber-500' : 'text-primary'}`}>{Number(aiInsight.imageResult.confidence).toFixed(1)}%</span></p>
                        {aiInsight.imageResult.confidence < 50 && (
                          <p className="text-[10px] text-amber-600 font-medium">⚠️ Low confidence — consult a doctor</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No image provided</p>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-secondary" />
                      <span className="text-xs font-bold uppercase text-secondary">Symptom Analysis</span>
                    </div>
                    {aiInsight.textResult ? (
                      <div className="space-y-1">
                        <p className="text-lg font-black text-foreground">{aiInsight.textResult.disease}</p>
                        <p className="text-xs text-muted-foreground">Match Score: <span className={`font-bold ${aiInsight.textResult.confidence < 50 ? 'text-amber-500' : 'text-secondary'}`}>{Number(aiInsight.textResult.confidence).toFixed(1)}%</span></p>
                        {aiInsight.textResult.confidence < 50 && (
                          <p className="text-[10px] text-amber-600 font-medium">⚠️ Low confidence — consult a doctor</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No symptoms selected</p>
                    )}
                  </div>
                  <div className="md:col-span-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                        These results are preliminary and generated by the <strong>ResNet-50</strong> and <strong>Symptom NLP</strong> models. This data will be shared with the doctor to assist their final diagnosis.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-border rounded-xl">
                  <p className="text-sm text-muted-foreground italic">
                    Generate an AI insight to see preliminary findings before submitting.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description Area */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-foreground flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Additional Context (Optional)
            </label>
            <textarea
              className="w-full h-32 bg-muted/20 border border-border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe how long you've had this, any pain level, or recent changes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              isLoading={loading}
              className="flex-1 h-14 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Send to Doctor
            </Button>
            <Button variant="secondary" className="h-14 px-8" onClick={() => navigate('/app/user-dashboard')}>Cancel</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
