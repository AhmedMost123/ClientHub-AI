import { AISection } from "@/components/home/AISection";
import { CTA } from "@/components/home/CTA";
import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";
import { Showcase } from "@/components/home/Showcase";
import { Testimonials } from "@/components/home/Testimonials";
import { Workflow } from "@/components/home/Workflow";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Workflow />
      <AISection />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
