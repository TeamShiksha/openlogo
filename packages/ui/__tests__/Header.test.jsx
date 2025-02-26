import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Header from "../src/components/header/Header";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  buttonText,
  branding,
} from "../src/utils/Constants";
import userEvent from "@testing-library/user-event";
import Home from "../src/page/home/Home.jsx";
import { TestWrapper } from "./utils/TestWrapper";

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
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <dialog data-testid="auth-modal" data-open={isOpen}>
        <button onClick={onClose}>Close Modal</button>
      </dialog>
    ) : null,
}));

describe("Header", () => {
  it("renders branding correctly", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    expect(screen.getByAltText(branding.imageSrc)).toBeInTheDocument();
    expect(screen.getByText(branding.brandName)).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    HEADER_ITEMS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("toggles the mobile menu", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
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

  // Update the modal test to check for role="dialog"
  it("opens the signup modal", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    const getStartedButton = screen.getByText(buttonText.getStarted);
    fireEvent.click(getStartedButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the signup modal", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    const getStartedButton = screen.getByText(buttonText.getStarted);
    fireEvent.click(getStartedButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeModalButton = screen.getByText("Close Modal");
    fireEvent.click(closeModalButton);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates to home when clicking the brand", () => {
    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const brandButton = screen.getByRole("button", {
      name: /openlogo\.svg Openlogo/i,
    });
    fireEvent.click(brandButton);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("switches between hamburger and cross icons", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );
    const menuButton = screen.getByRole("button", { name: HAMBURGER.alt });
    expect(screen.getByAltText(HAMBURGER.alt)).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByAltText(CROSS.alt)).toBeInTheDocument();
  });

  it("header links should be clickable and navigate correctly", async () => {
    render(
      <TestWrapper>
        <Header />
        <Home />
      </TestWrapper>
    );

    const headerElement = screen.getByTestId("header");

    for (const item of HEADER_ITEMS) {
      const navLink = within(headerElement).getByText(item.title);
      expect(navLink).toBeInTheDocument();

      await userEvent.click(navLink);

      if (item.url.startsWith("#")) {
        const sectionElement = screen.getByTestId(item.url.substring(1));
        expect(sectionElement).toBeInTheDocument();
      } else {
        expect(window.location.pathname).toBe(item.url);
      }
    }
  });
});
