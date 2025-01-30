import { render, screen, fireEvent } from "@testing-library/react";
import HeroSection from "../src/components/hero/HeroSection";
import { expect, describe, it } from "vitest";

describe("HeroSection Component", () => {
  it("renders the HeroSection with heading and description", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Access hundreds of logos with just one line of code")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A collection of APIs designed to simplify the process of obtaining company logos. Generate API keys in seconds."
      )
    ).toBeInTheDocument();
  });

  it("renders the buttons correctly", () => {
    render(<HeroSection />);
    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("Get started")).toBeInTheDocument();
  });

  it("renders the logo image in the right section", () => {
    render(<HeroSection />);
    const logoImage = screen.getByAltText("Logo Images");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "logo-images.png");
  });

  it("does not render the modal initially", () => {
    render(<HeroSection />);
    expect(screen.queryByText("AuthModal")).not.toBeInTheDocument();
  });

  it("opens the modal when the 'Get started' button is clicked", () => {
    render(<HeroSection />);
    fireEvent.click(screen.getByText("Get started"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the modal when the 'Escape' key is pressed", () => {
    render(<HeroSection />);
    fireEvent.click(screen.getByText("Get started"));
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal when clicking outside of it", () => {
    render(<HeroSection />);
    fireEvent.click(screen.getByText("Get started"));
    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("toggles between SignIn and SignUp forms when the toggle button is clicked", () => {
    render(<HeroSection />);
    fireEvent.click(screen.getByText("Get started"));
    expect(screen.getByText("Sign up for free")).toBeInTheDocument();
    expect(screen.getByText("Go to dashboard")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Don't have an account?"));
  });
});
