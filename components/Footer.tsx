import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {/* Add social media links here if you have them */}
            {/* Example:
            <a href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Facebook</span>
              <FacebookIcon className="h-6 w-6" />
            </a> */}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base">
              &copy; {currentYear} PortfolioAI. All rights reserved.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <Link href="/terms" className="hover:text-indigo-400 mx-2">Terms of Service</Link>
          |
          <Link href="/privacy" className="hover:text-indigo-400 mx-2">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}