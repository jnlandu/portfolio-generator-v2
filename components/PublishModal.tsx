import { useState } from 'react';
import { Globe, X, Check, Loader2, Copy } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: any) => Promise<any>;
  portfolioData: any;
}

export default function PublishModal({ isOpen, onClose, onPublish, portfolioData }: PublishModalProps) {
  const [formData, setFormData] = useState({
    title: portfolioData?.name ? `${portfolioData.name}'s Portfolio` : "My Portfolio",
    slug: createSlug(portfolioData?.name || "my-portfolio"),
    visibility: "public",
    domain: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  function createSlug(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')         // Trim - from start of text
      .replace(/-+$/, '');        // Trim - from end of text
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "title" && !formData.domain) {
      setFormData(prev => ({ ...prev, slug: createSlug(value) }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await onPublish(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Failed to publish portfolio");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Publish Your Portfolio</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {success ? (
          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Successfully Published!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your portfolio is now live and accessible online.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center">
                <Globe className="h-5 w-5 text-indigo-600 mr-3" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {`https://portfolioai.com/${formData.slug}`}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://portfolioai.com/${formData.slug}`)}
                  className="ml-2 p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              
              {formData.domain && (
                <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                  <Globe className="h-5 w-5 text-indigo-600 mr-3" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {`https://${formData.domain}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Domain setup in progress (24-48 hours)
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  portfolioai.com/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="public">Public - Visible to everyone</option>
                <option value="unlisted">Unlisted - Only accessible with the link</option>
                <option value="private">Private - Only visible to you</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Domain (Optional)
              </label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="yourdomain.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                If you own a domain, you can connect it to your portfolio
              </p>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Publishing...
                  </>
                ) : (
                  <>Publish Portfolio</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}