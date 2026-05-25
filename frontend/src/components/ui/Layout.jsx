import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  BrainCircuit
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: UploadCloud, label: 'Upload Resume' },
    { to: '/resumes', icon: FileText, label: 'My Resumes' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const NavLinks = ({ onClick }) => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`
          }
        >
          <item.icon size={20} />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200 selection:bg-sky-500/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-xl">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/60">
          <BrainCircuit className="text-sky-500" size={24} />
          <span className="font-display font-bold text-lg tracking-tight">AI Resume</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold uppercase shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-sky-500" size={20} />
          <span className="font-display font-bold">AI Resume</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-64 bg-slate-900 h-full border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in">
            <div className="h-14 border-b border-slate-800 flex items-center justify-end px-4">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <NavLinks onClick={() => setMobileMenuOpen(false)} />
            </nav>
            <div className="p-4 border-t border-slate-800">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-gradient-to-b from-slate-950 to-slate-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
