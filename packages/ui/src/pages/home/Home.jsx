import React from "react";
import About from "../../components/about/About";
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
      <About/>
      <Pricing />
      <FAQs />
  </div>
  );
};

export default Home;
