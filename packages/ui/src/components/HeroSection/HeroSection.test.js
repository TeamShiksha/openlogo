import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";

describe("Hero Section Tests", () => {
  test("renders hero section", () => {
    render(<HeroSection />);

    const heroSectionMainHeading = screen.getByText(
      /Access hundreds of logos with just one line of code/i,
    );
    const heroSectionSubHeading = screen.getByText(
      /A collection of APIs designed to simplify the process of obtaining company logos. Generate API keys in seconds/i,
    );
    expect(heroSectionMainHeading).toBeInTheDocument();
    expect(heroSectionSubHeading).toBeInTheDocument();
  });
});
