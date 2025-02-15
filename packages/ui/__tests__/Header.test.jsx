import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {BrowserRouter, MemoryRouter, useNavigate} from "react-router-dom";
import Header from "../src/components/header/Header";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  buttonText,
  branding,
} from "../src/utils/Constants";
import userEvent from "@testing-library/user-event";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../src/components/header/MobileHeaderMenu", () => ({
  default: ({ isOpen, closeMenu }) => (
    <div data-testid="mobile-menu" data-open={isOpen}>
      <button onClick={() => closeMenu(false)}>Close</button>
    </div>
  ),
}));

vi.mock("../src/components/auth/Auth", () => ({
  default: ({ isOpen, onClose }) => (
    <div data-testid="auth-modal" data-open={isOpen}>
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

describe("Header", () => {
  it("renders branding correctly", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByAltText(branding.imageSrc)).toBeInTheDocument();
    expect(screen.getByText(branding.brandName)).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    HEADER_ITEMS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("toggles the mobile menu", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const menuButton = screen.getByAltText(HAMBURGER.alt);
    fireEvent.click(menuButton);
    expect(screen.getByTestId("mobile-menu")).toHaveAttribute(
      "data-open",
      "true"
    );

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.getByTestId("mobile-menu")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  it("opens the signup modal", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const getStartedButton = screen.getByText(buttonText.getStarted);
    fireEvent.click(getStartedButton);
    expect(screen.getByTestId("auth-modal")).toHaveAttribute(
      "data-open",
      "true"
    );
  });

  it("closes the signup modal", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const getStartedButton = screen.getByText(buttonText.getStarted);
    fireEvent.click(getStartedButton);
    expect(screen.getByTestId("auth-modal")).toHaveAttribute(
      "data-open",
      "true"
    );

    const closeModalButton = screen.getByText("Close Modal");
    fireEvent.click(closeModalButton);
    expect(screen.getByTestId("auth-modal")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  it("navigates to home when clicking the brand", () => {
    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const brandButton = screen.getByRole("button", {
      name: /openlogo\.svg Openlogo/i,
    });
    fireEvent.click(brandButton);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("switches between hamburger and cross icons", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const menuButton = screen.getByRole("button", { name: HAMBURGER.alt });
    expect(screen.getByAltText(HAMBURGER.alt)).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByAltText(CROSS.alt)).toBeInTheDocument();
  });

  it("header links should be clickable and navigate correctly", async () => {
    render(<Header />, { wrapper: MemoryRouter });

    for (const item of HEADER_ITEMS) {
        const navLink = screen.getByText(item.title);
        expect(navLink).toBeInTheDocument();

        await userEvent.click(navLink);

        expect(window.location.pathname).toBe(item.url);
    }
  });
});
