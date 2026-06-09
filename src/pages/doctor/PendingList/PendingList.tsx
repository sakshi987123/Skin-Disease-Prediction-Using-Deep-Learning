import React, { useState, useEffect } from 'react';
import { Clock, User, ArrowRight, AlertCircle, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Skeleton';
import { apiService } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { Link } from 'react-router-dom';

export const PendingList: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPendingRequests();
      setRequests(data);
    } catch (err) {
      showError('Fetch failed', 'Could not load pending consultation requests.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Patient Consultations</h1>
          <p className="text-muted-foreground mt-1">Review and provide feedback on incoming skin analysis requests.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold text-sm tracking-wide">{requests.length} Pending Requests</span>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card className="border-dashed py-20">
          <CardBody className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
              <CheckCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">All Caught Up!</h3>
              <p className="text-muted-foreground">There are no pending consultation requests at this time.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Card key={req._id} className="group hover:border-primary/50 transition-all hover:shadow-xl overflow-hidden flex flex-col">
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                {req.imageUrl ? (
                  <img 
                    src={req.imageUrl} 
                    alt="Skin symptom" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground opacity-30" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded flex items-center gap-1 shadow-lg">
                    <Clock className="w-3 h-3" /> Pending Review
                  </span>
                  {req.isUrgent && (
                    <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded flex items-center gap-1 shadow-lg animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>
              </div>
              <CardBody className="p-5 flex-1 flex flex-col space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate">{req.user.firstName} {req.user.lastName}</h3>
                    <p className="text-xs text-muted-foreground truncate">{req.user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Reported Symptoms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {req.symptoms && req.symptoms.length > 0 ? (
                      req.symptoms.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground border border-border">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">No symptoms reported</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 mt-auto">
                    <Link to={`/app/review/${req._id}`}>
                        <Button className="w-full group/btn" size="sm">
                            Run AI Diagnosis <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
              </CardBody>
              <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] font-medium text-muted-foreground italic">
                <span>Requested on: {new Date(req.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 uppercase font-bold tracking-widest text-primary/70">
                    <FileText className="w-3 h-3" /> New Case
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
