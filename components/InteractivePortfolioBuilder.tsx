"use client";

import { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { FileText, Linkedin, PenTool, Upload, ArrowRight, AlertCircle, Github, Copy, Download, RotateCw, CheckCircle, SplitSquareVertical, ExternalLink, X } from 'lucide-react';
import { Document, Page, pdfjs } from "react-pdf";
import debounce from 'lodash/debounce';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import LinkedInDataUpload from './LinkedInDataUpload';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function InteractivePortfolioBuilder() {
  const [formData, setFormData] = useState({
    linkedInUrl: '',
    githubUsername: '',
    resumeText: '',
    name: '',
    title: '',
    about: '',
    jobTitle: '',
    jobPeriod: '',
    jobDescription: '',
    linkedInData: null,
    useLinkedIn: false,
    useGithub: false,
    resumeFile: null
  });
  
  // Preview state
  const [portfolioHtml, setPortfolioHtml] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMode, setPreviewMode] = useState<'split' | 'full'>('split');
  const [isCopied, setIsCopied] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  
  // Form state
  const [fileError, setFileError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [linkedinMethod, setLinkedinMethod] = useState<'export' | 'url'>('url');
  const [githubError, setGithubError] = useState('');
  
  // Debounced generation function
  const debouncedGenerate = useCallback(
    debounce(async (data: any) => {
      if (!shouldGeneratePortfolio(data)) return;
      
      await generatePortfolio(data);
    }, 1500),
    []
  );
  
  // Check if we have enough data to generate a portfolio
  const shouldGeneratePortfolio = (data: any) => {
    if (data.useGithub && data.githubUsername) return true;
    if (data.useLinkedIn && linkedinMethod === 'url' && data.linkedInUrl) return true;
    if (data.useLinkedIn && linkedinMethod === 'export' && data.linkedInData) return true;
    if (data.resumeText && data.resumeText.length > 100) return true;
    if (!data.useLinkedIn && !data.useGithub && !data.resumeText && 
        data.name && data.title && data.about) return true;
    
    return false;
  };
  
  // Auto-generate when form data changes
  useEffect(() => {
    if (autoGenerate) {
      debouncedGenerate(formData);
    }
  }, [formData, autoGenerate, debouncedGenerate]);
  
  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear GitHub error when username input changes
    if (name === 'githubUsername') {
      setGithubError('');
    }
  };
  
  // Extract text from PDF files
  const extractTextFromPdf = async (file: File): Promise<string> => {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Concatenate the text items
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  };
  
  // Handle file uploads
  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessingFile(true);
    setFileError('');
    
    try {
      if (file.type === 'application/pdf') {
        // Handle PDF files
        const text = await extractTextFromPdf(file);
        setFormData(prev => ({
          ...prev,
          resumeText: text
        }));
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // Handle text files
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({
            ...prev,
            resumeText: event.target?.result as string || ''
          }));
        };
        reader.readAsText(file);
      } else if (file.type === 'application/msword' || 
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Inform user that direct Word parsing isn't supported
        setFileError('Word documents (.doc/.docx) cannot be parsed directly. Please copy and paste the content.');
      } else {
        setFileError('Unsupported file type. Please use PDF or TXT files.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setFileError('Failed to process the file. Please try again or paste the text manually.');
    } finally {
      setIsProcessingFile(false);
    }
  };
  
  // Validate GitHub username format
  const isValidGithubUsername = (username: string): boolean => {
    // GitHub username rules:
    // - Can only contain alphanumeric characters and hyphens
    // - Cannot have multiple consecutive hyphens
    // - Cannot begin or end with a hyphen
    // - Maximum 39 characters
    const githubUsernamePattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    return githubUsernamePattern.test(username);
  };
  
  // Validate GitHub username
  const validateGithubUsername = () => {
    if (!formData.githubUsername) {
      setGithubError('GitHub username is required');
      return false;
    }
    
    if (!isValidGithubUsername(formData.githubUsername)) {
      setGithubError('Invalid GitHub username format');
      return false;
    }
    
    return true;
  };
  
  // Generate portfolio based on current form data
  const generatePortfolio = async (data = formData) => {
    setIsGenerating(true);
    setErrorMessage('');
    
    let payload = {};
    
    if (data.useGithub) {
      // Validate GitHub username before submission
      if (!validateGithubUsername()) {
        setIsGenerating(false);
        return;
      }
      
      payload = { githubUsername: data.githubUsername };
    } else if (data.useLinkedIn) {
      if (linkedinMethod === 'export' && data.linkedInData) {
        // Send the extracted LinkedIn data directly
        payload = { linkedInData: data.linkedInData };
      } else {
        // Send the LinkedIn URL
        payload = { linkedInUrl: data.linkedInUrl };
      }
    } else if (data.resumeText) {
      payload = { resumeText: data.resumeText };
    } else {
      // Manual data
      payload = {
        resumeText: `
          Name: ${data.name}
          Title: ${data.title}
          About: ${data.about}
          Experience:
          - ${data.jobTitle} (${data.jobPeriod})
            ${data.jobDescription}
        `
      };
    }
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.message);
      }
      
      setPortfolioHtml(responseData.code);
      setMetadata(responseData.metadata);
    } catch (error) {
      console.error('Error generating portfolio:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle copy code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(portfolioHtml);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  // Handle download
  const handleDownload = () => {
    const blob = new Blob([portfolioHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata?.name || 'portfolio'}.html`.toLowerCase().replace(/\s+/g, '-');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Form section */}
        <div className={`${previewMode === 'full' && portfolioHtml ? 'hidden lg:block' : ''}`}>
          <Tab.Group onChange={(index: number) => {
            // Reset all flags
            setFormData(prev => ({
              ...prev,
              useLinkedIn: false,
              useGithub: false
            }));
            
            // Set appropriate flag based on selected tab
            if (index === 1) { // LinkedIn tab
              setFormData(prev => ({ ...prev, useLinkedIn: true }));
            } else if (index === 2) { // GitHub tab
              setFormData(prev => ({ ...prev, useGithub: true }));
            }
          }}>
            <Tab.List className="flex bg-gray-50 border-b border-gray-200 px-4">
              <Tab className={({ selected }: any) => `
                px-4 py-3 text-sm font-medium flex items-center gap-2
                ${selected ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}
                focus:outline-none transition-colors
              `}>
                <FileText className="w-4 h-4" />
                Resume
              </Tab>
              <Tab className={({ selected }: any) => `
                px-4 py-3 text-sm font-medium flex items-center gap-2
                ${selected ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}
                focus:outline-none transition-colors
              `}>
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Tab>
              <Tab className={({ selected }: any) => `
                px-4 py-3 text-sm font-medium flex items-center gap-2
                ${selected ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}
                focus:outline-none transition-colors
              `}>
                <Github className="w-4 h-4" />
                GitHub
              </Tab>
              <Tab className={({ selected }: any) => `
                px-4 py-3 text-sm font-medium flex items-center gap-2
                ${selected ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}
                focus:outline-none transition-colors
              `}>
                <PenTool className="w-4 h-4" />
                Manual
              </Tab>
            </Tab.List>
            
            <Tab.Panels className="p-6">
              {/* Resume tab panel */}
              <Tab.Panel>
                <div className="space-y-6">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 flex items-start gap-4">
                    <Upload className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-indigo-800 mb-1">Upload Resume</h4>
                      <p className="text-sm text-indigo-700 mb-3">Upload your resume file (PDF or TXT) or paste the text below</p>
                      
                      <input 
                        type="file" 
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-indigo-600 file:text-white
                          hover:file:bg-indigo-700
                          file:cursor-pointer cursor-pointer"
                        accept=".txt,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        disabled={isProcessingFile}
                      />
                      
                      {isProcessingFile && (
                        <div className="mt-2 flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm text-indigo-600">Processing file...</span>
                        </div>
                      )}
                      
                      {fileError && (
                        <div className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {fileError}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Text
                    </label>
                    <textarea
                      name="resumeText"
                      rows={12}
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Your resume content will appear here after uploading, or you can paste it manually..."
                      value={formData.resumeText}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </Tab.Panel>
              
              {/* LinkedIn tab panel */}
              <Tab.Panel>
                <div className="space-y-6">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <h4 className="font-medium text-indigo-800 mb-1">LinkedIn Profile</h4>
                    
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-800 mb-2">Choose how to use your LinkedIn data:</h5>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex items-start">
                          <input
                            id="linkedin-export"
                            name="linkedinMethod"
                            type="radio"
                            value="export"
                            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={linkedinMethod === 'export'}
                            onChange={() => setLinkedinMethod('export')}
                          />
                          <label htmlFor="linkedin-export" className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">Upload LinkedIn Export (Recommended)</span>
                            <span className="block text-xs text-gray-500">Most accurate method - upload your data export</span>
                          </label>
                        </div>
                        
                        <div className="flex items-start">
                          <input
                            id="linkedin-url"
                            name="linkedinMethod"
                            type="radio"
                            value="url"
                            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={linkedinMethod === 'url'}
                            onChange={() => setLinkedinMethod('url')}
                          />
                          <label htmlFor="linkedin-url" className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</span>
                            <span className="block text-xs text-gray-500">Limited data - you'll need to review the generated portfolio</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {linkedinMethod === 'export' ? (
                      <LinkedInDataUpload 
                        onDataExtracted={(data) => {
                          setFormData(prev => ({
                            ...prev,
                            linkedInData: data,
                            useLinkedIn: true
                          }));
                        }}
                      />
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          name="linkedInUrl"
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedInUrl}
                          onChange={handleChange}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          We'll use your profile URL to help generate your portfolio.
                        </p>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-sm text-amber-800">
                          <p>
                            <strong>Note:</strong> Due to LinkedIn's restrictions, we cannot directly access all profile data.
                            If the portfolio doesn't include all your information, please consider uploading your LinkedIn data export instead.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Tab.Panel>
              
              {/* GitHub tab panel */}
              <Tab.Panel>
                <div className="space-y-6">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Github className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-indigo-800 mb-1">GitHub Profile</h4>
                        <p className="text-sm text-indigo-700 mb-4">
                          We'll create a developer portfolio showcasing your GitHub projects, contributions, and skills
                        </p>
                        
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub Username
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            github.com/
                          </span>
                          <input
                            type="text"
                            name="githubUsername"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="username"
                            value={formData.githubUsername}
                            onChange={handleChange}
                          />
                        </div>
                        
                        {githubError && (
                          <div className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {githubError}
                          </div>
                        )}
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
                          <h5 className="font-medium text-gray-800 mb-2">What we'll include:</h5>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                              <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                                <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>Your top repositories and projects</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                                <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>Programming languages and technologies you use</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                                <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>GitHub statistics and activity</span>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                                <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>Professional developer portfolio formatting</span>
                            </li>
                          </ul>
                        </div>
                        
                        <p className="mt-4 text-xs text-gray-500">
                          We only access public GitHub information. For private repositories, consider adding them manually or through your resume.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              
              {/* Manual input tab panel */}
              <Tab.Panel>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Front-end Developer"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Me
                    </label>
                    <textarea
                      name="about"
                      rows={4}
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Write a brief summary about yourself..."
                      value={formData.about}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Experience</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            name="jobTitle"
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Senior Developer"
                            value={formData.jobTitle}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Period
                          </label>
                          <input
                            type="text"
                            name="jobPeriod"
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="2020 - Present"
                            value={formData.jobPeriod}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Description
                        </label>
                        <textarea
                          name="jobDescription"
                          rows={4}
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          placeholder="Describe your responsibilities and achievements..."
                          value={formData.jobDescription}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                  type="button"
                  onClick={() => generatePortfolio()}
                  disabled={isGenerating || 
                    (formData.useLinkedIn && linkedinMethod === 'url' && !formData.linkedInUrl) || 
                    (formData.useLinkedIn && linkedinMethod === 'export' && !formData.linkedInData) ||
                    (formData.useGithub && !formData.githubUsername) ||
                    (!formData.useLinkedIn && !formData.useGithub && !formData.resumeText && !formData.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="mr-1">Creating Portfolio</span>
                      <span className="dots-loading">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      Generate Portfolio
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoGenerate}
                    onChange={() => setAutoGenerate(!autoGenerate)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Auto-generate</span>
                </label>
                
                {portfolioHtml && (
                  <button
                    onClick={() => setPreviewMode(previewMode === 'split' ? 'full' : 'split')}
                    className="flex items-center p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    title={previewMode === 'split' ? "Full screen preview" : "Split view"}
                  >
                    {previewMode === 'split' ? <ExternalLink className="h-5 w-5" /> : <SplitSquareVertical className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
            
            {errorMessage && (
              <div className="mt-3 text-sm text-red-600 flex items-center p-2 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Preview section */}
        <div className={`${(!portfolioHtml || (previewMode === 'split' && !portfolioHtml)) ? 'hidden lg:block' : ''} lg:border-l border-gray-200`}>
          {!portfolioHtml ? (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <ArrowRight className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your preview will appear here</h3>
              <p className="text-gray-500 text-center max-w-sm">
                Fill out the form on the left and click "Generate Portfolio" to see your portfolio preview here.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {metadata?.name ? `${metadata.name}'s Portfolio` : 'Your Portfolio'}
                </h3>
                <div className="flex items-center space-x-2">
                  {previewMode === 'full' && (
                    <button
                      onClick={() => setPreviewMode('split')}
                      className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                      title="Split view"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={handleCopyCode}
                    className={`p-1.5 rounded-md ${isCopied ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    title="Copy HTML"
                  >
                    {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                    title="Download HTML"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => generatePortfolio()}
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                    title="Regenerate"
                    disabled={isGenerating}
                  >
                    <RotateCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <iframe
                  title="Portfolio Preview"
                  srcDoc={portfolioHtml}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}