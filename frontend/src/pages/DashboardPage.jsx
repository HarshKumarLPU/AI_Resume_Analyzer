import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../api/services';
import { StatSkeleton } from '../components/ui/Skeleton';
import { 
  FileText, 
  Activity, 
  TrendingUp, 
  Award,
  ArrowRight,
  UploadCloud,
  LineChart as LineChartIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await analysisAPI.getAll();
        if (res.data.success) {
          setAnalyses(res.data.data.analyses);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-sky-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreColorBg = (score) => {
    if (score >= 70) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const completedAnalyses = analyses.filter(a => a.status === 'completed');
  const avgScore = completedAnalyses.length 
    ? Math.round(completedAnalyses.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / completedAnalyses.length) 
    : 0;
  const bestScore = completedAnalyses.length 
    ? Math.max(...completedAnalyses.map(a => a.atsScore || 0)) 
    : 0;

  const versionData = useMemo(() => {
    if (!completedAnalyses.length) return [];
    
    const groups = {};
    completedAnalyses.forEach(a => {
      const gId = a.resume?.groupId || a.resume?._id;
      if (!groups[gId]) groups[gId] = [];
      groups[gId].push(a);
    });

    let maxGroup = [];
    Object.values(groups).forEach(g => {
      if (g.length > maxGroup.length) maxGroup = g;
    });

    maxGroup.sort((a, b) => (a.resume?.versionNumber || 1) - (b.resume?.versionNumber || 1));

    return maxGroup.map((a, i) => ({
      name: `V${a.resume?.versionNumber || i + 1}`,
      score: a.atsScore || 0,
      date: new Date(a.createdAt).toLocaleDateString()
    }));
  }, [completedAnalyses]);

  const StatCard = ({ title, value, subtitle, icon: Icon, valueClass = 'text-white' }) => (
    <div className="card h-[140px] flex flex-col justify-between group relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-800/50 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors"></div>
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2.5 bg-slate-800 rounded-xl">
          <Icon className="text-sky-400" size={20} />
        </div>
        <h3 className="font-medium text-slate-400">{title}</h3>
      </div>
      <div className="relative z-10">
        <div className={`text-4xl font-display font-bold ${valueClass}`}>{value}</div>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your resume analysis performance.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Resumes" 
            value={new Set(analyses.map(a => a.resume?._id)).size} 
            subtitle="Uploaded to platform"
            icon={FileText} 
          />
          <StatCard 
            title="Analyses Run" 
            value={analyses.length} 
            subtitle="Total AI processing runs"
            icon={Activity} 
          />
          <StatCard 
            title="Average Score" 
            value={avgScore} 
            subtitle="Across all completed"
            icon={TrendingUp}
            valueClass={getScoreColor(avgScore)}
          />
          <StatCard 
            title="Best Score" 
            value={bestScore} 
            subtitle="Highest ATS match"
            icon={Award}
            valueClass={getScoreColor(bestScore)}
          />
        </div>
      )}

      {!loading && versionData.length > 1 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
                <LineChartIcon className="text-sky-400" size={20} />
                Version Progress
              </h2>
              <p className="text-sm text-slate-400 mt-1">Score improvement across your most updated resume.</p>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={versionData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#38bdf8" 
                  strokeWidth={3}
                  dot={{ fill: '#0f172a', stroke: '#38bdf8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-white">Recent Analyses</h2>
          {analyses.length > 0 && (
            <Link to="/resumes" className="text-sky-400 hover:text-sky-300 font-medium text-sm flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="card h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
          </div>
        ) : analyses.length === 0 ? (
          <div className="card border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="text-sky-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No analyses yet</h3>
            <p className="text-slate-400 max-w-md mb-6">
              Upload your first resume to get actionable AI insights, ATS scoring, and personalized feedback.
            </p>
            <Link to="/upload" className="btn-primary flex items-center gap-2">
              <UploadCloud size={18} /> Upload Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.slice(0, 6).map(analysis => (
              <Link key={analysis._id} to={`/analysis/${analysis.resume?._id}`} className="block group">
                <div className="card h-full transition-all duration-300 hover:border-sky-500/50 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-medium text-white truncate" title={analysis.resume?.originalName}>
                        {analysis.resume?.originalName || 'Unknown Resume'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {analysis.status === 'completed' && (
                      <div className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreColorBg(analysis.atsScore)}`}>
                        {analysis.atsScore}
                      </div>
                    )}
                  </div>
                  
                  {analysis.status === 'completed' ? (
                    <div className="space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        {analysis.detectedSkills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] uppercase font-semibold tracking-wider">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {analysis.overallFeedback}
                      </p>
                    </div>
                  ) : analysis.status === 'failed' ? (
                    <div className="flex items-center gap-2 text-rose-400 text-sm">
                      <div className="w-4 h-4 flex items-center justify-center font-bold">!</div>
                      Analysis failed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <div className="w-4 h-4 border-2 border-slate-600 border-t-sky-500 rounded-full animate-spin"></div>
                      Processing analysis...
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
