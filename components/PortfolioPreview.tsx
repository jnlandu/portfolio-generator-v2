import { useState, useRef } from 'react';
import { Tablet, Smartphone, Monitor, Code, Eye, Copy, ExternalLink } from 'lucide-react';

export default function PortfolioPreview({ code }: { code: string }) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const codeRef = useRef<HTMLPreElement>(null);
  
  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };
  
  const deviceWidth = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto',
    mobile: 'max-w-[375px] mx-auto'
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-800">Portfolio Preview</h2>
        
        <div className="flex items-center gap-2">
          {viewMode === 'preview' && (
            <div className="flex items-center bg-gray-100 p-1 rounded-md mr-2">
              <button
                className={`p-1.5 rounded-md ${deviceView === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                onClick={() => setDeviceView('desktop')}
                title="Desktop view"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                className={`p-1.5 rounded-md ${deviceView === 'tablet' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                onClick={() => setDeviceView('tablet')}
                title="Tablet view"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                className={`p-1.5 rounded-md ${deviceView === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                onClick={() => setDeviceView('mobile')}
                title="Mobile view"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <div className="flex rounded-md overflow-hidden border border-gray-200">
            <button
              className={`px-3 py-1.5 flex items-center text-sm font-medium ${
                viewMode === 'preview' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('preview')}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </button>
            <button
              className={`px-3 py-1.5 flex items-center text-sm font-medium ${
                viewMode === 'code' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('code')}
            >
              <Code className="h-3.5 w-3.5 mr-1.5" />
              Code
            </button>
          </div>
        </div>
      </div>
      
      {code ? (
        viewMode === 'preview' ? (
          <div className="relative border-t border-gray-100 bg-gray-50">
            <div className="h-[calc(100vh-320px)] min-h-[400px] overflow-auto p-4">
              <div className={`${deviceWidth[deviceView]} transition-all duration-300 bg-white rounded shadow overflow-hidden`}>
                <iframe 
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                          body { margin: 0; }
                        </style>
                      </head>
                      <body>${code}</body>
                    </html>
                  `}
                  title="Portfolio Preview"
                  className="w-full h-[calc(100vh-320px)] min-h-[400px] border-0"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute right-4 top-4 z-10 flex space-x-2">
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-white rounded-md shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a 
                href={`data:text/html;charset=utf-8,${encodeURIComponent(code)}`}
                download="portfolio.html"
                className="p-2 bg-white rounded-md shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <pre 
              ref={codeRef}
              className="bg-gray-900 text-gray-50 py-4 px-6 rounded-none overflow-auto h-[calc(100vh-320px)] min-h-[400px] text-sm font-mono"
            >
              {code}
            </pre>
          </div>
        )
      ) : (
        <div className="border-t border-gray-100 h-[calc(100vh-320px)] min-h-[400px] flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center max-w-md">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Preview Available</h3>
            <p className="text-gray-500 mb-6">Your portfolio preview will appear here after generation. Enter your details and click "Generate" to create your portfolio.</p>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-0 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}