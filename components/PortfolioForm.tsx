import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { FileText, Linkedin, PenTool, Upload, ArrowRight, AlertCircle, Github } from 'lucide-react';
import { Document, Page, pdfjs } from "react-pdf";

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import LinkedInDataUpload from './LinkedInDataUpload';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function PortfolioForm({ onSubmit, loading }: any) {
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
  const [fileError, setFileError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [linkedinMethod, setLinkedinMethod] = useState<'export' | 'url'>('url');
  const [githubError, setGithubError] = useState('');
  
   const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear GitHub error when username input changes
    if (name === 'githubUsername') {
      setGithubError('');
    }
  };

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

  const isValidGithubUsername = (username: string): boolean => {
  // GitHub username rules:
  // - Can only contain alphanumeric characters and hyphens
  // - Cannot have multiple consecutive hyphens
  // - Cannot begin or end with a hyphen
  // - Maximum 39 characters
  const githubUsernamePattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubUsernamePattern.test(username);
};
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    let payload = {};
    
    if (formData.useGithub) {
      // Validate GitHub username before submission
      if (!validateGithubUsername()) return;
      
      payload = { githubUsername: formData.githubUsername };
    } else if (formData.useLinkedIn) {
      if (linkedinMethod === 'export' && formData.linkedInData) {
        // Send the extracted LinkedIn data directly
        payload = { linkedInData: formData.linkedInData };
      } else {
        // Send the LinkedIn URL
        payload = { linkedInUrl: formData.linkedInUrl };
      }
    } else if (formData.resumeText) {
      payload = { resumeText: formData.resumeText };
    } else {
      // Manual data
      payload = {
        resumeText: `
          Name: ${formData.name}
          Title: ${formData.title}
          About: ${formData.about}
          Experience:
          - ${formData.jobTitle} (${formData.jobPeriod})
            ${formData.jobDescription}
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
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      onSubmit({
        code: data.code,
        metadata: data.metadata
      });
    } catch (error) {
      console.error('Error generating portfolio:', error);
      // Show error to user with toast notification
    }
  };

  

  

  
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
          {/* GitHub Panel - New */}
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
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-500 text-gray text-sm">
                        github.com/
                      </span>
                      <input
                        type="text"
                        name="githubUsername"
                        className="flex-1 text-black min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || 
            (formData.useLinkedIn && linkedinMethod === 'url' && !formData.linkedInUrl) || 
            (formData.useLinkedIn && linkedinMethod === 'export' && !formData.linkedInData) ||
            (formData.useGithub && !formData.githubUsername) ||
            (!formData.useLinkedIn && !formData.useGithub && !formData.resumeText && !formData.name)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          {loading ? (
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
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}