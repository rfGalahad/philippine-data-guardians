import Hero from "../components/HeroSection";
import Navbar from "../components/Navbar";
import About from "../components/AboutSection";
import JoinCommunity from "../components/JoinCommunitySection";
import MembershipTiers from "../components/MembershipTiersSection";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Services from "../components/ServicesSection";
import DataBreachSection from "../components/DataBreachSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";


function LandingPage () {
   
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[linear-gradient(90deg,#053261_2%,#1E3A8A_50%,#371C87_100%)]">
      <Navbar />
      <Hero/>
      <About/>
      <JoinCommunity/>
      <MembershipTiers/>
      <Services/>
      <DataBreachSection/>
      <ContactSection/>
      <Footer/>
      <ScrollToTopButton/>
    </div>
  )
}

export default LandingPage;