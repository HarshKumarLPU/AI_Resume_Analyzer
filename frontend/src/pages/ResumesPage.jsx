import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumes } from '../hooks/useResumes';
import { ResumeSkeleton } from '../components/ui/Skeleton';
import { FileText, Trash2, Activity, UploadCloud, Calendar, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

const ResumesPage = () => {
  const { resumes, loading, fetchResumes, removeResume } = useResumes();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume? This cannot be undone.')) {
      await removeResume(id);
    }
  };

  const getScoreColorBg = (score) => {
    if (score >= 70) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">My Resumes</h1>
          <p className="text-slate-400">Manage your uploaded resumes and view past analyses.</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <UploadCloud size={18} /> Upload New
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            <ResumeSkeleton />
            <ResumeSkeleton />
            <ResumeSkeleton />
          </>
        ) : resumes.length === 0 ? (
          <div className="card border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-sky-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No resumes found</h3>
            <p className="text-slate-400 mb-6">Upload a resume to get started.</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <div key={resume._id} className="card p-0 overflow-hidden hover:border-slate-700 transition-colors">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`p-3 rounded-xl shrink-0 ${resume.fileType === 'pdf' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    <FileText size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-200 truncate text-lg">{resume.originalName}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 uppercase font-medium">
                        {resume.fileType}
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive size={12} /> {(resume.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(resume.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:ml-auto border-t border-slate-800 sm:border-0 pt-4 sm:pt-0">
                  {resume.isAnalyzed && resume.analysis?.status === 'completed' && (
                    <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${getScoreColorBg(resume.analysis.atsScore)}`}>
                      <span className="text-xs uppercase font-bold tracking-wider opacity-80">ATS Score</span>
                      <span className="text-xl font-bold font-display leading-none">{resume.analysis.atsScore}</span>
                    </div>
                  )}
                  {resume.isAnalyzed && resume.analysis?.status === 'failed' && (
                    <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl border bg-rose-500/10 text-rose-400 border-rose-500/20">
                      <span className="text-xs uppercase font-bold tracking-wider opacity-80">Failed</span>
                      <span className="text-xl font-bold font-display leading-none">!</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    {resume.isAnalyzed ? (
                      <Link 
                        to={`/analysis/${resume._id}`}
                        className="btn-primary py-2.5 flex items-center gap-2"
                      >
                        <Activity size={16} /> <span className="hidden sm:inline">View Analysis</span>
                      </Link>
                    ) : (
                      <button 
                        onClick={() => navigate('/upload')} 
                        className="btn-secondary py-2.5 flex items-center gap-2"
                      >
                        <Activity size={16} /> Analyze
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(resume._id)}
                      className="p-2.5 rounded-xl text-slate-400 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResumesPage;
