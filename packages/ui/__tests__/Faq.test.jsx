import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FAQs from "../src/components/faqs/FAQs";
import { FAQ } from "../src/utils/Constants";
import plusCircle from "../src/assets/plusCircle.svg";
import minusCircle from "../src/assets/minusCircle.svg";

describe("FAQs Component", () => {
  it("should have render title and description", () => {
    render(<FAQs />);
    expect(screen.getByText("Frequently asked questions")).toBeVisible();
    expect(
      screen.getByText(
        "Everything you need to know about the product and billing."
      )
    ).toBeVisible();
  });

  it("should have render all FAQ questions", () => {
    render(<FAQs />);
    FAQ.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeVisible();
    });
  });

  it("should have render correct icon based on FAQ state", () => {
    render(<FAQs />);
    const firstQuestion = screen.getByText(FAQ[0].question);
    const toggleButton = firstQuestion.closest("button");
    expect(toggleButton).toBeDefined();

    const icon = toggleButton.querySelector("img");
    expect(icon).toHaveAttribute("src", plusCircle);
    expect(icon).toHaveAttribute("alt", "Expand FAQ");

    fireEvent.click(toggleButton);
    expect(icon).toHaveAttribute("src", minusCircle);
    expect(icon).toHaveAttribute("alt", "Collapse FAQ");
  });
});
