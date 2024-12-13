import About from "../../components/about/About";
import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/HeroSection/HeroSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Demo />
      <Features />
      <About/>
    </div>
  );
};

export default Home;
