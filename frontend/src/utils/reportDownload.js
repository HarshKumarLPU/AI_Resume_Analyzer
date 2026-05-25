export const downloadReport = (analysis, resumeName) => {
  if (!analysis) return;

  const content = `
=========================================
      AI RESUME ANALYSIS REPORT
=========================================
Resume: ${resumeName}
Date: ${new Date().toLocaleDateString()}
ATS Score: ${analysis.atsScore}/100

=========================================
SECTION SCORES
=========================================
Contact Info: ${analysis.sectionScores?.contactInfo || 0}/100
Summary:      ${analysis.sectionScores?.summary || 0}/100
Experience:   ${analysis.sectionScores?.experience || 0}/100
Education:    ${analysis.sectionScores?.education || 0}/100
Skills:       ${analysis.sectionScores?.skills || 0}/100
Formatting:   ${analysis.sectionScores?.formatting || 0}/100

=========================================
OVERALL FEEDBACK
=========================================
${analysis.overallFeedback || 'N/A'}

=========================================
STRENGTHS
=========================================
${(analysis.strengths || []).map(s => `✓ ${s}`).join('\n')}

=========================================
WEAKNESSES
=========================================
${(analysis.weaknesses || []).map(w => `✗ ${w}`).join('\n')}

=========================================
SUGGESTIONS FOR IMPROVEMENT
=========================================
${(analysis.suggestions || []).map(s => `→ ${s}`).join('\n')}

=========================================
DETECTED SKILLS
=========================================
${(analysis.detectedSkills || []).join(', ')}

=========================================
MISSING KEYWORDS
=========================================
${(analysis.missingKeywords || []).join(', ')}

=========================================
FORMATTING FEEDBACK
=========================================
${(analysis.formattingFeedback || []).map(f => `• ${f}`).join('\n')}

=========================================
RECOMMENDED ROLES
=========================================
${(analysis.recommendedRoles || []).map(r => `★ ${r}`).join('\n')}
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Analysis_${resumeName}_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
