// Color themes
export const colorThemes = [
  {
    id: 'indigo',
    name: 'Professional Indigo',
    primary: '#4F46E5',
    secondary: '#818CF8',
    accent: '#C7D2FE',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'emerald',
    name: 'Fresh Emerald',
    primary: '#059669',
    secondary: '#34D399',
    accent: '#A7F3D0',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'rose',
    name: 'Creative Rose',
    primary: '#E11D48',
    secondary: '#FB7185',
    accent: '#FECDD3',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    primary: '#D97706',
    secondary: '#FBBF24',
    accent: '#FDE68A',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'slate',
    name: 'Corporate Slate',
    primary: '#334155',
    secondary: '#64748B',
    accent: '#CBD5E1',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'purple',
    name: 'Creative Purple',
    primary: '#7E22CE',
    secondary: '#A855F7',
    accent: '#E9D5FF',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'teal',
    name: 'Calm Teal',
    primary: '#0D9488',
    secondary: '#2DD4BF',
    accent: '#99F6E4',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'blue',
    name: 'Trustworthy Blue',
    primary: '#0369A1',
    secondary: '#38BDF8',
    accent: '#BAE6FD',
    text: '#1E293B',
    background: '#FFFFFF'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    primary: '#6366F1',
    secondary: '#A5B4FC',
    accent: '#818CF8',
    text: '#E2E8F0',
    background: '#1E293B'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#18181B',
    secondary: '#52525B',
    accent: '#D4D4D8',
    text: '#18181B',
    background: '#FFFFFF'
  }
];

// Font pairings
export const fontPairings = [
  {
    id: 'inter',
    name: 'Modern Sans',
    headingName: 'Inter',
    bodyName: 'Inter',
    headingClass: 'font-sans',
    bodyClass: 'font-sans'
  },
  {
    id: 'serif',
    name: 'Classic Serif',
    headingName: 'Merriweather',
    bodyName: 'Georgia',
    headingClass: 'font-serif',
    bodyClass: 'font-serif'
  },
  {
    id: 'display',
    name: 'Bold Display',
    headingName: 'Montserrat',
    bodyName: 'Roboto',
    headingClass: 'font-display',
    bodyClass: 'font-sans'
  },
  {
    id: 'mono',
    name: 'Developer Mono',
    headingName: 'JetBrains Mono',
    bodyName: 'JetBrains Mono',
    headingClass: 'font-mono',
    bodyClass: 'font-mono'
  },
  {
    id: 'playful',
    name: 'Creative Mix',
    headingName: 'Poppins',
    bodyName: 'Work Sans',
    headingClass: 'font-display',
    bodyClass: 'font-sans'
  },
  {
    id: 'elegant',
    name: 'Elegant Contrast',
    headingName: 'Playfair Display',
    bodyName: 'Source Sans Pro',
    headingClass: 'font-serif',
    bodyClass: 'font-sans'
  },
];

// Layout options
export const layoutOptions = [
  {
    id: 'classic',
    name: 'Classic Full Width',
    description: 'Traditional full-width layout with sections stacked vertically',
    previewClass: 'flex flex-col items-center justify-start gap-1',
    sections: [
      { width: '100%', height: '20%', margin: '0 0 1% 0' },
      { width: '100%', height: '30%', margin: '0 0 1% 0' },
      { width: '100%', height: '20%', margin: '0 0 1% 0' },
      { width: '100%', height: '25%', margin: '0' }
    ]
  },
  {
    id: 'sidebar',
    name: 'Left Sidebar',
    description: 'Fixed sidebar with main content on the right',
    previewClass: 'flex flex-row',
    sections: [
      { width: '30%', height: '100%', margin: '0 1% 0 0' },
      { width: '69%', height: '100%', margin: '0' }
    ]
  },
  {
    id: 'grid',
    name: 'Portfolio Grid',
    description: 'Grid-based layout ideal for showcasing visual projects',
    previewClass: 'grid grid-cols-2 gap-1',
    sections: [
      { width: '100%', height: '47%', margin: '0' },
      { width: '100%', height: '47%', margin: '0' },
      { width: '100%', height: '47%', margin: '0' },
      { width: '100%', height: '47%', margin: '0' }
    ]
  },
  {
    id: 'hero',
    name: 'Hero Banner',
    description: 'Large hero section with content blocks below',
    previewClass: 'flex flex-col items-center',
    sections: [
      { width: '100%', height: '40%', margin: '0 0 1% 0' },
      { width: '100%', height: '29%', margin: '0 0 1% 0' },
      { width: '100%', height: '29%', margin: '0' }
    ]
  },
  {
    id: 'asymmetrical',
    name: 'Asymmetrical',
    description: 'Modern asymmetrical layout with varied section widths',
    previewClass: 'flex flex-col',
    sections: [
      { width: '100%', height: '25%', margin: '0 0 1% 0' },
      { width: '70%', height: '35%', margin: '0 0 1% 0' },
      { width: '85%', height: '35%', margin: '0 0 1% 15%' }
    ]
  },
  {
    id: 'magazine',
    name: 'Magazine Style',
    description: 'Editorial-inspired layout with multiple columns',
    previewClass: 'flex flex-col',
    sections: [
      { width: '100%', height: '25%', margin: '0 0 1% 0' },
      { width: '100%', height: '73%', margin: '0', className: 'grid grid-cols-3 gap-1' }
    ]
  }
];