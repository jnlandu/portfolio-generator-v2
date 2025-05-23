"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Tab } from '@headlessui/react';
import { FileText, Linkedin, PenTool, Upload, ArrowRight, AlertCircle, Github, Copy, Download, RotateCw, CheckCircle, SplitSquareVertical, ExternalLink, X, Globe, ChevronLeft, ChevronRight, Smartphone, Tablet, Monitor, Maximize, Minimize } from 'lucide-react';
import { Document, Page, pdfjs } from "react-pdf";
import debounce from 'lodash/debounce';

// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm//Users/jeremie/dev/projects/ml/2025/portfolio/app/[slug]/page.tsx/Users/jeremie/dev/projects/ml/2025/portfolio/app/[slug]/page.tsxPage/TextLayer.css';
import LinkedInDataUpload from './LinkedInDataUpload';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Device presets for responsive preview
const devicePresets = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet' },
  mobile: { width: '375px', height: '667px', label: 'Mobile' },
  smallMobile: { width: '320px', height: '568px', label: 'Small Mobile' }
};

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
  const [resizing, setResizing] = useState(false);
  const [splitRatio, setSplitRatio] = useState(40); // 40% for form, 60% for preview
  const [lastSplitRatio, setLastSplitRatio] = useState(40); // Remember last position when toggling
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<keyof typeof devicePresets>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // References
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [fileError, setFileError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [linkedinMethod, setLinkedinMethod] = useState<'export' | 'url'>('url');
  const [githubError, setGithubError] = useState('');
  
  // Toggle form collapse
  const toggleFormCollapse = () => {
    if (!isFormCollapsed) {
      // Save current split ratio before collapsing
      setLastSplitRatio(splitRatio);
      setIsFormCollapsed(true);
    } else {
      // Restore previous split ratio
      setSplitRatio(lastSplitRatio);
      setIsFormCollapsed(false);
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen && previewContainerRef.current) {
      if (previewContainerRef.current.requestFullscreen) {
        previewContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle resizing
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);
  }, []);
  
  const stopResizing = useCallback(() => {
    setResizing(false);
  }, []);
  
  const resize = useCallback((e: MouseEvent) => {
    if (resizing && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const mouseX = e.clientX - containerRef.current.getBoundingClientRect().left;
      const newRatio = (mouseX / containerWidth) * 100;
      
      // Limit ratio to reasonable values (20% - 80%)
      if (newRatio >= 20 && newRatio <= 80) {
        setSplitRatio(newRatio);
      }
    }
  }, [resizing]);
  
  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);
  
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
    const blob = new Blob([getFullHtml()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata?.name || 'portfolio'}.html`.toLowerCase().replace(/\s+/g, '-');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Get full HTML with DOCTYPE, head, etc.
  const getFullHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata?.name ? `${metadata.name}'s Portfolio` : 'Professional Portfolio'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  ${portfolioHtml}
</body>
</html>`;
  };
  
  // Open portfolio in new tab
  const handlePublish = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(getFullHtml());
      newWindow.document.close();
    }
  };
  
  // Get current grid template columns based on form collapsed state
  const getGridTemplateColumns = () => {
    if (isFormCollapsed) {
      return 'minmax(48px, auto) 1fr'; // Collapsed form takes minimal space
    } else if (previewMode === 'full') {
      return '0fr 1fr'; // Full preview mode
    } else {
      return `${splitRatio}% calc(100% - ${splitRatio}% - 12px)`; // Normal split view
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div 
        ref={containerRef} 
        className="grid grid-cols-1 lg:grid-cols-2" 
        style={{ 
          gridTemplateColumns: getGridTemplateColumns(),
          transition: resizing ? 'none' : 'grid-template-columns 0.3s ease-in-out'
        }}
      >
        {/* Form section */}
        <div 
          className={`relative transition-all duration-300 ease-in-out ${
            previewMode === 'full' && portfolioHtml ? 'hidden lg:block' : ''
          } overflow-hidden`}
        >
          {/* Toggle sidebar button */}
          <button 
            onClick={toggleFormCollapse}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 p-1 rounded-l-md shadow-md transition-all duration-200"
            style={{ right: isFormCollapsed ? 'auto' : '-1px' }}
          >
            {isFormCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          
          {isFormCollapsed ? (
            <div className="h-full w-12 bg-gray-50 flex flex-col items-center py-4 border-r border-gray-200">
              <button 
                className="p-2 mb-6 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                onClick={toggleFormCollapse}
                title="Expand form"
              >
                <ChevronRight size={18} />
              </button>
              <div className="space-y-4">
                <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                  <FileText size={18} />
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Linkedin size={18} />
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Github size={18} />
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <PenTool size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
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
                
                <Tab.Panels className="p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
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
            </>
          )}
        </div>
        
        {/* Resizing handle */}
        {!isFormCollapsed && previewMode !== 'full' && portfolioHtml && (
          <div 
            ref={resizeHandleRef}
            className="hidden lg:block w-3 cursor-col-resize bg-gray-100 hover:bg-indigo-100 transition-colors absolute h-full z-10"
            style={{ left: `calc(${splitRatio}% - 6px)` }}
            onMouseDown={startResizing}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-8 w-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Preview section */}
        <div 
          ref={previewContainerRef}
          className={`${previewMode === 'split' && !portfolioHtml ? 'hidden lg:block' : ''} lg:border-l border-gray-200 overflow-hidden`}
        >
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
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900 mr-4">
                    {metadata?.name ? `${metadata.name}'s Portfolio` : 'Your Portfolio'}
                  </h3>
                  
                  {/* Device selector */}
                  <div className="flex items-center space-x-1 border border-gray-200 rounded-md p-1 bg-gray-50">
                    <button
                      onClick={() => setSelectedDevice('desktop')}
                      className={`p-1 rounded-sm ${selectedDevice === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Desktop view"
                    >
                      <Monitor size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedDevice('tablet')}
                      className={`p-1 rounded-sm ${selectedDevice === 'tablet' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Tablet view"
                    >
                      <Tablet size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedDevice('mobile')}
                      className={`p-1 rounded-sm ${selectedDevice === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Mobile view"
                    >
                      <Smartphone size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedDevice('smallMobile')}
                      className={`p-1 rounded-sm ${selectedDevice === 'smallMobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Small mobile view"
                    >
                      <Smartphone size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {previewMode === 'full' && !isFormCollapsed && (
                    <button
                      onClick={() => setPreviewMode('split')}
                      className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                      title="Split view"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handlePublish}
                    className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-md hover:bg-emerald-50 bg-emerald-50/50"
                    title="Open in browser"
                  >
                    <Globe className="h-4 w-4" />
                  </button>
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
              
              <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 p-4">
                <div 
                  className={`relative transition-all duration-300 ease-in-out ${
                    selectedDevice !== 'desktop' ? 'border-8 border-gray-800 rounded-xl shadow-xl bg-white' : ''
                  }`}
                  style={{
                    width: devicePresets[selectedDevice].width,
                    height: selectedDevice === 'desktop' ? '100%' : devicePresets[selectedDevice].height,
                    maxHeight: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {/* Device notch for mobile clear*/}
                  {(selectedDevice === 'mobile' || selectedDevice === 'smallMobile') && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-lg z-10"></div>
                  )}
                  
                  <iframe
                    title="Portfolio Preview"
                    srcDoc={getFullHtml()}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    style={{
                      transform: selectedDevice !== 'desktop' ? 'scale(1)' : 'none',
                      transformOrigin: 'top left'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Publish button at the bottom */}
      {portfolioHtml && (
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
          <button
            onClick={handlePublish}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
          >
            <Globe className="h-5 w-5" />
            Publish Portfolio in Browser
          </button>
          <p className="mt-2 text-xs text-center text-indigo-700">
            View your complete portfolio with all styles and formatting in a new browser window
          </p>
        </div>
      )}
    </div>
  );
}