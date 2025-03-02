import { expect, describe, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeroSection from "../../src/components/hero/HeroSection";
import { BUTTON_TEXT, HERO_SECTION } from "../../src/utils/Constants";

describe("HeroSection Component", () => {
  it("Tagline and summary visible", () => {
    render(<HeroSection />);

    const tagline = screen.getByText(HERO_SECTION.tagLine);
    const summary = screen.getByText(HERO_SECTION.summary);
    expect(tagline).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
  });

  it("Buttons visible", () => {
    render(<HeroSection />);

    const documentationButton = screen.getByText(BUTTON_TEXT.documentation);
    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    expect(documentationButton).toBeInTheDocument();
    expect(documentationButton.tagName).toBe("BUTTON");
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton.tagName).toBe("BUTTON");
  });

  it("Illustration visible", () => {
    render(<HeroSection />);

    const logoImage = screen.getByAltText(HERO_SECTION.illustractionSrcAlt);
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", HERO_SECTION.illustractionSrc);
  });

  it("Auth modal visibility before and after the click", () => {
    render(<HeroSection />);

    const anyDialog = screen.queryByRole("dialog");
    expect(anyDialog).not.toBeInTheDocument();
    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    fireEvent.click(getStartedButton);
    const authDialog = screen.getByRole("dialog");
    expect(authDialog).toBeInTheDocument();
    fireEvent.click(authDialog);
    const authDialogAfter = screen.queryByRole("dialog");
    expect(authDialogAfter).not.toBeInTheDocument();
  });
});
