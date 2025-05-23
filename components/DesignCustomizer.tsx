import { useState } from 'react';
import { Palette, Type, Layout, Grid, Check, X } from 'lucide-react';

// Template definitions with previews, industry focus, and default settings
const portfolioTemplates = [
  {
    id: 'minimal',
    name: 'Minimal',
    industry: 'general',
    preview: '/templates/minimal.png',
    description: 'Clean, simple design with focus on content',
    defaultTheme: 'light',
    defaultFont: 'inter-roboto',
    defaultLayout: 'centered'
  },
  {
    id: 'developer',
    name: 'Developer',
    industry: 'tech',
    preview: '/templates/developer.png',
    description: 'Technical focus with code snippets and project showcase',
    defaultTheme: 'dark',
    defaultFont: 'fira-open',
    defaultLayout: 'sidebar'
  },
  {
    id: 'creative',
    name: 'Creative',
    industry: 'design',
    preview: '/templates/creative.png',
    description: 'Visual portfolio with emphasis on images and design work',
    defaultTheme: 'vibrant',
    defaultFont: 'playfair-lato',
    defaultLayout: 'grid'
  },
  {
    id: 'executive',
    name: 'Executive',
    industry: 'business',
    preview: '/templates/executive.png',
    description: 'Professional and polished for business executives',
    defaultTheme: 'corporate',
    defaultFont: 'montserrat-garamond',
    defaultLayout: 'traditional'
  },
  {
    id: 'academic',
    name: 'Academic',
    industry: 'education',
    preview: '/templates/academic.png',
    description: 'Structured format ideal for researchers and educators',
    defaultTheme: 'light',
    defaultFont: 'merriweather-source',
    defaultLayout: 'structured'
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    industry: 'freelance',
    preview: '/templates/freelancer.png',
    description: 'Dynamic layout highlighting services and testimonials',
    defaultTheme: 'bright',
    defaultFont: 'poppins-nunito',
    defaultLayout: 'cards'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    industry: 'marketing',
    preview: '/templates/marketing.png',
    description: 'Engaging design with focus on results and campaigns',
    defaultTheme: 'gradient',
    defaultFont: 'raleway-work',
    defaultLayout: 'modern'
  },
  {
    id: 'medical',
    name: 'Medical',
    industry: 'healthcare',
    preview: '/templates/medical.png',
    description: 'Professional layout for healthcare practitioners',
    defaultTheme: 'medical',
    defaultFont: 'source-roboto',
    defaultLayout: 'structured'
  },
  // More templates...
];

// Color themes with primary, secondary, and accent colors
const colorThemes = [
  { 
    id: 'light', 
    name: 'Professional Light',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6', 
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937'
    }
  },
  { 
    id: 'dark', 
    name: 'Developer Dark',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5', 
      accent: '#a855f7',
      background: '#111827',
      text: '#f9fafb'
    }
  },
  { 
    id: 'corporate', 
    name: 'Corporate Blue',
    colors: {
      primary: '#0f4c81',
      secondary: '#0c7489', 
      accent: '#c1c8e4',
      background: '#f8fafc',
      text: '#1e293b'
    }
  },
  { 
    id: 'vibrant', 
    name: 'Creative Vibrant',
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899', 
      accent: '#fb7185',
      background: '#f5f3ff',
      text: '#18181b'
    }
  },
  { 
    id: 'gradient', 
    name: 'Modern Gradient',
    colors: {
      primary: '#6d28d9',
      secondary: '#4f46e5', 
      accent: '#8b5cf6',
      background: 'linear-gradient(to right, #f9f9f9, #f0f9ff)',
      text: '#1e293b'
    }
  },
  { 
    id: 'bright', 
    name: 'Bright Accent',
    colors: {
      primary: '#0369a1',
      secondary: '#0284c7', 
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#0f172a'
    }
  },
  { 
    id: 'medical', 
    name: 'Healthcare',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4', 
      accent: '#22d3ee',
      background: '#f0fdfa',
      text: '#134e4a'
    }
  },
  // More color themes...
];

