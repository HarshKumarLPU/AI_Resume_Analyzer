import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { resumeAPI } from '../api/services';
import { useAnalysis } from '../hooks/useAnalysis';
import toast from 'react-hot-toast';
import { UploadCloud, FileType, CheckCircle, AlertCircle } from 'lucide-react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, analyzing, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { triggerAnalysis } = useAnalysis(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Invalid file. Please upload a PDF or DOCX under 10MB.');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const uploadRes = await resumeAPI.upload(formData);
      if (uploadRes.data.success) {
        const resumeId = uploadRes.data.data.resume._id;
        
        setUploadStatus('analyzing');
        
        const { analysisAPI } = await import('../api/services');
        const analysisRes = await analysisAPI.create(resumeId);
        
        if (analysisRes.data.success) {
          setUploadStatus('success');
          toast.success('Analysis complete!');
          setTimeout(() => {
            navigate(`/analysis/${resumeId}`);
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.message || 'There was an error processing your file. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Upload Resume</h1>
        <p className="text-slate-400">Upload your PDF or DOCX file to get instant AI feedback.</p>
      </div>

      <div className="card">
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}
            ${uploadStatus !== 'idle' && uploadStatus !== 'error' ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
              <UploadCloud size={40} />
            </div>
            {isDragActive ? (
              <p className="text-lg font-medium text-sky-400">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium text-slate-200">Drag & drop your resume here</p>
                <p className="text-sm text-slate-500 mt-1">or click to browse from your computer</p>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
              <span className="flex items-center gap-1"><FileType size={14} /> PDF or DOCX</span>
              <span>•</span>
              <span>Max 10MB</span>
            </div>
          </div>
        </div>

        {file && (
          <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-sky-400">
                <FileType size={24} />
              </div>
              <div>
                <p className="font-medium text-slate-200 truncate max-w-[200px] sm:max-w-sm">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            
            {uploadStatus === 'idle' || uploadStatus === 'error' ? (
              <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400 text-sm font-medium">
                Remove
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-sky-400">
                {uploadStatus === 'success' ? (
                  <CheckCircle size={18} className="text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                )}
                {uploadStatus === 'uploading' && 'Uploading...'}
                {uploadStatus === 'analyzing' && 'Analyzing...'}
                {uploadStatus === 'success' && <span className="text-emerald-400">Done!</span>}
              </div>
            )}
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleUpload}
            disabled={!file || (uploadStatus !== 'idle' && uploadStatus !== 'error')}
            className="btn-primary w-full py-4 text-lg"
          >
            {uploadStatus === 'uploading' ? 'Uploading Resume...' : 
             uploadStatus === 'analyzing' ? 'Running AI Analysis...' : 
             uploadStatus === 'success' ? 'Redirecting...' : 
             'Analyze Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
