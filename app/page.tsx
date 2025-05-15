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
      // Simulate API call
      setTimeout(() => {
        const samplePortfolio = `
          <div class="portfolio">
            <header class="bg-blue-500 text-white p-8">
              <h1 class="text-3xl font-bold">${data.name || 'Jane Smith'}</h1>
              <h2 class="text-xl">${data.title || 'Full Stack Developer'}</h2>
            </header>
            <main class="p-8">
              <section class="mb-6">
                <h3 class="text-xl font-semibold mb-2">About Me</h3>
                <p>${data.about || 'Full Stack Developer with 5 years of experience in React, Node.js, and cloud technologies.'}</p>
              </section>
              <section class="mb-6">
                <h3 class="text-xl font-semibold mb-2">Experience</h3>
                <div class="mb-4">
                  <h4 class="font-medium">${data.jobTitle || 'Senior Developer at TechCorp'}</h4>
                  <p class="text-gray-600">${data.jobPeriod || '2020 - Present'}</p>
                  <p>${data.jobDescription || 'Led development of cloud-based SaaS products.'}</p>
                </div>
              </section>
            </main>
          </div>
        `;
        
        setPortfolioData(data);
        setGeneratedCode(samplePortfolio);
        setLoading(false);
        setStep(2); // Move to preview step
      }, 1500);
    } catch (error) {
      console.error('Error generating portfolio:', error);
      setLoading(false);
    }
  };

  const updatePortfolio = async (message: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedCode = generatedCode.replace(
          'Full Stack Developer with 5 years of experience',
          'Experienced Full Stack Developer specializing in React and Node.js'
        );
        
        setGeneratedCode(updatedCode);
        resolve({
          success: true,
          message: "I've updated your portfolio based on your request."
        });
      }, 1000);
    });
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
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <PortfolioPreview code={generatedCode} />
                    </div>
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