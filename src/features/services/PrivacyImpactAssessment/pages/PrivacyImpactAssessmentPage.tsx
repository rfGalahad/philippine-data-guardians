import PIABackground from "@/assets/services/pia-service.png";

import HeroSection from "../../components/HeroSection"
import Footer from "../../components/Footer";

import HowItWorksSection from "../components/HowItWorksSection";
import SubscriptionTiers from "../components/SubscriptionTiers";


export const PrivacyImpactAssessmentPage = () => {

  return (
    <div className="bg-[linear-gradient(90deg,#053261_2%,#1E3A8A_50%,#371C87_100%)]">
      {/* HERO SECTION */}
      <HeroSection
        image={PIABackground}
        imageAlt="PIA Background"
        title="Automated Privacy Impact Assessment"
        subtitle="Assess organizational processes and systems for privacy risks."
      />

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* SUBSCRIPTION TIERS */}
      <SubscriptionTiers/>

      {/* FOOTER */}
      <Footer/>
    </div>
    
    
  )
}


export default PrivacyImpactAssessmentPage;