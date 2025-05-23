import { PenTool, Sparkles, Globe, ArrowRight, Play, Clock, Users, Star } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    name: 'Input Your Data',
    description: 'Easily paste your resume, upload a PDF, connect your LinkedIn profile, or link your GitHub account.',
    icon: PenTool,
    bgGradient: 'from-blue-500 to-indigo-600',
    glowColor: 'shadow-blue-500/25',
    features: ['Resume Upload', 'LinkedIn Sync', 'GitHub Integration']
  },
  {
    name: 'AI Magic Happens',
    description: 'Our intelligent AI analyzes your information and crafts a unique, professional portfolio design just for you.',
    icon: Sparkles,
    bgGradient: 'from-purple-500 to-pink-600',
    glowColor: 'shadow-purple-500/25',
    features: ['Smart Analysis', 'Custom Design', 'Brand Matching']
  },
  {
    name: 'Publish & Share',
    description: 'Customize further with our AI chat, then publish your stunning portfolio to the world with a click.',
    icon: Globe,
    bgGradient: 'from-emerald-500 to-teal-600',
    glowColor: 'shadow-emerald-500/25',
    features: ['One-Click Publish', 'Custom Domain', 'SEO Optimized']
  },
];

const videoTutorials = [
  {
    id: 1,
    title: 'Complete Portfolio Setup',
    description: 'Learn how to create your first AI-generated portfolio from start to finish',
    duration: '4:32',
    views: '12.5K',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&auto=format',
    isNew: true
  },
  {
    id: 2,
    title: 'LinkedIn Integration Guide',
    description: 'Connect your LinkedIn profile and import your professional data seamlessly',
    duration: '2:18',
    views: '8.3K',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop&auto=format'
  },
  {
    id: 3,
    title: 'Customization & AI Chat',
    description: 'Use our AI chat to fine-tune your portfolio design and content',
    duration: '3:45',
    views: '15.2K',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop&auto=format',
    isPopular: true
  },
  {
    id: 4,
    title: 'Publishing & Domain Setup',
    description: 'Go live with your portfolio and set up your custom domain',
    duration: '1:56',
    views: '6.7K',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop&auto=format'
  }
];

export default function HowItWorksSection() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <>
      {/* Main How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-white/90">AI-Powered Portfolio Creation</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
              From Resume to Portfolio
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Transform your career story into a stunning portfolio in minutes, not hours. Our AI does the heavy lifting while you focus on what matters.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start mb-16">
            {steps.map((step, index) => (
              <div 
                key={step.name} 
                className="relative group"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full transform -translate-x-1/2 -translate-y-1/2 w-24 z-10">
                    <div className="relative">
                      <ArrowRight className="w-8 h-8 text-white/30 mx-auto transition-colors duration-300 group-hover:text-white/60" />
                      <div className="absolute inset-0 animate-pulse">
                        <ArrowRight className="w-8 h-8 text-purple-400/50 mx-auto" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step Card */}
                <div className={`relative p-8 rounded-3xl border border-white/10 backdrop-blur-sm transition-all duration-500 transform ${
                  hoveredStep === index 
                    ? 'bg-white/10 scale-105 -translate-y-2' 
                    : 'bg-white/5 hover:bg-white/8'
                } ${step.glowColor} shadow-2xl`}>
                  
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-r ${step.bgGradient} mb-6 shadow-lg ${step.glowColor} transition-transform duration-300 ${
                    hoveredStep === index ? 'scale-110 rotate-3' : ''
                  }`}>
                    <step.icon className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                    {step.name}
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-white/60 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button className="group relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Start Creating Your Portfolio</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
              <Play className="w-4 h-4 mr-2" />
              Video Tutorials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Learn by Watching
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master PortfolioAI with our step-by-step video guides. From basic setup to advanced customization.
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {videoTutorials.map((video) => (
              <div 
                key={video.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50"></div>
                  
                  {/* Play Button */}
                  <button 
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={() => setActiveVideo(video.id)}
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:bg-white group-hover:scale-110">
                      <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
                    </div>
                  </button>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {video.isNew && (
                      <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
                        New
                      </span>
                    )}
                    {video.isPopular && (
                      <span className="px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/70 text-white text-sm font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-4">
                    {video.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {video.views} views
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">
              Ready to create your AI-powered portfolio?
            </p>
            <button className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}