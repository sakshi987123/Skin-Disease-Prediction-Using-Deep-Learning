import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Image, FileText, Heart, CheckCircle, ArrowRight, Shield, Sparkles, Clock } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Image,
      title: 'AI-Powered Image Analysis',
      description: 'Advanced deep learning models analyze skin images with high accuracy for early disease detection',
    },
    {
      icon: Stethoscope,
      title: 'Multi-Modal Diagnosis',
      description: 'Combines visual features with symptom details for comprehensive skin condition analysis',
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Generate comprehensive diagnostic reports with confidence scores and treatment recommendations',
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'Receive customized home remedies, precautions, and treatment guidance based on your condition',
    },
  ];

  const benefits = [
    'Early detection of common skin diseases using AI',
    'Symptom-based and image-based analysis',
    'Personalized treatment recommendations',
    'Comprehensive diagnostic reports',
    'Secure and private medical data handling',
    'Accessible healthcare solution for everyone',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 w-full max-w-full">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">DermaCure AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/select-role"
                className="text-muted-foreground hover:text-primary font-medium transition-colors hidden sm:block"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-all shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Skin Disease Detection
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Early Detection for
            <br />
            <span className="text-primary">Better Skin Health</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant AI-powered analysis of skin conditions with personalized recommendations. 
            Early detection helps prevent complications and supports timely treatment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/select-role"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold text-lg transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-card text-card-foreground rounded-lg hover:bg-accent font-semibold text-lg transition-all border-2 border-border w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How DermaCure AI Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced AI technology meets personalized healthcare for early skin disease detection
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div>
                <h2 className="text-3xl font-bold text-card-foreground mb-4">
                  Why Choose DermaCure AI?
                </h2>
                <p className="text-muted-foreground mb-6">
                  An intelligent, accessible, and cost-effective healthcare solution that empowers you with 
                  early skin disease detection. Get instant insights and personalized care recommendations 
                  from the comfort of your home.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Instant Results</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Secure & Private</span>
                  </div>
                </div>
                <Link
                  to="/select-role"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
                >
                  Start your health journey
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-card-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Take Control of Your Skin Health
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Early detection saves lives. Get instant AI-powered analysis and personalized care recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/select-role"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background text-primary rounded-lg hover:bg-background/90 font-semibold text-lg transition-all shadow-lg w-full sm:w-auto justify-center"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background/10 text-primary-foreground rounded-lg hover:bg-background/20 font-semibold text-lg transition-all border-2 border-background/30 w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-6">
            ⚠️ Medical Disclaimer: AI predictions are preliminary. Always consult a certified dermatologist for final diagnosis.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">DermaCure AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered early skin disease detection for better healthcare decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>AI Image Analysis</li>
                <li>Symptom-Based Diagnosis</li>
                <li>Personalized Recommendations</li>
                <li>Detailed Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Important</h4>
              <p className="text-sm text-muted-foreground mb-2">
                This tool is for early screening only. Always consult a certified dermatologist for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2025 DermaCure AI. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">
              Empowering early detection through AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};