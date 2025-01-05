import About from "../../components/about/About";
import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/hero/HeroSection";
import FAQs from "../../components/faqs/FAQs";
import Pricing from "../../components/pricing/Pricing";
import GetInTouch from "../../components/GetInTouch/GetInTouch";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Demo />
      <Features />
      <Pricing />
      <About />
      <FAQs />
      <GetInTouch />
    </>
  );
};

export default Home;
