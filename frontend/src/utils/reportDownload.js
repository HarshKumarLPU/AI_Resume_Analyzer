import html2pdf from 'html2pdf.js';

export const downloadReport = (analysis, resumeName) => {
  if (!analysis) return;
  const safeResumeName = resumeName || 'Resume';

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 30px; line-height: 1.6;">
      <div style="border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="color: #0284c7; margin: 0 0 10px 0; font-size: 28px;">AI Resume Analysis Report</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px;"><strong>Resume:</strong> ${safeResumeName}</p>
        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;"><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
        <h2 style="margin-top: 0; color: #0284c7; font-size: 24px;">ATS Match Score: ${analysis.atsScore}/100</h2>
        <p style="margin-bottom: 0; font-size: 15px; color: #334155;">${analysis.overallFeedback || 'No feedback available.'}</p>
      </div>

      <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; font-size: 18px;">Section Scores</h3>
      <table style="width: 100%; text-align: left; border-collapse: collapse; margin-top: 10px;">
        <tbody>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; width: 35%;"><strong>Contact Info:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0ea5e9; font-weight: bold; width: 15%;">${analysis.sectionScores?.contactInfo || 0}/100</td>
            <td style="padding: 8px 0 8px 20px; border-bottom: 1px solid #f1f5f9; width: 35%;"><strong>Education:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0ea5e9; font-weight: bold; width: 15%;">${analysis.sectionScores?.education || 0}/100</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Summary:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0ea5e9; font-weight: bold;">${analysis.sectionScores?.summary || 0}/100</td>
            <td style="padding: 8px 0 8px 20px; border-bottom: 1px solid #f1f5f9;"><strong>Skills:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0ea5e9; font-weight: bold;">${analysis.sectionScores?.skills || 0}/100</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Experience:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0ea5e9; font-weight: bold;">${analysis.sectionScores?.experience || 0}/100</td>
            <td style="padding: 8px 0 8px 20px; border-bottom: 1px solid #f1f5f9;"><strong>Formatting:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0ea5e9; font-weight: bold;">${analysis.sectionScores?.formatting || 0}/100</td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; gap: 20px; margin-top: 30px;">
        <div style="flex: 1;">
          <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 18px;">Strengths</h3>
          <ul style="padding-left: 20px; color: #334155; font-size: 14px;">
            ${(analysis.strengths || []).map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
          </ul>
        </div>
        <div style="flex: 1;">
          <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 18px;">Weaknesses</h3>
          <ul style="padding-left: 20px; color: #334155; font-size: 14px;">
            ${(analysis.weaknesses || []).map(w => `<li style="margin-bottom: 8px;">${w}</li>`).join('')}
          </ul>
        </div>
      </div>

      <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 20px; font-size: 18px;">Suggestions for Improvement</h3>
      <ul style="padding-left: 20px; color: #334155; font-size: 14px;">
        ${(analysis.suggestions || []).map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
      </ul>

      <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 20px; font-size: 18px;">Detected Skills</h3>
      <p style="color: #334155; font-size: 14px; background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
        ${(analysis.detectedSkills || []).join(', ')}
      </p>

      <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 20px; font-size: 18px;">Missing Keywords</h3>
      <p style="color: #334155; font-size: 14px; background-color: #fff7ed; padding: 15px; border-radius: 6px; border: 1px solid #ffedd5;">
        ${(analysis.missingKeywords || []).length > 0 ? (analysis.missingKeywords || []).join(', ') : 'None detected!'}
      </p>

      <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 20px; font-size: 18px;">Recommended Roles</h3>
      <ul style="padding-left: 20px; color: #334155; font-size: 14px;">
        ${(analysis.recommendedRoles || []).map(r => `<li style="margin-bottom: 8px; font-weight: bold; color: #0284c7;">${r}</li>`).join('')}
      </ul>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = html;

  const opt = {
    margin:       10,
    filename:     `Analysis_${safeResumeName.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};
