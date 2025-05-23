"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import InteractivePortfolioBuilder from '@/components/InteractivePortfolioBuilder';

export default function CreatePortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </div>
                <span className="ml-2 text-gray-600 font-medium group-hover:text-gray-900 transition-colors duration-200">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">PortfolioAI</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Professional Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your professional experience into a stunning portfolio website in minutes.
          </p>
        </div>
        
        <InteractivePortfolioBuilder />
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 PortfolioAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}