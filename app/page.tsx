'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles, PenTool, Globe } from 'lucide-react';
import Layout from '@/components/Layout';
import PortfolioForm from '@/components/PortfolioForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import ChatInterface from '@/components/ChatInterface';
import PublishModal from '@/components/PublishModal';

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=Form, 2=Preview+Chat
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  
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

  const handlePublish = async (publishData: any) => {
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...publishData,
          code: generatedCode,
          metadata: portfolioData
        }),
      });
      
      const data = await response.json();
      
      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      return {
        success: false,
        message: 'Failed to publish portfolio'
      };
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
            >
              Professional Portfolio Generator
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
            >
              Create Your Professional <br/> Portfolio in Minutes
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Powered by AI to showcase your skills and experience
            </motion.p>
          </header>

          <main>
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                      <PenTool className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Input Your Data</h3>
                    <p className="text-gray-600 mb-4">Paste your resume, connect LinkedIn, or enter details manually.</p>
                    <div className="flex items-center text-indigo-600 text-sm font-medium">
                      <span>Step 1</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                      <Sparkles className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI Generation</h3>
                    <p className="text-gray-600 mb-4">Our AI creates a personalized portfolio based on your professional profile.</p>
                    <div className="flex items-center text-indigo-600 text-sm font-medium">
                      <span>Step 2</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                      <Globe className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Publish & Share</h3>
                    <p className="text-gray-600 mb-4">Refine, customize, and publish your portfolio with a custom URL.</p>
                    <div className="flex items-center text-indigo-600 text-sm font-medium">
                      <span>Step 3</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
                
                <PortfolioForm onSubmit={generatePortfolio} loading={loading} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Your Portfolio</h2>
                    <p className="text-gray-600">Generated based on your professional profile</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(1)} 
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back to Form
                    </button>
                    <button 
                      onClick={() => setPublishModalOpen(true)} 
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      Publish
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Preview takes 7 columns on large screens */}
                  <div className="lg:col-span-7">
                    <PortfolioPreview 
                      code={generatedCode} 
                      onPublish={() => setPublishModalOpen(true)}
                    />
                  </div>
                  
                  {/* Chat takes 5 columns on large screens */}
                  <div className="lg:col-span-5">
                    <ChatInterface 
                      currentCode={generatedCode}
                      onCodeUpdate={(newCode: string) => setGeneratedCode(newCode)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </main>

          <footer className="mt-16 py-6 text-center text-gray-500">
            <p className="text-sm">© 2025 PortfolioAI • Professional Portfolio Generator</p>
          </footer>
        </div>
      </div>
      
      <PublishModal 
        isOpen={publishModalOpen} 
        onClose={() => setPublishModalOpen(false)} 
        onPublish={handlePublish}
        portfolioData={portfolioData}
      />
    </Layout>
  );
}