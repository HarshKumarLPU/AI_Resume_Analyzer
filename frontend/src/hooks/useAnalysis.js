import { useState, useCallback } from 'react';
import { analysisAPI } from '../api/services';
import toast from 'react-hot-toast';

export const useAnalysis = (resumeId) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const res = await analysisAPI.getById(resumeId);
      if (res.data.success) {
        setAnalysis(res.data.data.analysis);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  const triggerAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analysisAPI.create(resumeId);
      if (res.data.success) {
        setAnalysis(res.data.data.analysis);
        toast.success('Analysis completed!');
        return res.data.data.analysis;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to run analysis');
    } finally {
      setLoading(false);
    }
  };

  const reAnalyze = async () => {
    setLoading(true);
    try {
      const res = await analysisAPI.reanalyze(resumeId);
      if (res.data.success) {
        setAnalysis(res.data.data.analysis);
        toast.success('Re-analysis completed!');
        return res.data.data.analysis;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to run analysis');
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, fetchAnalysis, triggerAnalysis, reAnalyze };
};
