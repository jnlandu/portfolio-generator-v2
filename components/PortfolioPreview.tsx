import { useState } from 'react';

export default function PortfolioPreview({ code }) {
  const [viewMode, setViewMode] = useState('preview');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Portfolio Preview</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${viewMode === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('preview')}
          >
            Preview
          </button>
          <button
            className={`px-3 py-1 rounded ${viewMode === 'code' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('code')}
          >
            Code
          </button>
        </div>
      </div>
      
      {code ? (
        viewMode === 'preview' ? (
          <div className="border rounded p-2 h-96 overflow-auto bg-white">
            <div dangerouslySetInnerHTML={{ __html: code }} />
          </div>
        ) : (
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto h-96 text-sm">
            {code}
          </pre>
        )
      ) : (
        <div className="border rounded p-4 h-96 flex items-center justify-center bg-gray-50 text-gray-400">
          Your portfolio preview will appear here after generation
        </div>
      )}
    </div>
  );
}