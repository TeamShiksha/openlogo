import { expect, describe, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "../../src/components/footer/Footer";
import Home from "../../src/page/home/Home";
import PrivacyPolicy from "../../src/page/privacypolicy/PrivacyPolicy";
import { BRANDING, FOOTER_ITEMS } from "../../src/utils/Constants";

describe("Footer Component", () => {
  it("Render footer branding", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const logoImage = screen.getByAltText(BRANDING.imageSrc);
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", BRANDING.imageSrc);
    const logoText = screen.getByText(BRANDING.brandName);
    expect(logoText).toBeInTheDocument();
  });

  it("Render all footer navigations", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    FOOTER_ITEMS.forEach((item) => {
      const footerLink = screen.getByText(item.title);
      expect(footerLink).toBeInTheDocument();
    });
  });

  it("Render powered by section", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const copyrightText = screen.getByText(/© 2025/i);
    expect(copyrightText).toBeInTheDocument();
    const poweredByLink = screen.getByText(BRANDING.poweredByText);
    expect(poweredByLink).toHaveAttribute("href", BRANDING.poweredByLink);
    expect(poweredByLink).toHaveAttribute("target", "_blank");
    expect(poweredByLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("Footer navigations should navigate to correct components", async () => {
    render(
      <BrowserRouter>
        <Home />
        <Footer />
        <PrivacyPolicy />
      </BrowserRouter>
    );

    const footerElement = screen.getByTestId("footer");
    for (const item of FOOTER_ITEMS) {
      const navLink = within(footerElement).getByText(item.title);
      expect(navLink).toBeInTheDocument();
      await userEvent.click(navLink);
      const [path, sectionId] = item.url.split("#");
      expect(window.location.pathname).toBe(path);
      if (sectionId) {
        const sectionElement = screen.getByTestId(sectionId);
        expect(sectionElement).toBeInTheDocument();
      }
    }
  });
});
