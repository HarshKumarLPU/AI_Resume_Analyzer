import { useState } from 'react';
import { analysisAPI } from '../api/services';
import { Briefcase, Edit3, MessageSquare, Target, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const AIToolsPanel = ({ resumeId, initialData }) => {
  const [activeTool, setActiveTool] = useState('jdMatch');
  
  // JD Match State
  const [jdText, setJdText] = useState(initialData?.jobDescriptionMatch?.jdText || '');
  const [jdMatchResult, setJdMatchResult] = useState(initialData?.jobDescriptionMatch || null);
  const [jdLoading, setJdLoading] = useState(false);

  // Rewrite State
  const [bulletPoint, setBulletPoint] = useState('');
  const [rewriteResult, setRewriteResult] = useState('');
  const [rewriteLoading, setRewriteLoading] = useState(false);

  // Interview State
  const [interviewResult, setInterviewResult] = useState(initialData?.mockInterview || null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Skill Gap State
  const [targetRole, setTargetRole] = useState(initialData?.skillGap?.targetRole || '');
  const [skillGapResult, setSkillGapResult] = useState(initialData?.skillGap || null);
  const [skillGapLoading, setSkillGapLoading] = useState(false);

  const renderQuestion = (q, i) => {
    const text = typeof q === 'string' ? q : q.question;
    const answer = typeof q === 'string' ? null : q.answer;
    return (
      <li key={i} className="text-slate-300 text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        <div className="font-medium text-white mb-2">Q: {text}</div>
        {answer && (
          <div className="text-slate-400 pl-4 border-l-2 border-emerald-500/50 mt-3 pt-1">
            <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Suggested Answer</span>
            {answer}
          </div>
        )}
      </li>
    );
  };

  const handleJDMatch = async () => {
    if (!jdText.trim()) return;
    setJdLoading(true);
    try {
      const res = await analysisAPI.matchJD(resumeId, jdText);
      setJdMatchResult(res.data.data.jobDescriptionMatch);
    } catch (err) {
      console.error(err);
    } finally {
      setJdLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!bulletPoint.trim()) return;
    setRewriteLoading(true);
    try {
      const res = await analysisAPI.rewritePoint(bulletPoint);
      setRewriteResult(res.data.data.rewrittenText);
    } catch (err) {
      console.error(err);
    } finally {
      setRewriteLoading(false);
    }
  };

  const handleGenerateInterview = async () => {
    setInterviewLoading(true);
    try {
      const res = await analysisAPI.generateInterview(resumeId);
      setInterviewResult(res.data.data.mockInterview);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to generate mock interview');
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleSkillGap = async () => {
    if (!targetRole.trim()) return;
    setSkillGapLoading(true);
    try {
      const res = await analysisAPI.analyzeSkillGap(resumeId, targetRole);
      setSkillGapResult(res.data.data.skillGap);
    } catch (err) {
      console.error(err);
    } finally {
      setSkillGapLoading(false);
    }
  };

  const tools = [
    { id: 'jdMatch', label: 'JD Match', icon: Briefcase },
    { id: 'rewrite', label: 'AI Rewrite', icon: Edit3 },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquare },
    { id: 'skillGap', label: 'Skill Gap', icon: Target },
  ];

  return (
    <div className="card p-0 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col gap-2">
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {tool.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-8 bg-slate-800/20">
        
        {/* JD MATCH TOOL */}
        {activeTool === 'jdMatch' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Job Description Match</h3>
              <p className="text-slate-400 text-sm">Paste a job description to see how well your resume matches.</p>
            </div>
            <textarea
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="Paste Job Description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            <button onClick={handleJDMatch} disabled={jdLoading || !jdText} className="btn-primary flex items-center gap-2">
              {jdLoading && <Loader2 size={16} className="animate-spin" />} Analyze Match
            </button>

            {jdMatchResult?.matchPercentage !== undefined && (
              <div className="mt-8 space-y-6 border-t border-slate-700 pt-8">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-display font-bold text-sky-400">{jdMatchResult.matchPercentage}%</div>
                  <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">Match Score</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card bg-slate-900/50">
                    <h4 className="font-bold text-white mb-3">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {jdMatchResult.missingSkills?.map((s, i) => <span key={i} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded">{s}</span>)}
                    </div>
                  </div>
                  <div className="card bg-slate-900/50">
                    <h4 className="font-bold text-white mb-3">Mismatch Reasons</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {jdMatchResult.mismatchReasons?.map((r, i) => <li key={i}>• {r}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI REWRITE TOOL */}
        {activeTool === 'rewrite' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2">AI Resume Rewrite</h3>
              <p className="text-slate-400 text-sm">Transform weak bullet points into impactful STAR statements.</p>
            </div>
            <textarea
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="E.g., Worked on website..."
              value={bulletPoint}
              onChange={(e) => setBulletPoint(e.target.value)}
            />
            <button onClick={handleRewrite} disabled={rewriteLoading || !bulletPoint} className="btn-primary flex items-center gap-2">
              {rewriteLoading && <Loader2 size={16} className="animate-spin" />} Rewrite Point
            </button>

            {rewriteResult && (
              <div className="mt-8 card border-emerald-500/30 bg-emerald-500/5">
                <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Improved Version
                </h4>
                <p className="text-white text-lg leading-relaxed">{rewriteResult}</p>
              </div>
            )}
          </div>
        )}

        {/* MOCK INTERVIEW TOOL */}
        {activeTool === 'interview' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Mock Interview Generator</h3>
              <p className="text-slate-400 text-sm">Generate tailored interview questions based on your resume.</p>
            </div>
            
            {(!interviewResult?.technicalQuestions?.length && !interviewResult?.hrQuestions?.length) ? (
              <button onClick={handleGenerateInterview} disabled={interviewLoading} className="btn-primary flex items-center gap-2">
                {interviewLoading && <Loader2 size={16} className="animate-spin" />} Generate Questions
              </button>
            ) : (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  Difficulty: {interviewResult.difficultyLevel}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-white border-b border-slate-700 pb-2">Technical Questions</h4>
                  <ul className="space-y-3">
                    {Array.isArray(interviewResult.technicalQuestions) 
                      ? interviewResult.technicalQuestions.map(renderQuestion)
                      : <li className="text-slate-500 italic">No technical questions available.</li>}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-white border-b border-slate-700 pb-2">Project Questions</h4>
                  <ul className="space-y-3">
                    {Array.isArray(interviewResult.projectQuestions)
                      ? interviewResult.projectQuestions.map(renderQuestion)
                      : <li className="text-slate-500 italic">No project questions available.</li>}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-white border-b border-slate-700 pb-2">HR & Behavioral Questions</h4>
                  <ul className="space-y-3">
                    {Array.isArray(interviewResult.hrQuestions)
                      ? interviewResult.hrQuestions.map(renderQuestion)
                      : <li className="text-slate-500 italic">No HR questions available.</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SKILL GAP TOOL */}
        {activeTool === 'skillGap' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Skill Gap Analyzer</h3>
              <p className="text-slate-400 text-sm">Identify missing skills for a target role and get a roadmap.</p>
            </div>
            
            <div className="flex gap-4">
              <input
                type="text"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-white focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="Target Role (e.g., Senior MERN Developer)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <button onClick={handleSkillGap} disabled={skillGapLoading || !targetRole} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                {skillGapLoading && <Loader2 size={16} className="animate-spin" />} Analyze Gap
              </button>
            </div>

            {skillGapResult?.targetRole && (
              <div className="mt-8 space-y-6 border-t border-slate-700 pt-8">
                <div className="card bg-rose-500/5 border-rose-500/20">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <XCircle size={18} className="text-rose-400" /> Missing Skills for {skillGapResult.targetRole}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGapResult.missingSkills?.map((s, i) => <span key={i} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded font-medium">{s}</span>)}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-white">4-Week Learning Roadmap</h4>
                  <div className="grid gap-4">
                    {skillGapResult.roadmap?.map((week, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="w-24 text-sky-400 font-bold font-display">{week.week}</div>
                        <div className="flex-1">
                          <div className="font-medium text-white mb-1">{week.focus}</div>
                          <div className="text-sm text-slate-400">{week.tasks?.join(' • ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AIToolsPanel;
