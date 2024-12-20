import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/HeroSection/HeroSection";
import FAQs from "../../components/faqs/FAQs";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Demo />
      <Features />
      <FAQs/>
    </div>
  );
};

export default Home;
