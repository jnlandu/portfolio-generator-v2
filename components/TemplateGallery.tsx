'use client'

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Filter, Search, Tag } from 'lucide-react';

// Template categories
const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'developer', name: 'Developer' },
  { id: 'designer', name: 'Designer' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'business', name: 'Business' },
  { id: 'creative', name: 'Creative' },
  { id: 'academic', name: 'Academic' },
  { id: 'minimal', name: 'Minimal' },
];

// Template data
const templates = [
  {
    id: 'dev-modern',
    name: 'Modern Developer',
    description: 'Clean, code-focused layout with GitHub stats and project showcases',
    image: '/templates/dev-modern.jpg',
    categories: ['developer', 'minimal'],
    popular: true
  },
  {
    id: 'dev-tech',
    name: 'Tech Stack',
    description: 'Highlight your technical skills with interactive elements',
    image: '/templates/dev-tech.jpg',
    categories: ['developer'],
    popular: false
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Showcase',
    description: 'Visual-focused layout perfect for designers and artists',
    image: '/templates/creative-portfolio.jpg',
    categories: ['designer', 'creative'],
    popular: true
  },
  {
    id: 'business-professional',
    name: 'Professional Business',
    description: 'Polished design for executives and business professionals',
    image: '/templates/business-professional.jpg',
    categories: ['business'],
    popular: true
  },
  {
    id: 'marketing-impact',
    name: 'Marketing Impact',
    description: 'Highlight campaigns and results with persuasive layout',
    image: '/templates/marketing-impact.jpg',
    categories: ['marketing'],
    popular: false
  },
  {
    id: 'academic-research',
    name: 'Academic Profile',
    description: 'Showcase publications, research and academic achievements',
    image: '/templates/academic-research.jpg',
    categories: ['academic'],
    popular: false
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Distraction-free design focused on content and readability',
    image: '/templates/minimal-clean.jpg',
    categories: ['minimal'],
    popular: true
  },
  {
    id: 'creative-agency',
    name: 'Agency Portfolio',
    description: 'Bold design for creative professionals with case studies',
    image: '/templates/creative-agency.jpg',
    categories: ['creative', 'designer'],
    popular: false
  },
  {
    id: 'startup-founder',
    name: 'Founder Profile',
    description: 'Highlight ventures, achievements and vision',
    image: '/templates/startup-founder.jpg', 
    categories: ['business'],
    popular: false
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Showcase your content with embedded media and categories',
    image: '/templates/content-creator.jpg',
    categories: ['creative', 'marketing'],
    popular: true
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Visualize your projects and analytical expertise',
    image: '/templates/data-scientist.jpg',
    categories: ['developer', 'academic'],
    popular: false
  },
  {
    id: 'consulting',
    name: 'Consultant Profile',
    description: 'Professional template focused on services and testimonials',
    image: '/templates/consulting.jpg',
    categories: ['business'],
    popular: true
  },
];

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}

export default function TemplateGallery({ onSelectTemplate, selectedTemplateId }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter templates based on category and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.categories.includes(activeCategory);
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
          
          <div className="relative w-full sm:w-auto">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`ml-2 p-2 rounded-lg border ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-gray-300 text-gray-600'}`}
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Category filters */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-indigo-100 text-indigo-800 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div 
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-md ${
                selectedTemplateId === template.id 
                  ? 'border-indigo-500 ring-2 ring-indigo-200' 
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Selected indicator */}
                {selectedTemplateId === template.id && (
                  <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <CheckCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                )}
                
                {/* Popular badge */}
                {template.popular && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {template.categories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    return (
                      <span key={categoryId} className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        <Tag className="mr-1 h-3 w-3" />
                        {category?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found matching your criteria.</p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}