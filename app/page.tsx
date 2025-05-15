'use client'

import Head from 'next/head';
import { useState } from 'react';
import PortfolioForm from '../components/PortfolioForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import ChatInterface from '@/components/ChatInterface';
// import PortfolioPreview from '../components/PortfolioPreview';
// import ChatInterface from '../components/ChatInterface';

export default function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle portfolio generation
  const generatePortfolio = async (data: any) => {
    setLoading(true);
    
    try {
      // In production, this would be an API call to OpenAI or other AI service
      // For demo, we'll simulate a response
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
      }, 1500);
    } catch (error) {
      console.error('Error generating portfolio:', error);
      setLoading(false);
    }
  };

  // Function to update portfolio based on chat
  const updatePortfolio = async (message: any) => {
    // In production, this would send the message to AI to update the portfolio code
    // For demo, we'll simulate a response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Example update - in reality, this would be AI-generated
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
    <div>
      <Head>
        <title>Portfolio Generator</title>
        <meta name="description" content="Generate a portfolio from your CV or LinkedIn profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">AI Portfolio Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <PortfolioForm 
              onSubmit={generatePortfolio}
              loading={loading}
            />
          </div>
          
          {/* Preview Section */}
          <div>
            <PortfolioPreview 
              code={generatedCode} 
            />
          </div>
        </div>
        
        {/* Chat Interface - only show when we have generated code */}
        {generatedCode && (
          <div className="mt-8">
            <ChatInterface 
              onSendMessage={updatePortfolio}
            />
          </div>
        )}
      </main>

      <footer className="mt-12 p-4 text-center text-gray-500">
        <p>© 2025 Portfolio Generator</p>
      </footer>
    </div>
  );
}