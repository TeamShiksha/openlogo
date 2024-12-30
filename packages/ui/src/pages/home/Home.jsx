import React from "react";
import About from "../../components/about/About";
import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/HeroSection/HeroSection";
import Pricing from "../../../components/pricing/Pricing";
import GetInTouch from "../../components/GetInTouch/GetInTouch";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Demo />
      <Features />
      <About/>
      <Pricing />
      <GetInTouch />
  </div>
  );
};

export default Home;
