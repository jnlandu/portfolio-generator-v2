'use client'

import { useState } from 'react';
import PortfolioForm from '../components/PortfolioForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import ChatInterface from '@/components/ChatInterface';
import { motion } from 'framer-motion';

export default function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Track current step: 1=Form, 2=Preview+Chat

  const generatePortfolio = async (data: any) => {
    setLoading(true);
    
    try {
        setPortfolioData(data.metadata);
        setGeneratedCode(data.code);
        setLoading(false);
        setStep(2); // Move to preview step
    } catch (error) {
      console.error('Error generating portfolio:', error);
      setLoading(false);
    }
  };

  const updatePortfolio = async (message: any) => {
  try {
    const response = await fetch('/api/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        currentCode: generatedCode
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    setGeneratedCode(data.code);
    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return {
      success: false,
      message: 'Failed to update the portfolio'
    };
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight"
          >
            AI Portfolio Generator
          </motion.h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Create a professional portfolio in minutes using AI
          </p>
        </header>

        <main>
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Enter Your Details</h2>
                <PortfolioForm onSubmit={generatePortfolio} loading={loading} />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Your Portfolio</h2>
                <button 
                  onClick={() => setStep(1)} 
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Back to Form
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Preview takes 7 columns on large screens */}
                <div className="lg:col-span-7 bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-4 text-gray-800">Preview</h3>
                    {/* <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <PortfolioPreview code={generatedCode} />
                    </div> */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
                        </div>
                      ) : (
                        <PortfolioPreview code={generatedCode} />
                      )}
                  </div>
                </div>
                
                {/* Chat takes 5 columns on large screens */}
                <div className="lg:col-span-5 bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-4 text-gray-800">Refine with AI</h3>
                    <ChatInterface onSendMessage={updatePortfolio} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>

        <footer className="mt-16 py-6 text-center text-gray-500">
          <p>© 2025 Portfolio Generator • Made with AI</p>
        </footer>
      </div>
    </div>
  );
}