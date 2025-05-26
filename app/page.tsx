'use client'; // Keep this if your new components use client-side hooks like useAuth
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSelection from '@/components/FeaturesSelection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CallToActionSection from '@/components/CallToActionSection';


export default function LandingPage() {
  return (
    <Layout showSidebar={false}> {/* Use Layout without sidebar for landing page */}
      {/* <Navbar /> */}
      <HeroSection />
      <FeaturesSelection />
      <HowItWorksSection />
      {/* You can add other sections like Testimonials, Pricing Preview, etc. here */}
      {/* <CallToActionSection /> */}
      <Footer />
    </Layout>
  );
}