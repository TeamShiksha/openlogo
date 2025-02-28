import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../src/components/header/Header";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  buttonText,
  branding,
} from "../src/utils/Constants";
import userEvent from "@testing-library/user-event";
import Home from "../src/page/home/Home";

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
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const brandButton = screen.getByRole("button", {
      name: /openlogo\.svg Openlogo/i,
    });
    fireEvent.click(brandButton);
    expect(window.location.pathname).toBe("/");
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
    render(
      <BrowserRouter>
        <Header />
        <Home />
      </BrowserRouter>
    );

    const headerElement = screen.getByTestId("header");

    for (const item of HEADER_ITEMS) {
      const navLink = within(headerElement).getByText(item.title);
      expect(navLink).toBeInTheDocument();

      await userEvent.click(navLink);

      const [path, sectionId] = item.url.split("#");

      expect(window.location.pathname).toBe(path);

      if (sectionId) {
        const sectionElement = screen.getByTestId(sectionId);
        expect(sectionElement).toBeInTheDocument();
      }
    }
  });
});
