import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis';
import { AnalysisSkeleton } from '../components/ui/Skeleton';
import AIToolsPanel from '../components/AIToolsPanel';
import { downloadReport } from '../utils/reportDownload';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle2, XCircle, ArrowRightCircle, Download, RefreshCw, AlertCircle
} from 'lucide-react';

const AnalysisPage = () => {
  const { id } = useParams();
  const { analysis, loading, fetchAnalysis, reAnalyze } = useAnalysis(id);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const handleReanalyze = async () => {
    setReanalyzing(true);
    await reAnalyze();
    setReanalyzing(false);
  };

  if (loading && !analysis) {
    return <AnalysisSkeleton />;
  }

  if (!analysis) {
    return (
      <div className="card text-center p-12 max-w-lg mx-auto">
        <AlertCircle className="text-slate-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Not Found</h2>
        <p className="text-slate-400">The requested analysis could not be found or has not been completed yet.</p>
      </div>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <div className="card text-center p-12 max-w-lg mx-auto border-rose-500/30 bg-rose-500/5 mt-12">
        <AlertCircle className="text-rose-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
        <p className="text-slate-400 mb-6">{analysis.errorMessage || 'An error occurred during analysis.'}</p>
        <button 
          onClick={handleReanalyze} 
          disabled={reanalyzing}
          className="btn-secondary flex items-center justify-center gap-2 mx-auto w-full max-w-[200px]"
        >
          <RefreshCw size={16} className={reanalyzing ? "animate-spin" : ""} />
          {reanalyzing ? 'Retrying...' : 'Try Again'}
        </button>
      </div>
    );
  }

  const { resume } = analysis;
  const sections = analysis.sectionScores || {};
  
  const radarData = [
    { subject: 'Contact', A: sections.contactInfo || 0 },
    { subject: 'Summary', A: sections.summary || 0 },
    { subject: 'Experience', A: sections.experience || 0 },
    { subject: 'Education', A: sections.education || 0 },
    { subject: 'Skills', A: sections.skills || 0 },
    { subject: 'Format', A: sections.formatting || 0 },
  ];

  // Circle animation variables
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - ((analysis.atsScore || 0) / 100) * circumference;

  const getScoreColorHex = (score) => {
    if (score >= 70) return '#38bdf8'; // sky-400
    if (score >= 50) return '#fbbf24'; // amber-400
    return '#f87171'; // red-400
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Analysis Report</h1>
          <p className="text-slate-400 flex items-center gap-2">
            For <span className="text-sky-400 font-medium">{resume?.originalName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReanalyze} 
            disabled={reanalyzing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} className={reanalyzing ? "animate-spin" : ""} />
            {reanalyzing ? 'Analyzing...' : 'Re-analyze'}
          </button>
          <button 
            onClick={() => downloadReport(analysis, resume?.originalName)}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={16} /> Download Report
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-800 mb-8">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Analysis Overview
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'tools' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Pro AI Tools
        </button>
      </div>

      {activeTab === 'overview' ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overall Score & Radar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-800 px-2 py-1 rounded">
                ATS Match
              </span>
            </div>
            
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle 
                  cx="100" cy="100" r="90" fill="none" 
                  stroke={getScoreColorHex(analysis.atsScore)} 
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-display font-bold text-white">{analysis.atsScore}</span>
                <span className="text-sm text-slate-400 mt-1">/ 100</span>
              </div>
            </div>
            
            <p className="text-slate-300 font-medium leading-relaxed">
              {analysis.overallFeedback}
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-display font-bold text-white mb-4 px-2">Section Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Feedback */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={20} /> Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.strengths?.map((item, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card">
              <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <XCircle className="text-rose-400" size={20} /> Weaknesses
              </h3>
              <ul className="space-y-3">
                {analysis.weaknesses?.map((item, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card border-sky-500/30 bg-sky-500/5">
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <ArrowRightCircle className="text-sky-400" size={20} /> Recommendations for Improvement
            </h3>
            <ul className="space-y-4">
              {analysis.suggestions?.map((item, i) => (
                <li key={i} className="text-slate-200 text-sm flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <div className="bg-sky-500/20 text-sky-400 w-6 h-6 rounded flex items-center justify-center shrink-0 font-bold text-xs">
                    {i + 1}
                  </div>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-400">Detected Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.detectedSkills?.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-sky-400 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-400">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords?.map((keyword, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-sm font-medium">
                    {keyword}
                  </span>
                ))}
                {(!analysis.missingKeywords || analysis.missingKeywords.length === 0) && (
                  <span className="text-sm text-slate-500 italic">No missing keywords detected.</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-400">Formatting & Grammar</h3>
              <ul className="space-y-2">
                {analysis.formattingFeedback?.map((item, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-slate-500">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card">
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider text-slate-400">Recommended Job Roles</h3>
              <div className="space-y-2">
                {analysis.recommendedRoles?.map((role, i) => (
                  <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium">
                    {role}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      ) : (
        <AIToolsPanel resumeId={analysis.resume._id} initialData={analysis} />
      )}
    </div>
  );
};

export default AnalysisPage;
