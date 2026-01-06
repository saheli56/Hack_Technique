import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { RecentActivitySection } from "@/components/home/RecentActivitySection";
import { QuickActionsSection } from "@/components/home/QuickActionsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <QuickActionsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <RecentActivitySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
