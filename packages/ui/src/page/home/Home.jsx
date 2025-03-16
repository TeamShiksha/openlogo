import PropTypes from "prop-types";
import About from "../../components/about/About";
import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/hero/HeroSection";
import FAQs from "../../components/faqs/FAQs";
import Pricing from "../../components/pricing/Pricing";
import GetInTouch from "../../components/contact/GetInTouch";

const Home = ({ openAuthModal }) => {
  return (
    <div className="container">
      <HeroSection openAuthModal={openAuthModal} />
      <Demo />
      <Features />
      <Pricing openAuthModal={openAuthModal} />
      <About />
      <FAQs />
      <GetInTouch />
    </div>
  );
};

Home.propTypes = {
  openAuthModal: PropTypes.func.isRequired,
};

export default Home;
