import { ArrowRight, Sparkles, Menu, X, Star, Zap, Globe, Shield, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroAndNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotating testimonials
  const testimonials = [
    { text: "Generated my portfolio in 2 minutes!", author: "Sarah K." },
    { text: "Got 3 job interviews in a week", author: "Mike R." },
    { text: "Looks better than what I'd pay $2k for", author: "Emma L." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PortfolioAI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors duration-200">Features</a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors duration-200">How It Works</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#examples" className="text-white/80 hover:text-white transition-colors duration-200">Examples</a>
              <Link href="/create-portfolio">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-md rounded-lg mt-2 p-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-white/80 hover:text-white transition-colors duration-200 py-2">Features</a>
                <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors duration-200 py-2">How It Works</a>
                <a href="#pricing" className="text-white/80 hover:text-white transition-colors duration-200 py-2">Pricing</a>
                <a href="#examples" className="text-white/80 hover:text-white transition-colors duration-200 py-2">Examples</a>
                <Link href="/create-portfolio">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
                  Get Started
                </button>
              </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-bounce">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-white">AI-Powered • Live in 2 Minutes</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-8 leading-tight">
              Your Dream Portfolio
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                Built by AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              Stop spending weeks designing. Upload your resume, connect LinkedIn, and watch AI craft a 
              <span className="text-purple-300 font-semibold"> stunning professional portfolio </span>
              that gets you hired.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-4 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white/20"></div>
                  ))}
                </div>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white/80 text-sm ml-2">10,000+ portfolios created</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center">
                  Create My Portfolio
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              
              <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                <span className="flex items-center justify-center">
                  See Examples
                  <ChevronDown className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
                </span>
              </button>
            </div>

            {/* Rotating Testimonial */}
            <div className="max-w-md mx-auto">
              <div className="relative overflow-hidden h-16">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 transform ${
                      index === currentTestimonial 
                        ? 'translate-y-0 opacity-100' 
                        : index < currentTestimonial 
                          ? '-translate-y-full opacity-0' 
                          : 'translate-y-full opacity-0'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-white/80 italic">"{testimonial.text}"</p>
                      <p className="text-purple-300 text-sm mt-1">- {testimonial.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-white/80">Lightning Fast</span>
              </div>
              <div className="flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400 mr-2" />
                <span className="text-white/80">Secure & Private</span>
              </div>
              <div className="flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-white/80">Mobile Ready</span>
              </div>
              <div className="flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-white/80">AI Optimized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </section>
    </div>
  );
}