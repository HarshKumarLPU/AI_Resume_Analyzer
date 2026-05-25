import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="text-9xl font-display font-bold text-slate-800 mb-4 select-none">404</div>
      <h1 className="text-3xl font-display font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-slate-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <Home size={18} /> Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
