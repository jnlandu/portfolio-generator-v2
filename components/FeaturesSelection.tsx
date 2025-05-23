import { UploadCloud, Linkedin, Github, Bot, Palette, Smartphone, Globe, Star, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    name: 'Multiple Data Sources',
    description: 'Generate your portfolio from resume text, PDF uploads, LinkedIn profiles, or GitHub accounts.',
    icon: UploadCloud,
    gradient: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/25',
    hoverGlow: 'group-hover:shadow-blue-500/40',
    category: 'Input',
    benefits: ['Resume Upload', 'LinkedIn Sync', 'GitHub Integration', 'PDF Processing']
  },
  {
    name: 'AI-Powered Generation',
    description: 'Our advanced AI intelligently structures and designs a professional portfolio tailored to you.',
    icon: Bot,
    gradient: 'from-purple-500 to-indigo-500',
    glowColor: 'shadow-purple-500/25',
    hoverGlow: 'group-hover:shadow-purple-500/40',
    category: 'AI',
    benefits: ['Smart Analysis', 'Auto Layout', 'Content Optimization', 'Brand Matching']
  },
  {
    name: 'Live AI Customization',
    description: 'Refine your design, content, and layout in real-time with our intuitive AI chat assistant.',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    glowColor: 'shadow-pink-500/25',
    hoverGlow: 'group-hover:shadow-pink-500/40',
    category: 'Customization',
    benefits: ['Real-time Editing', 'AI Chat', 'Design Suggestions', 'Content Refinement']
  },
  {
    name: 'Responsive Designs',
    description: 'All generated portfolios look great on desktops, tablets, and smartphones automatically.',
    icon: Smartphone,
    gradient: 'from-emerald-500 to-teal-500',
    glowColor: 'shadow-emerald-500/25',
    hoverGlow: 'group-hover:shadow-emerald-500/40',
    category: 'Design',
    benefits: ['Mobile First', 'Cross-Device', 'Fast Loading', 'SEO Optimized']
  },
  {
    name: 'Easy Publishing',
    description: 'Publish your portfolio with a few clicks. Custom domain support for premium users.',
    icon: Globe,
    gradient: 'from-orange-500 to-red-500',
    glowColor: 'shadow-orange-500/25',
    hoverGlow: 'group-hover:shadow-orange-500/40',
    category: 'Publishing',
    benefits: ['One-Click Deploy', 'Custom Domains', 'SSL Included', 'CDN Powered']
  },
  {
    name: 'Developer Focused',
    description: 'Showcase your GitHub projects, contributions, languages, and stats seamlessly.',
    icon: Github,
    gradient: 'from-slate-500 to-gray-600',
    glowColor: 'shadow-slate-500/25',
    hoverGlow: 'group-hover:shadow-slate-500/40',
    category: 'Development',
    benefits: ['GitHub Stats', 'Project Showcase', 'Language Charts', 'Contribution Graph']
  }
];

const stats = [
  { number: '10K+', label: 'Portfolios Created' },
  { number: '95%', label: 'User Satisfaction' },
  { number: '2min', label: 'Average Setup Time' },
  { number: '24/7', label: 'AI Availability' }
];

export default function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'Input', 'AI', 'Design', 'Publishing'];
  const filteredFeatures = activeTab === 'all' ? features : features.filter(f => f.category === activeTab);

  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Premium Features
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Shine Online</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From AI-powered generation to seamless publishing, we've built the complete toolkit for creating stunning professional portfolios.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="relative">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                {index < stats.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-px h-12 bg-gray-200 transform -translate-y-1/2"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'All Features' : category}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredFeatures.map((feature, index) => (
            <div
              key={feature.name}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg ${feature.glowColor} ${feature.hoverGlow} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  {feature.category}
                </span>
              </div>

              {/* Icon */}
              <div className={`relative inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg ${feature.glowColor} transition-transform duration-300 ${
                hoveredFeature === index ? 'scale-110 rotate-3' : ''
              }`}>
                <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
                {hoveredFeature === index && (
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                {feature.name}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Benefits List */}
              <div className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              {/* Hover Arrow */}
              <div className={`absolute bottom-6 right-6 transition-all duration-300 ${
                hoveredFeature === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}>
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Ready to Get Started?
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Create Your AI Portfolio Today
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who've already transformed their online presence with PortfolioAI.
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}