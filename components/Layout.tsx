// dev/projects/ml/2025/portfolio/components/Layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, Home, FileText, Server, Grid } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {showSidebar && (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className="font-bold text-gray-900">PortfolioAI</span>
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link href="/portfolios" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
              <Grid className="w-5 h-5" />
              <span>My Portfolios</span>
            </Link>
            
            <Link href="/templates" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
              <FileText className="w-5 h-5" />
              <span>Templates</span>
            </Link>
            
            <Link href="/publish" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
              <Server className="w-5 h-5" />
              <span>Publishing</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Username</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <Link href="/logout" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </Link>
            </div>
          </div>
        </aside>
      )}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}