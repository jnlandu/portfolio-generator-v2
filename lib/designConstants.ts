
// Color themes with primary, secondary, and accent colors
export const colorThemes = [
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
  }
];

// Font pairings with title and body fonts
export const fontPairings = [
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
  }
];
