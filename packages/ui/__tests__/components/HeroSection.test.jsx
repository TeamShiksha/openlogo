import { expect, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeroSection from "../../src/components/hero/HeroSection";
import { BUTTON_TEXT, HERO_SECTION } from "../../src/utils/Constants";
import { BrowserRouter } from "react-router-dom";

const onPrimaryButtonClick = vi.fn();

describe("HeroSection Component", () => {
  it("Tagline and summary visible", () => {
    render(
      <BrowserRouter>
        <HeroSection onPrimaryButtonClick={onPrimaryButtonClick} />
      </BrowserRouter>
    );

    const tagline = screen.getByText(HERO_SECTION.tagLine);
    const summary = screen.getByText(HERO_SECTION.summary);
    expect(tagline).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
  });

  it("Buttons visible", () => {
    render(
      <BrowserRouter>
        <HeroSection onPrimaryButtonClick={onPrimaryButtonClick} />
      </BrowserRouter>
    );

    const documentationButton = screen.getByText(BUTTON_TEXT.documentation);
    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    expect(documentationButton).toBeInTheDocument();
    expect(documentationButton.tagName).toBe("BUTTON");
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton.tagName).toBe("BUTTON");
  });

  it("clicking the Documentation button navigates to the Document Page", () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    const DocumentationButton = screen.getByRole("button", {
      name: BUTTON_TEXT.documentation,
    });
    fireEvent.click(DocumentationButton);
    expect(window.location.pathname).toBe("/docs");
  });

  it("Illustration visible", () => {
    render(
      <BrowserRouter>
        <HeroSection onPrimaryButtonClick={onPrimaryButtonClick} />
      </BrowserRouter>
    );

    const logoImage = screen.getByAltText(HERO_SECTION.illustractionSrcAlt);
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", HERO_SECTION.illustractionSrc);
  });

  it("Auth modal visibility before and after the click", () => {
    render(
      <BrowserRouter>
        <HeroSection onPrimaryButtonClick={onPrimaryButtonClick} />
      </BrowserRouter>
    );

    const anyDialog = screen.queryByText(BUTTON_TEXT.cross);
    expect(anyDialog).not.toBeInTheDocument();
    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    fireEvent.click(getStartedButton);
    expect(onPrimaryButtonClick).toHaveBeenCalled();
  });

  it("shows Go To Dashboard button when authenticated", () => {
    render(
      <BrowserRouter>
        <HeroSection
          onPrimaryButtonClick={onPrimaryButtonClick}
          isAuthenticated={true}
        />
      </BrowserRouter>
    );

    const gotoDashboardButton = screen.getByRole("button", {
      name: BUTTON_TEXT.gotoDashboard,
    });
    expect(gotoDashboardButton).toBeInTheDocument();
  });
});
