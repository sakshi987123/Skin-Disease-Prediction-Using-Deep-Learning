import React from 'react';
import { Link } from 'react-router-dom';
import {
  User, Image, FileText, Heart, Stethoscope, TrendingUp, AlertCircle,
  CheckCircle, Clock, Sparkles, ArrowRight, Info,
  ClipboardList, BarChart3, History, Send, Upload, Activity,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/api';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'manager' || user?.role === 'doctor';
  const isPatient = user?.role === 'user' || user?.role === 'patient';

  // Patient: all their diagnoses
  const [myDiagnoses, setMyDiagnoses] = React.useState<any[]>([]);
  // Doctor: pending + completed counts
  const [pendingCases, setPendingCases] = React.useState<any[]>([]);
  const [completedCases, setCompletedCases] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        if (isPatient) {
          const data = await apiService.getMyDiagnoses();
          setMyDiagnoses(data);
        } else {
          const [pending, completed] = await Promise.all([
            apiService.getPendingRequests(),
            apiService.getCompletedCases(),
          ]);
          setPendingCases(pending);
          setCompletedCases(completed);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isPatient]);

  // Derived patient stats
  const pendingOwn = myDiagnoses.filter(d => d.status === 'pending' || d.status === 'reviewed').length;
  const finalizedOwn = myDiagnoses.filter(d => d.status === 'finalized').length;

  /* ─── PATIENT CONTENT ─── */
  const patientQuickActions = [
    { icon: Send, title: 'Consult a Doctor', description: 'Submit your image & symptoms to a real dermatologist for review', path: '/app/consult', color: 'bg-primary', textColor: 'text-primary', borderColor: 'border-primary', hoverColor: 'hover:bg-primary/10' },
    { icon: History, title: 'My Consultations', description: 'Track all your submitted cases and view finalized doctor reports', path: '/app/my-history', color: 'bg-secondary', textColor: 'text-secondary', borderColor: 'border-secondary', hoverColor: 'hover:bg-secondary/10' },
    { icon: FileText, title: 'Doctor Reports', description: 'View and download reports officially released by your doctor', path: '/app/reports', color: 'bg-accent', textColor: 'text-accent', borderColor: 'border-accent', hoverColor: 'hover:bg-accent/10' },
  ];

  const patientHealthTips = [
    { title: 'Always Consult a Doctor', description: 'AI results are preliminary — always get professional confirmation for any skin concern.', icon: Stethoscope },
    { title: 'Submit Clear Images', description: 'When consulting a doctor, attach a well-lit close-up photo for better assessment.', icon: Send },
    { title: 'Report All Symptoms', description: 'Adding symptoms alongside images improves diagnosis accuracy by up to 30%.', icon: Activity },
    { title: 'Track Your Progress', description: 'Monitor changes in your skin health using the consultation history.', icon: TrendingUp },
  ];

  /* ─── DOCTOR CONTENT ─── */
  const doctorQuickActions = [
    { icon: ClipboardList, title: 'Pending Consultations', description: `${loading ? '...' : pendingCases.length} cases awaiting your review`, path: '/app/pending-list', color: 'bg-primary', textColor: 'text-primary', borderColor: 'border-primary', hoverColor: 'hover:bg-primary/10' },
    { icon: CheckCircle, title: 'Completed Cases', description: 'View all finalized patient consultations', path: '/app/completed-cases', color: 'bg-secondary', textColor: 'text-secondary', borderColor: 'border-secondary', hoverColor: 'hover:bg-secondary/10' },
    { icon: BarChart3, title: 'Healthcare Analytics', description: 'Review diagnostic trends and performance data', path: '/app/analytics', color: 'bg-accent', textColor: 'text-accent', borderColor: 'border-accent', hoverColor: 'hover:bg-accent/10' },
  ];

  const doctorHealthTips = [
    { title: 'Review Pending Cases Promptly', description: 'Timely review improves patient outcomes. Check the pending queue regularly.', icon: Clock },
    { title: 'Verify AI Predictions', description: 'Always validate AI confidence scores with clinical judgement before finalising.', icon: CheckCircle },
    { title: 'Add Detailed Notes', description: 'Clear doctor notes and recommendations help patients understand their condition.', icon: FileText },
    { title: 'Mark Visibility Carefully', description: "Only mark a report visible to the patient when it's ready for them to read.", icon: Info },
  ];

  const recentActivity = isPatient ? myDiagnoses.slice(0, 3) : pendingCases.slice(0, 3);

  return (
    <div className="space-y-6 w-full p-4 md:p-6">

      {/* Welcome Banner */}
      <div className={`rounded-2xl p-6 md:p-8 text-primary-foreground shadow-lg ${isDoctor ? 'bg-gradient-to-r from-secondary via-secondary/90 to-primary' : 'bg-gradient-to-r from-primary via-primary/90 to-primary/80'}`}>
        <div className="flex items-start gap-4 mb-4 flex-wrap">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-primary-foreground/90 text-base md:text-lg mb-1">
              {isDoctor ? 'Doctor Dashboard' : 'Patient Dashboard'}
            </p>
            <p className="text-primary-foreground/80 text-sm md:text-base max-w-2xl">
              {isDoctor
                ? 'Review incoming patient consultations, run AI-assisted diagnoses, and provide expert recommendations.'
                : 'Get instant AI-powered skin condition screening and connect with real dermatologists for professional review.'}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-foreground/90 leading-relaxed">
              <strong>Medical Disclaimer:</strong>{' '}
              {isDoctor
                ? 'AI predictions are decision-support tools only. All clinical decisions remain the sole responsibility of the reviewing clinician.'
                : 'AI predictions are preliminary and for informational purposes only. Always consult a certified dermatologist for accurate diagnosis and treatment.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isPatient ? (
          <>
            <Card className="hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">My Consultations</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{loading ? '...' : myDiagnoses.length}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Total submitted</p>
              </CardBody>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Awaiting Review</p>
                    <p className="text-xl md:text-2xl font-bold text-amber-600">{loading ? '...' : pendingOwn}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Doctor pending</p>
              </CardBody>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Reports Ready</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600">{loading ? '...' : finalizedOwn}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Doctor finalised</p>
              </CardBody>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Health Status</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">Good</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Overall wellness</p>
              </CardBody>
            </Card>
          </>
        ) : (
          <>
            <Card className="hover:shadow-md transition-shadow border-amber-200 dark:border-amber-800">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Pending Cases</p>
                    <p className="text-xl md:text-2xl font-bold text-amber-600">{loading ? '...' : pendingCases.length}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Awaiting your review</p>
              </CardBody>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-green-200 dark:border-green-800">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Completed Cases</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600">{loading ? '...' : completedCases.length}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Finalized reports</p>
              </CardBody>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Cases</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{loading ? '...' : pendingCases.length + completedCases.length}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">All consultations</p>
              </CardBody>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardBody className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Shared Reports</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {loading ? '...' : completedCases.filter((c: any) => c.isVisibleToPatient).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Visible to patients</p>
              </CardBody>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Quick Actions</h2>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {(isDoctor ? doctorQuickActions : patientQuickActions).map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className={`group p-5 md:p-6 border-2 ${action.borderColor} rounded-xl ${action.hoverColor} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg mb-2 ${action.textColor} group-hover:underline`}>
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <span>{isDoctor ? 'Open' : 'Get Started'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feature Grid — role specific */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {isDoctor ? 'Doctor Tools' : 'AI Diagnostic Tools'}
          </h2>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-tighter">Deep Learning</span>
            <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase tracking-tighter">NLP Pipeline</span>
          </div>
        </div>

        {isDoctor ? (
          // Doctor feature grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Link to="/app/pending-list" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-primary/20">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <ClipboardList className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">Pending Queue</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Review patient-submitted consultations. Run AI diagnosis, add notes, and finalise reports.
                      </p>
                      {!loading && pendingCases.length > 0 && (
                        <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {pendingCases.length} Awaiting Review
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Link to="/app/completed-cases" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-green-200 dark:border-green-800">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">Completed Cases</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Browse all finalized consultations. Search by patient or diagnosis and download reports.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Case History
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Link to="/app/upload-image" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-secondary/20">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">AI Diagnostic Tools</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Run independent DenseNet, Inception, MobileNet, or Xception analysis on any image.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                        Visual AI
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Link to="/app/symptoms" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-accent/20">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Stethoscope className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">Symptom NLP Engine</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Run text-based NLP analysis on patient-reported symptoms for clinical cross-reference.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">
                        Textual AI
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Link to="/app/analytics" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-primary/20">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">Healthcare Analytics</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Review diagnostic trends, model performance metrics, and patient statistics.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">
                        Analytics
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Link to="/app/reports" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-border">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">Diagnostic Reports</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Access and manage all patient diagnostic reports across the platform.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-widest">
                        Reports
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </div>
        ) : (
          // Patient feature grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Link to="/app/consult" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-accent/20">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <Send className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">Consult a Doctor</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Submit your image and symptoms directly to a real dermatologist for professional review.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">Doctor Review</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Link to="/app/my-history" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-primary/20">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <History className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">My Consultations</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Track all your submitted consultations and view finalized doctor reports with download.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-black uppercase tracking-widest">History</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardBody className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground mb-2 text-lg">Personalized Care</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Customized home remedies, precautions, and treatment guidance for your condition.
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Available</div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Link to="/app/reports" className="hover:shadow-lg transition-all cursor-pointer group">
              <Card className="h-full border-border">
                <CardBody className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground mb-2 text-lg">Doctor Reports</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        View and download reports officially finalised and released by your doctor.
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Doctor Verified</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </div>
        )}
      </div>

      {/* Tips & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tips */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">
                {isDoctor ? 'Clinical Reminders' : 'Health Tips'}
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {(isDoctor ? doctorHealthTips : patientHealthTips).map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">
                  {isDoctor ? 'Pending Queue' : 'Recent Activity'}
                </h2>
              </div>
              {recentActivity.length > 0 && (
                <Link
                  to={isDoctor ? '/app/pending-list' : '/app/my-history'}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 animate-pulse text-muted-foreground text-sm font-medium">Loading...</div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((item: any) => (
                  <Link
                    key={item._id}
                    to={isDoctor ? `/app/review/${item._id}` : '/app/my-history'}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-all group"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isDoctor
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : item.status === 'finalized' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {isDoctor
                          ? `${item.user?.firstName} ${item.user?.lastName}`
                          : (item.prediction?.disease || 'Awaiting Doctor Review')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto opacity-40">
                    {isDoctor ? <ClipboardList className="w-6 h-6 text-muted-foreground" /> : <FileText className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {isDoctor ? 'No pending cases' : 'No consultations yet'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? 'The pending queue is empty.' : 'Submit your first consultation to get started.'}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* CTA Banner — role-specific */}
      {isPatient && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
          <CardBody className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to start your health journey?</h3>
                <p className="text-muted-foreground">
                  Upload a skin image or describe your symptoms for an instant AI-powered screening.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <Link to="/app/consult">
                  <Button size="lg" className="flex items-center gap-2">
                    <Send className="w-5 h-5" /> Consult a Doctor
                  </Button>
                </Link>
                <Link to="/app/my-history">
                  <Button size="lg" variant="outline" className="flex items-center gap-2">
                    <History className="w-5 h-5" /> My Consultations
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {isDoctor && pendingCases.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 via-amber-50/50 to-transparent border-amber-200 dark:from-amber-900/20 dark:border-amber-800">
          <CardBody className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {pendingCases.length} patient{pendingCases.length > 1 ? 's' : ''} waiting for your review
                </h3>
                <p className="text-muted-foreground">
                  Review pending consultations, run AI diagnostics, and provide expert recommendations.
                </p>
              </div>
              <Link to="/app/pending-list">
                <Button size="lg" className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white border-0">
                  <ClipboardList className="w-5 h-5" /> Review Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
