import { Check, Star, Zap, Crown, Sparkles, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: 0,
    originalPrice: null,
    description: 'Perfect for trying out PortfolioAI',
    badge: null,
    badgeColor: '',
    gradient: 'from-gray-400 to-gray-600',
    glowColor: 'shadow-gray-500/20',
    features: [
      '1 Portfolio',
      'Basic AI Generation',
      'Standard Templates',
      'portfolioai.com subdomain',
      'Basic Analytics',
      'Community Support'
    ],
    limitations: [
      'No custom domain',
      'Limited customization',
      'Basic AI features only'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Pro',
    price: 15,
    originalPrice: 25,
    description: 'Most popular for professionals',
    badge: 'Most Popular',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    gradient: 'from-purple-500 to-pink-600',
    glowColor: 'shadow-purple-500/25',
    features: [
      '5 Portfolios',
      'Advanced AI Generation',
      'Premium Templates',
      'Custom Domain Support',
      'Advanced Analytics',
      'Priority Support',
      'AI Chat Customization',
      'Social Media Integration',
      'SEO Optimization',
      'Export Options'
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 49,
    originalPrice: 79,
    description: 'For teams and agencies',
    badge: 'Best Value',
    badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'shadow-emerald-500/25',
    features: [
      'Unlimited Portfolios',
      'White-label Solutions',
      'Team Collaboration',
      'Advanced AI Models',
      'Custom Branding',
      'API Access',
      'Dedicated Support',
      'Custom Integrations',
      'Advanced Analytics',
      'Multi-user Management',
      'Priority Processing',
      'Custom Templates'
    ],
    limitations: [],
    cta: 'Start Enterprise',
    popular: false
  }
];

const faqs = [
  {
    question: 'Can I change my plan anytime?',
    answer: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. No questions asked.'
  },
  {
    question: 'What happens to my portfolios if I cancel?',
    answer: 'Your portfolios remain accessible for 30 days after cancellation. You can export them anytime during your subscription.'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! Pro and Enterprise plans come with a 14-day free trial. No credit card required.'
  }
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const getPrice = (price: any) => {
    if (price === 0) return 0;
    return isAnnual ? price : Math.round(price * 1.2);
  };

  const getSavings = (price : any, originalPrice: any) => {
    if (!originalPrice || price === 0) return null;
    const currentPrice = getPrice(price);
    const originalCurrentPrice = isAnnual ? originalPrice : Math.round(originalPrice * 1.2);
    return Math.round(((originalCurrentPrice - currentPrice) / originalCurrentPrice) * 100);
  };

  return (
    <section id="pricing" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent)] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Crown className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-white/90">Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Start free, upgrade when you need more. All plans include our core AI portfolio generation with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual ? 'bg-white text-purple-600 shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                isAnnual ? 'bg-white text-purple-600 shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const currentPrice = getPrice(plan.price);
            const savings = getSavings(plan.price, plan.originalPrice);
            
            return (
              <div
                key={plan.name}
                className={`relative group transition-all duration-500 transform ${
                  plan.popular 
                    ? 'scale-105 z-10' 
                    : hoveredPlan === index 
                      ? 'scale-105 z-10' 
                      : 'hover:scale-105'
                }`}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Card */}
                <div className={`relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl ${plan.glowColor} transition-all duration-500 ${
                  plan.popular || hoveredPlan === index ? 'bg-white/15 shadow-purple-500/25' : ''
                }`}>
                  
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 ${plan.badgeColor} text-white text-sm font-bold rounded-full shadow-lg`}>
                      <div className="flex items-center">
                        {plan.popular && <Star className="w-4 h-4 mr-1 fill-current" />}
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/70 text-sm mb-6">{plan.description}</p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-5xl font-bold text-white">${currentPrice}</span>
                      <div className="ml-2">
                        <div className="text-white/70 text-sm">per month</div>
                        {plan.originalPrice && (
                          <div className="text-white/50 text-sm line-through">
                            ${isAnnual ? plan.originalPrice : Math.round(plan.originalPrice * 1.2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Savings Badge */}
                    {savings && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-500/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Save {savings}%
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-white/90">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {/* Limitations */}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center text-white/50">
                        <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg ${plan.glowColor} hover:shadow-xl`
                      : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                  }`}>
                    <span className="flex items-center justify-center">
                      {plan.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </button>

                  {/* Free Trial Notice */}
                  {plan.price > 0 && (
                    <p className="text-center text-white/60 text-xs mt-3">
                      14-day free trial • No credit card required
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-8 text-white/60">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">30-day money-back guarantee</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              <span className="text-sm">No setup fees</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-white hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-200 ${
                    openFaq === index ? 'rotate-90' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/70 mb-6 text-lg">
            Ready to transform your online presence?
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105">
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}