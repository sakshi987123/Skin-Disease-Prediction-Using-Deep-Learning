import { getDiseaseInfo } from './diseaseInfo';

export interface ReportData {
  patientName?: string;
  date?: string;
  disease?: string;
  confidence?: number;
  model?: string;
  severity?: string;
  advice?: string;
  symptoms?: string[];
  analysisType?: 'image' | 'symptom' | 'combined';
}

export function generateMedicalReport(data: ReportData): void {
  const disease = data.disease || 'Unknown_Normal';
  const info = getDiseaseInfo(disease);
  const date = data.date ?? new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });
  const reportId = 'RPT-' + Date.now().toString(36).toUpperCase();
  const conf = Math.min(Number(data.confidence) || 0, 100);
  const isLowConf = conf < 50;

  const symptomsHtml =
    data.symptoms && data.symptoms.length > 0
      ? data.symptoms.map(s => `<span class="chip">${s}</span>`).join('')
      : '<span class="chip muted">None reported</span>';

  const suggestionsHtml = info.suggestions
    .map(
      (s, i) => `
      <div class="suggestion-row">
        <span class="num">${i + 1}</span>
        <span class="sug-text">${s}</span>
      </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>DermaCure AI – Medical Report ${reportId}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 44px 48px; }

  .hdr { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #6c63ff; padding-bottom: 18px; margin-bottom: 28px; }
  .logo { font-size: 28px; font-weight: 900; color: #6c63ff; letter-spacing: -1px; }
  .logo span { color: #ff6584; }
  .logo-sub { font-size: 11px; color: #888; margin-top: 3px; }
  .meta { text-align: right; font-size: 11px; color: #666; line-height: 1.9; }
  .meta strong { color: #1a1a2e; }

  .patient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: #f8f7ff; border-radius: 12px; padding: 18px 20px; margin-bottom: 22px; }
  .pf { display: flex; flex-direction: column; gap: 2px; }
  .pf-label { font-size: 9px; font-weight: 700; color: #6c63ff; text-transform: uppercase; letter-spacing: .08em; }
  .pf-value { font-size: 13px; font-weight: 600; color: #1a1a2e; }

  .result-box { background: linear-gradient(135deg, #6c63ff18, #ff658418); border: 1.5px solid #6c63ff35; border-radius: 16px; padding: 22px 26px; margin-bottom: 22px; }
  .result-label { font-size: 9px; font-weight: 800; color: #6c63ff; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 10px; }
  .disease-name { font-size: 30px; font-weight: 900; color: #1a1a2e; text-transform: uppercase; letter-spacing: -1px; }
  .disease-full { font-size: 12px; color: #666; margin: 3px 0 18px; }
  .bar-wrap { background: #e5e7eb; border-radius: 99px; height: 9px; overflow: hidden; margin-bottom: 6px; }
  .bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #6c63ff, #ff6584); }
  .bar-labels { font-size: 11px; color: #666; display: flex; justify-content: space-between; }
  .badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  .badge { padding: 5px 13px; border-radius: 99px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .b-primary { background: #6c63ff20; color: #6c63ff; }
  .b-warn { background: #f59e0b20; color: #d97706; }
  .b-ok { background: #10b98120; color: #059669; }
  .b-danger { background: #ef444420; color: #dc2626; }

  .warn-box { background: #fff7ed; border: 1.5px solid #fbbf24; border-radius: 12px; padding: 14px 18px; display: flex; gap: 12px; align-items: flex-start; margin-bottom: 22px; }
  .warn-icon { font-size: 22px; flex-shrink: 0; }
  .warn-text { font-size: 12px; color: #92400e; line-height: 1.65; }

  .section { margin-bottom: 22px; }
  .section-title { font-size: 11px; font-weight: 800; color: #1a1a2e; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px; padding-bottom: 7px; border-bottom: 2px solid #6c63ff25; display: flex; align-items: center; gap: 7px; }
  .section-title::before { content: ''; width: 4px; height: 16px; background: #6c63ff; border-radius: 2px; flex-shrink: 0; }
  .desc-box { font-size: 13px; color: #374151; line-height: 1.7; padding: 14px 16px; background: #f8f7ff; border-radius: 8px; border-left: 4px solid #6c63ff; }

  .chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .chip { padding: 4px 12px; border-radius: 99px; background: #6c63ff15; color: #6c63ff; font-size: 11px; font-weight: 600; border: 1px solid #6c63ff30; }
  .chip.muted { background: #f3f4f6; color: #9ca3af; border-color: #e5e7eb; }

  .suggestion-row { display: flex; gap: 11px; align-items: flex-start; padding: 9px 13px; background: #f8f7ff; border-radius: 8px; margin-bottom: 7px; }
  .num { width: 21px; height: 21px; background: #6c63ff; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
  .sug-text { font-size: 12.5px; color: #374151; line-height: 1.6; }

  .disclaimer { background: #f8f7ff; border-radius: 12px; padding: 18px; font-size: 11px; color: #555; line-height: 1.8; border-top: 3px solid #6c63ff25; margin-bottom: 22px; }
  .disclaimer strong { color: #1a1a2e; }

  .footer { display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #aaa; border-top: 1px solid #e5e7eb; padding-top: 14px; }
  .footer strong { color: #6c63ff; }

  .action-bar { text-align: center; margin-top: 28px; display: flex; gap: 12px; justify-content: center; }
  .btn-print { background: #6c63ff; color: #fff; border: none; padding: 12px 36px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
  .btn-close { background: #f3f4f6; color: #374151; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }

  @media print {
    body { padding: 20px 24px; }
    .action-bar { display: none !important; }
    @page { margin: 1cm; }
  }
</style>
</head>
<body>

<div class="hdr">
  <div>
    <div class="logo">Derma<span>Cure</span> AI</div>
    <div class="logo-sub">AI-Powered Dermatology Preliminary Screening</div>
  </div>
  <div class="meta">
    <div><strong>Report ID:</strong> ${reportId}</div>
    <div><strong>Date:</strong> ${date}</div>
    <div><strong>Type:</strong> AI Preliminary Screening</div>
    <div><strong>Status:</strong> Unverified — Requires Doctor Review</div>
  </div>
</div>

<div class="patient-grid">
  ${data.patientName ? `<div class="pf"><span class="pf-label">Patient Name</span><span class="pf-value">${data.patientName}</span></div>` : ''}
  <div class="pf"><span class="pf-label">Analysis Date</span><span class="pf-value">${date}</span></div>
  ${data.model ? `<div class="pf"><span class="pf-label">AI Model</span><span class="pf-value">${data.model.toUpperCase()}</span></div>` : ''}
  <div class="pf"><span class="pf-label">Analysis Type</span><span class="pf-value">${data.analysisType === 'image' ? 'Image-Based (Deep Learning)' : data.analysisType === 'symptom' ? 'Symptom-Based (NLP)' : 'Multi-Modal'}</span></div>
  <div class="pf"><span class="pf-label">Disease Category</span><span class="pf-value">${info.category}</span></div>
  <div class="pf"><span class="pf-label">Urgency Level</span><span class="pf-value">${info.urgency}</span></div>
</div>

<div class="result-box">
  <div class="result-label">Primary AI Diagnosis</div>
  <div class="disease-name">${disease.replace(/_/g, ' ')}</div>
  <div class="disease-full">${info.fullName} &mdash; ${info.category}</div>
  <div class="bar-wrap"><div class="bar-fill" style="width:${conf}%"></div></div>
  <div class="bar-labels"><span>Confidence Score</span><span><strong>${conf.toFixed(1)}%</strong></span></div>
  <div class="badges">
    ${data.model ? `<span class="badge b-primary">Model: ${data.model.toUpperCase()}</span>` : ''}
    ${data.severity ? `<span class="badge b-warn">Severity: ${data.severity}</span>` : ''}
    <span class="badge ${isLowConf ? 'b-danger' : 'b-ok'}">${isLowConf ? 'Low Confidence — Consult Doctor' : 'Prediction Reliable'}</span>
    <span class="badge b-primary">Urgency: ${info.urgency}</span>
  </div>
</div>

${isLowConf ? `
<div class="warn-box">
  <div class="warn-icon">&#9888;&#65039;</div>
  <div class="warn-text">
    <strong>Low Confidence Warning:</strong> The AI model returned a confidence score of <strong>${conf.toFixed(1)}%</strong>, below the 50% reliability threshold.
    This prediction may not be accurate. Do <strong>not</strong> make any medical decisions based on this result alone.
    Please consult a qualified dermatologist for a proper clinical diagnosis.
  </div>
</div>` : ''}

<div class="section">
  <div class="section-title">Clinical Description</div>
  <div class="desc-box">${info.description}</div>
</div>

${data.symptoms && data.symptoms.length > 0 ? `
<div class="section">
  <div class="section-title">Reported Symptoms</div>
  <div class="chips">${symptomsHtml}</div>
</div>` : ''}

${data.advice ? `
<div class="section">
  <div class="section-title">AI-Generated Medical Advice</div>
  <div class="desc-box">${data.advice}</div>
</div>` : ''}

<div class="section">
  <div class="section-title">Recommended Actions</div>
  ${suggestionsHtml}
</div>

<div class="disclaimer">
  <strong>&#10036; Medical Disclaimer</strong><br />
  This report is generated automatically by the <strong>DermaCure AI</strong> system and is intended solely as a preliminary screening tool to support — not replace — professional medical judgement.
  It does <strong>not</strong> constitute a definitive medical diagnosis, treatment plan, or professional medical advice.
  This report must be reviewed and validated by a qualified dermatologist or licensed medical practitioner before any clinical decisions are made.
  If you are experiencing severe or life-threatening symptoms, contact emergency services immediately.
</div>

<div class="footer">
  <div>Generated by <strong>DermaCure AI</strong> v1.0 &mdash; AI-Powered Dermatology Screening Platform</div>
  <div>Report ID: ${reportId} | For informational purposes only</div>
</div>

<div class="action-bar">
  <button class="btn-print" onclick="window.print()">&#128438; Print / Save as PDF</button>
  <button class="btn-close" onclick="window.close()">Close</button>
</div>

<script>
  // Auto-open print dialog after page fully renders
  window.addEventListener('load', function () {
    setTimeout(function () {
      window.print();
    }, 400);
    window.addEventListener('afterprint', function () {
      window.close();
    });
  });
</script>

</body>
</html>`;

  // Build a Blob URL — not blocked by popup blockers unlike window.open('')
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  const newWin = window.open(blobUrl, '_blank', 'width=940,height=820,scrollbars=yes,resizable=yes');

  if (newWin) {
    newWin.focus();
    // Revoke blob URL after enough time for the page to load
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } else {
    // Fallback when popup is blocked: download as .html file the user can open and print
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `DermaCure-Report-${reportId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  }
}
