import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToHash = sessionStorage.getItem("scrollTo");

    if (scrollToHash) {
      sessionStorage.removeItem("scrollTo");

      // Try to scroll to the section with a small delay to ensure DOM is ready
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(scrollToHash);
        if (element) {
          const offset = 95;
          const elementTop =
            element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementTop - offset,
            behavior: "smooth",
          });
        } else if (attempts < 5) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 100);
    } else {
      // If no specific section to scroll to, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollManager;
