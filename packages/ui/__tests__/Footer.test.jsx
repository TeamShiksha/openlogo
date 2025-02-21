import { render, screen, within } from "@testing-library/react";
import Footer from "../src/components/footer/Footer";
import { FOOTER_ITEMS } from "../src/utils/Constants";
import { expect, describe, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Home from "../src/page/home/Home.jsx";

describe("Footer Component", () => {
  it("renders the footer logo with text and image", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const logoImage = screen.getByAltText("Logo Icon");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "openlogo.svg");
    expect(logoImage).toHaveAttribute("width", "30");
    expect(logoImage).toHaveAttribute("height", "30");

    const logoText = screen.getByText("Openlogo");
    expect(logoText).toBeInTheDocument();
  });

  it("renders all footer items with correct links and titles", () => {
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

  it("renders the copyright text", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const copyrightText = screen.getByText(/© Openlogo 2025/i);
    expect(copyrightText).toBeInTheDocument();
  });

  it("renders the 'Powered by TeamShiksha' link", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const poweredByLink = screen.getByText("Powered by TeamShiksha");
    expect(poweredByLink).toBeInTheDocument();
    expect(poweredByLink).toHaveAttribute("href", "https://team.shiksha");
    expect(poweredByLink).toHaveAttribute("target", "_blank");
    expect(poweredByLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("footer links should be clickable and navigate correctly", async () => {
    render(
      <BrowserRouter>
        <Home />
        <Footer />
      </BrowserRouter>
    );

    const footerElement = screen.getByRole("navigation");

    for (const item of FOOTER_ITEMS) {
      const navLink = within(footerElement).getByText(item.title);
      expect(navLink).toBeInTheDocument();

      await userEvent.click(navLink);

      if (item.url.startsWith("#")) {
        const sectionElement = screen.getByTestId(item.url.substring(1));
        expect(sectionElement).toBeInTheDocument();
      } else {
        // If it's a route, check if the pathname has changed
        expect(window.location.pathname).toBe(item.url);
      }
    }
  });
});
