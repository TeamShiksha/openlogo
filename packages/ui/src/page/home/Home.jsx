import { useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import About from "../../components/about/About";
import Demo from "../../components/demo/Demo";
import Features from "../../components/features/Features";
import HeroSection from "../../components/hero/HeroSection";
import FAQs from "../../components/faqs/FAQs";
import Pricing from "../../components/pricing/Pricing";
import GetInTouch from "../../components/contact/GetInTouch";
import { AuthContext, UserContext } from "../../contexts/Contexts";
import PageMeta from "../../components/common/PageMeta";

const Home = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const { isAuthenticated } = useContext(AuthContext);

  const onHeroSectionButtonClick = () =>
    isAuthenticated ? navigate("/dashboard") : openAuthModal();

  return (
    <div className="container">
      <PageMeta
        path="/"
        description="Tap into a vast logo library with thousands of brands. Openlogo gives developers a simple API to fetch logos by domain, plus a free in-browser logo maker."
      />
      <HeroSection
        onPrimaryButtonClick={onHeroSectionButtonClick}
        isAuthenticated={isAuthenticated}
      />
      <Demo openAuthModal={openAuthModal} />
      <Features />
      <Pricing
        openAuthModal={openAuthModal}
        activePlan={userData?.subscription?.type}
      />
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
