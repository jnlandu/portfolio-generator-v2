'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TemplateGallery from '@/components/TemplateGallery';
import DesignCustomizer from '@/components/DesignCustomizer';
import { ArrowRight } from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>();
  const [designOptions, setDesignOptions] = useState({
    colorTheme: 'indigo',
    fontPairing: 'inter',
    layout: 'classic'
  });

  const handleContinue = () => {
    if (selectedTemplate) {
      // In a real implementation, store template and design choices in state management or URL params
      router.push(`/create-portfolio?template=${selectedTemplate}&theme=${designOptions.colorTheme}&font=${designOptions.fontPairing}&layout=${designOptions.layout}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Portfolio Template</h1>
          <p className="text-gray-600">Select a professional template and customize it to match your style</p>
        </div>
        
        <div className="space-y-8">
          <TemplateGallery 
            onSelectTemplate={setSelectedTemplate}
            selectedTemplateId={selectedTemplate}
          />
          
          {selectedTemplate && (
            <>
              <DesignCustomizer 
                onChange={setDesignOptions}
                currentDesign={designOptions}
              />
              
              <div className="flex justify-center">
                <button
                  onClick={handleContinue}
                  disabled={!selectedTemplate}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Editor
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}