// Font pairings with title and body fonts
const fontPairings = [
  {
    id: 'inter-roboto',
    name: 'Modern Clean',
    title: 'Inter',
    body: 'Roboto',
    fallback: 'sans-serif',
    cssImport: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500&display=swap'
  },
  {
    id: 'playfair-lato',
    name: 'Classic Creative',
    title: 'Playfair Display',
    body: 'Lato',
    fallback: 'serif, sans-serif',
    cssImport: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap'
  },
  {
    id: 'montserrat-garamond',
    name: 'Executive Style',
    title: 'Montserrat',
    body: 'EB Garamond',
    fallback: 'sans-serif, serif',
    cssImport: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600&display=swap'
  },
  {
    id: 'poppins-nunito',
    name: 'Friendly Professional',
    title: 'Poppins',
    body: 'Nunito',
    fallback: 'sans-serif',
    cssImport: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Nunito:wght@300;400;600&display=swap'
  },
  {
    id: 'fira-open',
    name: 'Developer Focus',
    title: 'Fira Sans',
    body: 'Open Sans',
    fallback: 'sans-serif',
    cssImport: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700&family=Open+Sans:wght@300;400;600&display=swap'
  },
  {
    id: 'merriweather-source',
    name: 'Academic',
    title: 'Merriweather',
    body: 'Source Sans Pro',
    fallback: 'serif, sans-serif',
    cssImport: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap'
  },
  {
    id: 'raleway-work',
    name: 'Modern Marketing',
    title: 'Raleway',
    body: 'Work Sans',
    fallback: 'sans-serif',
    cssImport: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Work+Sans:wght@300;400;500&display=swap'
  },
  // More font pairings...
];

// Layout options for portfolio structure
const layoutOptions = [
  {
    id: 'centered',
    name: 'Centered Focus',
    description: 'Clean centered layout with focus on content',
    icon: 'layout-centered'
  },
  {
    id: 'sidebar',
    name: 'Sidebar Navigation',
    description: 'Left sidebar with main content on right',
    icon: 'layout-sidebar'
  },
  {
    id: 'grid',
    name: 'Project Grid',
    description: 'Grid-based layout highlighting projects and work',
    icon: 'layout-grid'
  },
  {
    id: 'cards',
    name: 'Card Sections',
    description: 'Content arranged in distinct card sections',
    icon: 'layout-cards'
  },
  {
    id: 'traditional',
    name: 'Traditional CV',
    description: 'Classic resume/CV style layout',
    icon: 'layout-list'
  },
  {
    id: 'modern',
    name: 'Modern Split',
    description: 'Contemporary split-screen sections',
    icon: 'layout-split'
  },
  {
    id: 'structured',
    name: 'Structured Sections',
    description: 'Clear section divisions with consistent styling',
    icon: 'layout-structured'
  },
  // More layout options...
];

interface DesignCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyChanges: (changes: DesignChanges) => void;
  currentSettings?: {
    template: string;
    colorTheme: string;
    fontPairing: string;
    layout: string;
  };
}

export interface DesignChanges {
  template: string;
  colorTheme: string;
  fontPairing: string;
  layout: string;
}

