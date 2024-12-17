import React from "react";
import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/HeroSection/HeroSection";
import Pricing from "../../../components/pricing/Pricing";
const Home = () => {
  return (
    <div>
      <HeroSection />
      <Demo />
      <Features />
      <Pricing />
    </div>
  );
};

export default Home;
