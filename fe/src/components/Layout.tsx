import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, FileText, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/assessment', icon: FileText, label: 'Assessment' },
    { path: '/results', icon: BarChart3, label: 'Results' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Kidney Disease Predictor</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Advanced Medical Assessment</p>
              </div>
            </Link>
            
            <nav className="flex space-x-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === path
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2025 Kidney Disease Predictor - For Educational and Research Purposes</p>
            <p className="mt-1">This tool is not a substitute for professional medical advice</p>
          </div>
        </div>
      </footer>
    </div>
  );
};