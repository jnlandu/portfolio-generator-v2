"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import PortfolioForm from '@/components/PortfolioForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import Image from 'next/image';

export default function CreatePortfolioPage() {
  const [generatedPortfolio, setGeneratedPortfolio] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Update step when portfolio is generated
  useEffect(() => {
    if (generatedPortfolio) {
      setCurrentStep(2);
    }
  }, [generatedPortfolio]);
  
  const handlePortfolioGeneration = async (data: any) => {
    setIsGenerating(true);
    
    try {
      // Simulate a slight delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      setGeneratedPortfolio(data);
    } catch (error) {
      console.error('Error generating portfolio:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
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
      
      {/* Progress steps */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-between">
          <div className="relative flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-200'} transition-colors duration-300`}>
              {currentStep > 1 ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <span className="text-white font-semibold">1</span>
              )}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-900">Input Data</span>
          </div>
          
          <div className="w-full mx-4 mt-5">
            <div className="h-1 relative max-w-full rounded-full overflow-hidden">
              <div className="w-full h-full bg-gray-200 absolute"></div>
              <div className={`h-full bg-indigo-600 absolute transition-all duration-500 ease-in-out ${currentStep > 1 ? 'w-full' : 'w-0'}`}></div>
            </div>
          </div>
          
          <div className="relative flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'} transition-colors duration-300`}>
              <span className="text-white font-semibold">2</span>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-900">Preview & Export</span>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {currentStep === 1 && !generatedPortfolio && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Professional Portfolio</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your professional experience into a stunning portfolio website in minutes.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3">
                <PortfolioForm 
                  onSubmit={handlePortfolioGeneration} 
                  loading={isGenerating} 
                />
              </div>
              
              <div className="lg:col-span-2 lg:sticky lg:top-24">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-indigo-100">
                  <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <h3 className="text-xl font-semibold text-white">Why Use PortfolioAI?</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      <li className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-800 font-medium">Professional Design</p>
                          <p className="text-gray-600 text-sm">Stunning, responsive portfolios that look great on all devices</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-800 font-medium">Fast Generation</p>
                          <p className="text-gray-600 text-sm">Create a portfolio in minutes, not hours or days</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-800 font-medium">Multiple Integrations</p>
                          <p className="text-gray-600 text-sm">Import from LinkedIn, GitHub, or your resume</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-800 font-medium">Full Ownership</p>
                          <p className="text-gray-600 text-sm">Download your HTML and host it anywhere</p>
                        </div>
                      </li>
                    </ul>
                    
                    <div className="mt-6 bg-indigo-50 rounded-lg p-4">
                      <p className="text-sm text-indigo-700 italic">
                        "I created a stunning portfolio in just 5 minutes. The AI perfectly captured my professional experience!"
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">JD</div>
                        <p className="ml-2 text-xs font-medium text-gray-800">Jamie Doe, Frontend Developer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {generatedPortfolio && (
          <div className="max-w-6xl mx-auto">
            <PortfolioPreview 
              code={generatedPortfolio.code} 
              metadata={generatedPortfolio.metadata}
              onBack={() => {
                setGeneratedPortfolio(null);
                setCurrentStep(1);
              }}
            />
          </div>
        )}
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