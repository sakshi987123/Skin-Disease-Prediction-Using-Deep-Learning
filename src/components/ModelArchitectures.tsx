import React from 'react';
import { Cpu, Zap, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { Card, CardBody } from './ui/Card';

interface ModelInfo {
  id: string;
  name: string;
  architecture: string;
  description: string;
  accuracy: string;
  speed: string;
  bestFor: string;
}

const MODELS: ModelInfo[] = [
  {
    id: 'densenet',
    name: 'DenseNet',
    architecture: 'Densely Connected Convolutional Network',
    description: 'Each layer receives feature maps from all preceding layers, maximizing feature reuse and gradient flow for highly accurate skin lesion classification.',
    accuracy: 'Highest',
    speed: 'Moderate',
    bestFor: 'Professional-grade diagnostic assistance.',
  },
  {
    id: 'inception',
    name: 'Inception v3',
    architecture: 'Inception Module (299×299 input)',
    description: 'Uses parallel convolutions at multiple scales to capture both fine-grained textures and broad structural patterns in dermatological images.',
    accuracy: 'Very High',
    speed: 'Moderate',
    bestFor: 'High-resolution professional dermatology images.',
  },
  {
    id: 'mobilenet',
    name: 'MobileNet',
    architecture: 'Depthwise Separable Convolutions',
    description: 'Optimized for speed and efficiency. Lightweight architecture that delivers strong accuracy with minimal compute overhead.',
    accuracy: 'Moderate-High',
    speed: 'Fastest',
    bestFor: 'Quick scans and mobile-quality images.',
  },
  {
    id: 'xception',
    name: 'Xception',
    architecture: 'Extreme Inception (299×299 input)',
    description: 'Extends Inception with depthwise separable convolutions throughout. Excels at capturing subtle skin texture variations and rare conditions.',
    accuracy: 'Very High',
    speed: 'Dynamic',
    bestFor: 'Complex and rare skin condition detection.',
  },
];

export const ModelArchitectures: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">AI Design Architectures</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODELS.map((model) => (
          <Card key={model.id} className="hover:border-primary/40 transition-all group">
            <CardBody className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Validated
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-card-foreground mb-1">{model.name}</h3>
              <p className="text-xs font-medium text-primary mb-3">{model.architecture}</p>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {model.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Accuracy</p>
                  <p className="text-sm font-semibold text-foreground">{model.accuracy}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Speed</p>
                  <p className="text-sm font-semibold text-foreground">{model.speed}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-xs font-medium text-primary group-hover:translate-x-1 transition-transform cursor-pointer">
                View Network Topology <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/5 border border-primary/20">
        <div className="flex gap-3">
          <Zap className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">Architecture Recommendation</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For most users, <strong>DenseNet</strong> provides the best balance of accuracy and reliability.
              If you need a faster result, <strong>MobileNet</strong> is significantly quicker while maintaining high precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
