import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { FileText, Linkedin, PenTool, Upload, ArrowRight, AlertCircle } from 'lucide-react';
import { Document, Page, pdfjs } from "react-pdf";

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function PortfolioForm({ onSubmit, loading }: any) {
  const [formData, setFormData] = useState({
    linkedInUrl: '',
    resumeText: '',
    name: '',
    title: '',
    about: '',
    jobTitle: '',
    jobPeriod: '',
    jobDescription: '',
    useLinkedIn: false,
    resumeFile: null
  });
  const [fileError, setFileError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    let payload = {};
    
    if (formData.useLinkedIn) {
      payload = { linkedInUrl: formData.linkedInUrl };
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
      <Tab.Group onChange={(index: any) => setFormData(prev => ({
        ...prev,
        useLinkedIn: index === 1
      }))}>
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
                <p className="text-sm text-indigo-700 mb-4">We'll extract your professional details from your public profile</p>
                
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
                  Make sure your profile is public. We only extract the information visible to everyone.
                </p>
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
            (formData.useLinkedIn && !formData.linkedInUrl) || 
            (!formData.useLinkedIn && !formData.resumeText && !formData.name)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              Generate Portfolio
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}