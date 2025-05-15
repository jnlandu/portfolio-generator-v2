import React from 'react';
import { useState } from 'react';

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
  });
  
  const [activeTab, setActiveTab] = useState('paste');
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      // Call the generate API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: formData.useLinkedIn ? '' : formData.resumeText,
          linkedInUrl: formData.useLinkedIn ? formData.linkedInUrl : ''
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      // Pass the generated portfolio back to the parent
      onSubmit({
        code: data.code,
        metadata: data.metadata
      });
    } catch (error) {
      console.error('Error generating portfolio:', error);
      // Handle error (show error message to user)
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Input Your Data</h2>
      
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'paste' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('paste')}
        >
          Paste Resume
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'linkedin' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('linkedin')}
        >
          LinkedIn
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('manual')}
        >
          Manual Input
        </button>
      </div>
      
      <div>
        {activeTab === 'paste' && (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Paste Resume Text</label>
            <textarea
              name="resumeText"
              className="w-full p-2 border rounded h-60"
              value={formData.resumeText}
              onChange={handleChange}
              placeholder="Copy and paste your resume or CV content here..."
            />
          </div>
        )}
        
        {activeTab === 'linkedin' && (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">LinkedIn URL</label>
            <input
              type="text"
              name="linkedInUrl"
              className="w-full p-2 border rounded"
              value={formData.linkedInUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <p className="text-sm text-gray-500 mt-1">
              We'll extract your professional details from your public profile
            </p>
          </div>
        )}
        
        {activeTab === 'manual' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-gray-700">Professional Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Full Stack Developer"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">About Me</label>
              <textarea
                name="about"
                className="w-full p-2 border rounded h-24"
                value={formData.about}
                onChange={handleChange}
                placeholder="A brief description about yourself and your skills..."
              />
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block mb-1 text-gray-700">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    className="w-full p-2 border rounded"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Senior Developer at TechCorp"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-gray-700">Period</label>
                  <input
                    type="text"
                    name="jobPeriod"
                    className="w-full p-2 border rounded"
                    value={formData.jobPeriod}
                    onChange={handleChange}
                    placeholder="2020 - Present"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-gray-700">Description</label>
                <textarea
                  name="jobDescription"
                  className="w-full p-2 border rounded h-24"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        )}
        
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 w-full"
          onClick={handleSubmit}
          disabled={loading || (activeTab === 'paste' && !formData.resumeText) || (activeTab === 'linkedin' && !formData.linkedInUrl)}
        >
          {loading ? 'Generating...' : 'Generate Portfolio'}
        </button>
      </div>
    </div>
  );
}