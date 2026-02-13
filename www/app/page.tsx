"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import WorkflowSection from "@/components/workflow-section";
import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && !session.user.userType) {
      router.push("/onboarding");
    }
  }, [session, router]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
