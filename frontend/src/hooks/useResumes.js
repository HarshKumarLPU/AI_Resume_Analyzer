import { useState, useCallback } from 'react';
import { resumeAPI } from '../api/services';
import toast from 'react-hot-toast';

export const useResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.getAll();
      if (res.data.success) {
        setResumes(res.data.data.resumes);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeResume = async (id) => {
    try {
      const res = await resumeAPI.delete(id);
      if (res.data.success) {
        setResumes(prev => prev.filter(r => r._id !== id));
        toast.success('Resume deleted successfully');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete resume');
      return false;
    }
  };

  return { resumes, loading, fetchResumes, removeResume };
};
