import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "../../src/page/notfound/NotFound";
import { MemoryRouter } from "react-router-dom";
import { BUTTON_TEXT } from "../../src/utils/Constants";

describe("NotFound component", () => {
  it("renders all expected text content", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for does not exist.")
    ).toBeInTheDocument();
    const buttonText = screen.getByText(BUTTON_TEXT.goToHome);
    expect(buttonText).toBeInTheDocument();
  });

  it("navigates to home", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: BUTTON_TEXT.goToHome });
    expect(link).toHaveAttribute("href", "/");
  });
});