export default function DesignCustomizer({ 
  isOpen, 
  onClose, 
  onApplyChanges, 
  currentSettings 
}: DesignCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'colors' | 'fonts' | 'layouts'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(currentSettings?.template || 'minimal');
  const [selectedColorTheme, setSelectedColorTheme] = useState(currentSettings?.colorTheme || 'light');
  const [selectedFontPairing, setSelectedFontPairing] = useState(currentSettings?.fontPairing || 'inter-roboto');
  const [selectedLayout, setSelectedLayout] = useState(currentSettings?.layout || 'centered');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'tech', name: 'Technology' },
    { id: 'design', name: 'Design & Creative' },
    { id: 'business', name: 'Business' },
    { id: 'freelance', name: 'Freelance' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'education', name: 'Academic & Education' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'general', name: 'General Purpose' },
  ];

  const filteredTemplates = filterIndustry === 'all' 
    ? portfolioTemplates 
    : portfolioTemplates.filter(t => t.industry === filterIndustry);

  const handleSaveChanges = () => {
    onApplyChanges({
      template: selectedTemplate,
      colorTheme: selectedColorTheme,
      fontPairing: selectedFontPairing,
      layout: selectedLayout
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Customize Your Portfolio Design</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'templates' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('templates')}
          >
            <Grid className="h-4 w-4" />
            Templates
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'colors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('colors')}
          >
            <Palette className="h-4 w-4" />
            Colors
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'fonts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('fonts')}
          >
            <Type className="h-4 w-4" />
            Fonts
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'layouts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('layouts')}
          >
            <Layout className="h-4 w-4" />
            Layouts
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Templates tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Choose a Template</h3>
                <div className="relative">
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {industries.map(industry => (
                      <option key={industry.id} value={industry.id}>{industry.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <div 
                    key={template.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedTemplate === template.id ? 'ring-2 ring-indigo-600 shadow-md' : 'hover:shadow-md'}`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative">
                      {/* Template preview image */}
                      <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <img 
                          src={template.preview || `/placeholders/template-${template.id}.svg`} 
                          alt={template.name} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Fallback for missing images
                            e.currentTarget.src = '/placeholders/template-default.svg';
                          }}
                        />
                      </div>
                      
                      {/* Selected indicator */}
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {industries.find(i => i.id === template.industry)?.name || template.industry}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colors tab */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Select a Color Theme</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {colorThemes.map(theme => (
                  <div 
                    key={theme.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${selectedColorTheme === theme.id ? 'ring-2 ring-indigo-600 shadow-md' : 'hover:shadow-md'}`}
                    onClick={() => setSelectedColorTheme(theme.id)}
                  >
                    <div className="h-20 w-full flex">
                      <div className="w-1/3" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div className="w-1/3" style={{ backgroundColor: theme.colors.secondary }}></div>
                      <div className="w-1/3" style={{ backgroundColor: theme.colors.accent }}></div>
                    </div>
                    <div className="p-4" style={{ 
                      background: typeof theme.colors.background === 'string' && theme.colors.background.includes('gradient') 
                        ? theme.colors.background 
                        : theme.colors.background,
                      color: theme.colors.text
                    }}>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{theme.name}</h4>
                        {selectedColorTheme === theme.id && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-5 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">Preview with Selected Colors</h4>
                <div className="bg-white rounded-md p-4 shadow-sm" style={{ 
                  backgroundColor: colorThemes.find(t => t.id === selectedColorTheme)?.colors.background,
                  color: colorThemes.find(t => t.id === selectedColorTheme)?.colors.text
                }}>
                  <h2 style={{ color: colorThemes.find(t => t.id === selectedColorTheme)?.colors.primary }}>
                    This is how your headings will look
                  </h2>
                  <p className="my-2">This is how your regular text content will appear on your portfolio.</p>
                  <button className="px-4 py-2 rounded-md text-white" style={{ 
                    backgroundColor: colorThemes.find(t => t.id === selectedColorTheme)?.colors.secondary 
                  }}>
                    Sample Button
                  </button>
                  <div className="mt-2">
                    <a href="#" style={{ color: colorThemes.find(t => t.id === selectedColorTheme)?.colors.accent }}>
                      Sample Link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fonts tab */}
          {activeTab === 'fonts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Choose Font Pairing</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {fontPairings.map(font => (
                  <div 
                    key={font.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer p-5 transition-all ${selectedFontPairing === font.id ? 'ring-2 ring-indigo-600 shadow-md' : 'hover:shadow-md'}`}
                    onClick={() => setSelectedFontPairing(font.id)}
                    style={{ 
                      // Add the font style dynamically 
                      fontFamily: font.body
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">{font.name}</h4>
                      {selectedFontPairing === font.id && (
                        <Check className="h-4 w-4 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-xl font-semibold mb-2" style={{ fontFamily: font.title }}>
                        This is a heading in {font.title}
                      </h5>
                      <p className="text-gray-700" style={{ fontFamily: font.body }}>
                        This is body text using {font.body}. This demonstrates how paragraphs will look on your portfolio website.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                      <div><span className="font-semibold">Heading:</span> {font.title}</div>
                      <div><span className="font-semibold">Body:</span> {font.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layouts tab */}
          {activeTab === 'layouts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Choose Layout Style</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {layoutOptions.map(layout => (
                  <div 
                    key={layout.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${selectedLayout === layout.id ? 'ring-2 ring-indigo-600 shadow-md' : 'hover:shadow-md'}`}
                    onClick={() => setSelectedLayout(layout.id)}
                  >
                    <div className="aspect-w-16 aspect-h-10 p-4 bg-gray-50 flex items-center justify-center">
                      {/* Layout diagram SVG */}
                      <div className="w-full h-full flex items-center justify-center">
                        {layout.icon === 'layout-centered' && (
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="5" width="80" height="10" fill="#d1d5db" />
                            <rect x="25" y="20" width="50" height="35" fill="#93c5fd" />
                          </svg>
                        )}
                        {layout.icon === 'layout-sidebar' && (
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="5" width="80" height="50" fill="#d1d5db" />
                            <rect x="10" y="5" width="20" height="50" fill="#93c5fd" />
                            <rect x="35" y="10" width="50" height="40" fill="#e5e7eb" />
                          </svg>
                        )}
                        {layout.icon === 'layout-grid' && (
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="5" width="80" height="10" fill="#d1d5db" />
                            <rect x="10" y="20" width="25" height="15" fill="#93c5fd" />
                            <rect x="40" y="20" width="25" height="15" fill="#93c5fd" />
                            <rect x="70" y="20" width="25" height="15" fill="#93c5fd" />
                            <rect x="10" y="40" width="25" height="15" fill="#93c5fd" />
                            <rect x="40" y="40" width="25" height="15" fill="#93c5fd" />
                            <rect x="70" y="40" width="25" height="15" fill="#93c5fd" />
                          </svg>
                        )}
                        {layout.icon === 'layout-cards' && (
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="5" width="80" height="10" fill="#d1d5db" />
                            <rect x="10" y="20" width="80" height="10" fill="#93c5fd" rx="2" />
                            <rect x="10" y="35" width="80" height="10" fill="#93c5fd" rx="2" />
                            <rect x="10" y="50" width="80" height="10" fill="#93c5fd" rx="2" />
                          </svg>
                        )}
                        {layout.icon === 'layout-list' && (
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="5" width="30" height="50" fill="#93c5fd" />
                            <rect x="45" y="5" width="45" height="10" fill="#d1d5db" />
                            <rect x="45" y="20" width="45" height="5" fill="#e5e7eb" />
                            <rect x="45" y="30" width="45" height="5" fill="#e5e7eb" />
                            <rect x="45" y="40" width="45" height="5" fill="#e5e7eb" />
                            <rect x="45" y="50" width="45" height="5" fill="#e5e7eb" />
                          </svg>
                        )}
                        {layout.icon === 'layout-split' && (
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="5" y="5" width="90" height="50" fill="#d1d5db" />
                            <rect x="5" y="5" width="45" height="50" fill="#93c5fd" />
                          </svg>
                        )}
                        {layout.icon === 'layout-structured' && (
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <rect x="10" y="5" width="80" height="10" fill="#d1d5db" />
                            <rect x="10" y="20" width="80" height="7" fill="#93c5fd" />
                            <rect x="10" y="32" width="80" height="7" fill="#93c5fd" />
                            <rect x="10" y="44" width="80" height="7" fill="#93c5fd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">{layout.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{layout.description}</p>
                        </div>
                        {selectedLayout === layout.id && (
                          <Check className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}