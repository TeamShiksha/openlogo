import { render, screen } from "@testing-library/react";
import Footer from "../src/components/footer/Footer";
import { FOOTER_ITEMS } from "../src/utils/Constants";
import { expect, describe, it } from "vitest";

describe("Footer Component", () => {
  it("renders the footer logo with text and image", () => {
    render(<Footer />);
    const logoImage = screen.getByAltText("Logo Icon");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "openlogo.svg");
    expect(logoImage).toHaveAttribute("width", "30");
    expect(logoImage).toHaveAttribute("height", "30");

    const logoText = screen.getByText("Openlogo");
    expect(logoText).toBeInTheDocument();
  });

  it("renders all footer items with correct links and titles", () => {
    render(<Footer />);

    FOOTER_ITEMS.forEach((item) => {
      const footerLink = screen.getByText(item.title);
      expect(footerLink).toBeInTheDocument();
      expect(footerLink).toHaveAttribute("href", item.url);
    });
  });

  it("renders the copyright text", () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/© Openlogo 2025/i);
    expect(copyrightText).toBeInTheDocument();
  });

  it("renders the 'Powered by TeamShiksha' link", () => {
    render(<Footer />);

    const poweredByLink = screen.getByText("Powered by TeamShiksha");
    expect(poweredByLink).toBeInTheDocument();
    expect(poweredByLink).toHaveAttribute("href", "https://team.shiksha");
    expect(poweredByLink).toHaveAttribute("target", "_blank");
    expect(poweredByLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
