import React from 'react';
import { Card, CardBody } from './ui/Card';
import { CheckCircle, AlertCircle, Info, BarChart as BarChartIcon, Cpu, Trophy, Stethoscope } from 'lucide-react';

interface ModelResult {
  disease: string;
  confidence: number;
}

interface ModelComparisonViewProps {
  results: Record<string, ModelResult>;
}

export const ModelComparisonView: React.FC<ModelComparisonViewProps> = ({ results }) => {
  const modelEntries = Object.entries(results);
  
  // Find winner (highest confidence)
  const winner = modelEntries.reduce((prev, current) => 
    (current[1].confidence > prev[1].confidence) ? current : prev
  );

  // Check for consensus
  const diseases = modelEntries.map(e => e[1].disease);
  const allAgree = diseases.every(d => d === diseases[0]);
  const mostCommonDisease = diseases.sort((a,b) =>
      diseases.filter(v => v===a).length - diseases.filter(v => v===b).length
  ).pop();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChartIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Multi-Model Comparison</h2>
        </div>
        {allAgree ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-black uppercase tracking-widest">
            <CheckCircle className="w-3.5 h-3.5" /> High Consensus
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-black uppercase tracking-widest">
            <AlertCircle className="w-3.5 h-3.5" /> Mixed Results
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confidence Comparison Bars */}
        <Card className="lg:col-span-2 border-primary/10 shadow-md">
          <CardBody className="p-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
               Confidence Distribution
            </h3>
            <div className="space-y-6">
              {modelEntries.map(([name, res], index) => {
                const isWinner = name === winner[0];
                const isNLP = name === 'Symptom NLP';
                return (
                  <div key={name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black uppercase tracking-tighter ${
                          isWinner ? 'text-primary' : isNLP ? 'text-secondary' : 'text-foreground'
                        }`}>
                          {name}
                        </span>
                        {isWinner && <Trophy className="w-3.5 h-3.5 text-primary" />}
                        {isNLP && <Stethoscope className="w-3.5 h-3.5 text-secondary" />}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">
                        {res.disease} • <span className={
                          isWinner ? 'text-primary' : isNLP ? 'text-secondary font-bold' : 'text-foreground'
                        }>{res.confidence}%</span>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${
                          isWinner 
                            ? 'bg-gradient-to-r from-primary to-primary/60 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]' 
                            : isNLP 
                            ? 'bg-gradient-to-r from-secondary to-secondary/60'
                            : 'bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20'
                        }`}
                        style={{ 
                          width: `${res.confidence}%`,
                          transitionDelay: `${index * 150}ms`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Insight Panel */}
        <div className="space-y-4">
          <Card className={`border-2 transition-all ${allAgree ? 'border-primary/20 bg-primary/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
            <CardBody className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${allAgree ? 'bg-primary/20' : 'bg-amber-500/20'}`}>
                  <Cpu className={`w-5 h-5 ${allAgree ? 'text-primary' : 'text-amber-500'}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Verdict</p>
                  <h4 className="font-bold text-foreground">{mostCommonDisease}</h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {allAgree 
                  ? "All AI architectures have reached high consensus on this condition. This increases the reliability of the preliminary screening."
                  : "Architectures show varying results. This is common with atypical presentations and suggests further clinical review is needed."}
              </p>
              <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${allAgree ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600'}`}>
                <Info className="w-4 h-4" /> Recommended Architecture: {winner[0].toUpperCase()}
              </div>
            </CardBody>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardBody className="p-4 space-y-3">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Diagnostic Summary</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Highest Conf.</span>
                  <span className="font-bold text-foreground">{winner[1].confidence}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Consensus Level</span>
                  <span className="font-bold text-foreground">{allAgree ? '100%' : 'Mixed'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Primary Algorithm</span>
                  <span className="font-bold text-foreground uppercase">{winner[0]}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
