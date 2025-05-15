import { useState } from 'react';
import { Upload, AlertCircle, FileText } from 'lucide-react';

interface LinkedInDataUploadProps {
  onDataExtracted: (data: any) => void;
}

export default function LinkedInDataUpload({ onDataExtracted }: LinkedInDataUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Handle LinkedIn data export formats (CSV or JSON)
      if (file.name.endsWith('.zip')) {
        setError('Please extract the ZIP file first, and upload the Profile.csv or Profile.json file');
        setIsProcessing(false);
        return;
      }
      
      if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const fileContent = event.target?.result as string;
            let profileData;
            
            if (file.name.endsWith('.json')) {
              // Process JSON format
              const jsonData = JSON.parse(fileContent);
              profileData = processLinkedInJson(jsonData);
            } else {
              // Process CSV format
              profileData = processLinkedInCsv(fileContent);
            }
            
            onDataExtracted(profileData);
          } catch (err) {
            console.error('Error processing file:', err);
            setError('Could not process the LinkedIn data file. Please ensure it is a valid export file.');
          } finally {
            setIsProcessing(false);
          }
        };
        
        reader.readAsText(file);
      } else {
        setError('Please upload a CSV or JSON file from your LinkedIn data export');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('File processing error:', err);
      setError('An error occurred while processing the file');
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-indigo-600" />
          How to export your LinkedIn data:
        </h5>
        <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
          <li>Go to your LinkedIn account (on a computer)</li>
          <li>Click on your profile picture at the top right → Settings & Privacy</li>
          <li>Click "Data Privacy" in the left menu</li>
          <li>Scroll to "Get a copy of your data" and click "Change"</li>
          <li>Select "Want something in particular?" and check "Profile"</li>
          <li>Click "Request archive"</li>
          <li>Download the ZIP file when ready, extract it, and upload the Profile.csv file</li>
        </ol>
      </div>
      
      <input 
        type="file" 
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-indigo-600 file:text-white
          hover:file:bg-indigo-700
          file:cursor-pointer cursor-pointer"
        accept=".csv,.json"
        onChange={handleFileUpload}
        disabled={isProcessing}
      />
      
      {isProcessing && (
        <div className="mt-2 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-indigo-600">Processing LinkedIn data...</span>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}

// Process LinkedIn JSON export
function processLinkedInJson(jsonData: any) {
  try {
    const profile = jsonData.Profile || jsonData.profile || {};
    
    // Extract skills
    const skills = (profile.skills || []).map((skill: any) => 
      skill.name || skill.skillName || skill
    );
    
    // Extract experience
    const experience = (profile.positions || profile.experience || []).map((exp: any) => ({
      title: exp.title || exp.jobTitle || '',
      company: exp.companyName || exp.company || '',
      duration: `${exp.startDate?.year || ''}-${exp.endDate?.year || 'Present'}`,
      description: exp.description || ''
    }));
    
    // Extract education
    const education = (profile.education || []).map((edu: any) => ({
      institution: edu.schoolName || edu.school || '',
      degree: edu.degreeName || edu.degree || '',
      years: `${edu.startDate?.year || ''}-${edu.endDate?.year || ''}`
    }));
    
    return {
      name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
      title: profile.headline || profile.title || '',
      about: profile.summary || profile.about || '',
      experience,
      education,
      skills,
      source: 'linkedin-export'
    };
  } catch (error) {
    console.error('Error processing LinkedIn JSON:', error);
    throw new Error('Could not parse LinkedIn JSON data');
  }
}

// Process LinkedIn CSV export
function processLinkedInCsv(csvContent: string) {
  try {
    // Basic CSV parsing (this is simplified - a real CSV parser would be better)
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    // Find the profile data in the CSV
    const nameIndex = headers.findIndex(h => h.includes('First Name'));
    const lastNameIndex = headers.findIndex(h => h.includes('Last Name'));
    const titleIndex = headers.findIndex(h => h.includes('Headline') || h.includes('Title'));
    const summaryIndex = headers.findIndex(h => h.includes('Summary') || h.includes('About'));
    
    if (nameIndex === -1 || lastNameIndex === -1) {
      throw new Error('Could not find name fields in CSV');
    }
    
    const profileLine = lines[1].split(',');
    const firstName = profileLine[nameIndex]?.replace(/"/g, '') || '';
    const lastName = profileLine[lastNameIndex]?.replace(/"/g, '') || '';
    const title = titleIndex > -1 ? profileLine[titleIndex]?.replace(/"/g, '') : '';
    const about = summaryIndex > -1 ? profileLine[summaryIndex]?.replace(/"/g, '') : '';
    
    return {
      name: `${firstName} ${lastName}`.trim(),
      title: title || 'Professional',
      about: about || '',
      experience: [],
      education: [],
      skills: [],
      source: 'linkedin-csv-export'
    };
  } catch (error) {
    console.error('Error processing LinkedIn CSV:', error);
    throw new Error('Could not parse LinkedIn CSV data');
  }
}