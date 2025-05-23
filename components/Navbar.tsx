"use client";
import Link from 'next/link';
import { LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you created this in the previous step

export default function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className="font-bold text-xl text-gray-900">PortfolioAI</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/#features" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Blog
            </Link>
          </div>
          <div className="flex items-center">
            {!isLoading && user ? (
              <Link
                href="/dashboard"
                className="ml-4 px-4 py-2 inline-flex items-center text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            ) : !isLoading ? (
              <>
                <Link
                  href="/login" // You'll need to create this page
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
                <Link
                  href="/signup" // You'll need to create this page
                  className="ml-2 px-4 py-2 inline-flex items-center text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up Free
                </Link>
              </>
            ) : (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div> // Skeleton loader
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}