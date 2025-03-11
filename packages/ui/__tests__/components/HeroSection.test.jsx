import { expect, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeroSection from "../../src/components/hero/HeroSection";
import { BUTTON_TEXT, HERO_SECTION } from "../../src/utils/Constants";

const openCloseAuthModal = vi.fn();

describe("HeroSection Component", () => {
  it("Tagline and summary visible", () => {
    render(<HeroSection openAuthModal={openCloseAuthModal} />);

    const tagline = screen.getByText(HERO_SECTION.tagLine);
    const summary = screen.getByText(HERO_SECTION.summary);
    expect(tagline).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
  });

  it("Buttons visible", () => {
    render(<HeroSection openAuthModal={openCloseAuthModal} />);

    const documentationButton = screen.getByText(BUTTON_TEXT.documentation);
    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    expect(documentationButton).toBeInTheDocument();
    expect(documentationButton.tagName).toBe("BUTTON");
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton.tagName).toBe("BUTTON");
  });

  it("Illustration visible", () => {
    render(<HeroSection openAuthModal={openCloseAuthModal} />);

    const logoImage = screen.getByAltText(HERO_SECTION.illustractionSrcAlt);
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", HERO_SECTION.illustractionSrc);
  });

  it("Auth modal visibility before and after the click", () => {
    render(<HeroSection openAuthModal={openCloseAuthModal} />);

    const anyDialog = screen.queryByText(BUTTON_TEXT.cross);
    expect(anyDialog).not.toBeInTheDocument();
    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    fireEvent.click(getStartedButton);
    expect(openCloseAuthModal).toHaveBeenCalled();
  });
});
