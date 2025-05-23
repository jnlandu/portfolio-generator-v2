"use client";

import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface LinkedInDataUploadProps {
  onDataExtracted: (data: any) => void;
}

export default function LinkedInDataUpload({ onDataExtracted }: LinkedInDataUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Check if it's a ZIP file
      if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
        throw new Error('Please upload a ZIP file from LinkedIn data export');
      }
      
      // In a real implementation, we would parse the ZIP file
      // For this demo, we'll simulate the extraction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock LinkedIn data structure
      const linkedInData = {
        name: 'John Developer',
        title: 'Senior Software Engineer',
        about: 'Passionate software engineer with expertise in React, TypeScript, and cloud technologies.',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Solutions Inc.',
            duration: '2020 - Present',
            description: 'Leading frontend development team, implementing React applications and mentoring junior developers.'
          },
          {
            title: 'Frontend Developer',
            company: 'Web Innovations',
            duration: '2017 - 2020',
            description: 'Developed responsive web applications using modern JavaScript frameworks.'
          }
        ],
        education: [
          {
            degree: 'BS in Computer Science',
            institution: 'University of Technology',
            years: '2013 - 2017'
          }
        ],
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'REST APIs', 'Git']
      };
      
      // Pass the extracted data to the parent component
      onDataExtracted(linkedInData);
      setSuccess(true);
    } catch (error) {
      console.error('Error processing LinkedIn data:', error);
      setError(error instanceof Error ? error.message : 'Failed to process LinkedIn data');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
        <div className="mb-4 flex justify-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Upload className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-gray-900 mb-1">Upload LinkedIn Data Export</h3>
        <p className="text-xs text-gray-500 mb-4">
          Upload the ZIP file from your LinkedIn data export
        </p>
        
        <input
          type="file"
          id="linkedin-zip"
          className="hidden"
          accept=".zip"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        
        <label
          htmlFor="linkedin-zip"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Select ZIP File'}
        </label>
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-indigo-700">Processing LinkedIn data...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error processing file</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 p-3 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">LinkedIn data extracted successfully</h3>
            <p className="text-sm text-green-700 mt-1">Your LinkedIn profile data has been imported and is ready to use.</p>
          </div>
        </div>
      )}
      
      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
        <h4 className="text-sm font-medium text-yellow-800 mb-1">How to get your LinkedIn data</h4>
        <ol className="text-xs text-yellow-700 list-decimal pl-4 space-y-1">
          <li>Go to your LinkedIn account settings</li>
          <li>Click on "Data privacy"</li>
          <li>Select "Get a copy of your data"</li>
          <li>Check "Want a larger data archive?" option</li>
          <li>Request archive and download the ZIP file when ready</li>
          <li>Upload the ZIP file here</li>
        </ol>
      </div>
    </div>
  );
}