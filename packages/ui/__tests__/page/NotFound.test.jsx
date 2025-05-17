import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "../../src/page/notfound/NotFound";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { BUTTON_TEXT, NOT_FOUND_PAGE } from "../../src/utils/Constants";

describe("NotFound component", () => {
  it("renders all expected text content", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText(NOT_FOUND_PAGE.TITLE)).toBeInTheDocument();
    expect(screen.getByText(NOT_FOUND_PAGE.MESSAGE)).toBeInTheDocument();
    const buttonText = screen.getByText(BUTTON_TEXT.goToHome);
    expect(buttonText).toBeInTheDocument();
  });

  it("link element exists with goToHome button inside it", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: BUTTON_TEXT.goToHome });
    expect(link).toHaveAttribute("href", "/");
  });

  it("navigates to Home page on goToHome button click", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: BUTTON_TEXT.goToHome });
    fireEvent.click(button);
    expect(window.location.pathname).toBe("/");
  });
});
