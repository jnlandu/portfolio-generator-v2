'use client'

import { useState } from 'react';
import { Check, ChevronDown, Layout, Palette, Type } from 'lucide-react';
import { colorThemes, fontPairings, layoutOptions } from '@/lib/designConstants';

export interface DesignChanges {
  colorTheme: string;
  fontPairing: string;
  layout: string;
}

interface DesignCustomizerProps {
  onChange: (changes: DesignChanges) => void;
  currentDesign: DesignChanges;
}

export default function DesignCustomizer({ onChange, currentDesign }: DesignCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (themeId: string) => {
    onChange({
      ...currentDesign,
      colorTheme: themeId
    });
  };

  const handleFontChange = (fontId: string) => {
    onChange({
      ...currentDesign,
      fontPairing: fontId
    });
  };

  const handleLayoutChange = (layoutId: string) => {
    onChange({
      ...currentDesign,
      layout: layoutId
    });
  };

  // Find current theme, font and layout
  const currentTheme = colorThemes.find(theme => theme.id === currentDesign.colorTheme) || colorThemes[0];
  const currentFont = fontPairings.find(font => font.id === currentDesign.fontPairing) || fontPairings[0];
  const currentLayout = layoutOptions.find(layout => layout.id === currentDesign.layout) || layoutOptions[0];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-gray-900">Design Customization</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {isOpen ? 'Hide Options' : 'Show Options'} 
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
      </div>
      
      {isOpen && (
        <>
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'colors' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Palette className="h-4 w-4" />
                Colors
              </button>
              <button
                onClick={() => setActiveTab('fonts')}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'fonts' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Type className="h-4 w-4" />
                Typography
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'layout' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layout className="h-4 w-4" />
                Layout
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Color Theme Selection */}
            {activeTab === 'colors' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Choose a color theme for your portfolio:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {colorThemes.map((theme) => (
                    <div 
                      key={theme.id}
                      onClick={() => handleColorChange(theme.id)}
                      className={`cursor-pointer rounded-lg p-4 transition-all hover:shadow-md ${
                        currentDesign.colorTheme === theme.id 
                          ? 'ring-2 ring-indigo-500 shadow-sm' 
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <div className="flex space-x-1 mb-3">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{theme.name}</p>
                        {currentDesign.colorTheme === theme.id && (
                          <Check className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Selected Theme: {currentTheme.name}</h3>
                  <div className="flex gap-4">
                    <div>
                      <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: currentTheme.primary }}></div>
                      <p className="text-xs text-gray-500 mt-1">Primary</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: currentTheme.secondary }}></div>
                      <p className="text-xs text-gray-500 mt-1">Secondary</p>
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: currentTheme.accent }}></div>
                      <p className="text-xs text-gray-500 mt-1">Accent</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Font Selection */}
            {activeTab === 'fonts' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Choose a font pairing for your portfolio:</p>
                
                <div className="space-y-3">
                  {fontPairings.map((font) => (
                    <div 
                      key={font.id}
                      onClick={() => handleFontChange(font.id)}
                      className={`cursor-pointer rounded-lg p-4 transition-all hover:shadow-md ${
                        currentDesign.fontPairing === font.id 
                          ? 'ring-2 ring-indigo-500 shadow-sm' 
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-lg font-bold ${font.headingClass}`}>{font.name}</h3>
                          <p className={`text-sm text-gray-600 ${font.bodyClass}`}>
                            This is how your body text will appear using {font.bodyName}.
                          </p>
                        </div>
                        {currentDesign.fontPairing === font.id && (
                          <Check className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Selected Typography: {currentFont.name}</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Headings: <span className="font-medium">{currentFont.headingName}</span></p>
                    <p className="text-sm text-gray-600">Body: <span className="font-medium">{currentFont.bodyName}</span></p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Layout Selection */}
            {activeTab === 'layout' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Choose a layout structure for your portfolio:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {layoutOptions.map((layout) => (
                    <div 
                      key={layout.id}
                      onClick={() => handleLayoutChange(layout.id)}
                      className={`cursor-pointer rounded-lg overflow-hidden transition-all hover:shadow-md ${
                        currentDesign.layout === layout.id 
                          ? 'ring-2 ring-indigo-500 shadow-sm' 
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <div className="relative aspect-video bg-gray-100">
                        <div className="absolute inset-0 p-2">
                          <div className={`h-full w-full border border-dashed border-gray-300 ${layout.previewClass}`}>
                            {layout.sections.map((section, index) => (
                              <div 
                                key={index}
                                className="bg-indigo-200/60 border border-indigo-300/50 rounded"
                                style={{ 
                                  width: section.width, 
                                  height: section.height,
                                  margin: section.margin
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                        
                        {currentDesign.layout === layout.id && (
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                            <Check className="h-4 w-4 text-indigo-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">{layout.name}</p>
                          <span className="text-xs text-gray-500">{layout.sections.length} sections</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Selected Layout: {currentLayout.name}</h3>
                  <p className="text-sm text-gray-600">{currentLayout.description}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}