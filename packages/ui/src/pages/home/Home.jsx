import React from "react";
import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/HeroSection/HeroSection";
import Pricing from "../../../components/pricing/Pricing";
import FAQs from "../../components/faqs/FAQs";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Demo />
      <Features />
      <Pricing />
      <FAQs />
    </div>
  );
};

export default Home;
