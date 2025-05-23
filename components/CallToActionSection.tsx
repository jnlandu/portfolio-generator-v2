import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CallToActionSection() {
  return (
    <section className="bg-indigo-700">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          <span className="block">Ready to elevate your professional presence?</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          Join thousands of professionals who have built stunning portfolios with PortfolioAI.
          Get started today and land your next opportunity.
        </p>
        <Link
          href="/signup" // Link to your signup page
          className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
        >
          Create Your Free Portfolio Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </section>
  );
}