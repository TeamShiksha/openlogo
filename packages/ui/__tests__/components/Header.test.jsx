import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "../../src/components/header/Header";
import Home from "../../src/page/home/Home";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  BUTTON_TEXT,
  BRANDING,
} from "../../src/utils/Constants";

describe("Header component", () => {
  it("Render header branding and naviagte to home on click", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const brandImage = screen.getByAltText(BRANDING.imageSrc);
    const brandName = screen.getByText(BRANDING.brandName);
    expect(brandImage).toBeInTheDocument();
    expect(brandName).toBeInTheDocument();
    fireEvent.click(brandName);
    expect(window.location.pathname).toBe("/");
  });

  it("Render all header navigations", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    HEADER_ITEMS.forEach((item) => {
      const navItem = screen.getByText(item.title);
      expect(navItem).toBeInTheDocument();
    });
  });

  it("Header links should be clickable and navigate", async () => {
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

  it("Hamburger visible before and after screen width change", () => {
    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.queryByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(mobileMenuButton).not.toBeInTheDocument();

    window.innerWidth = 1000;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const afterResizeMobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(afterResizeMobileMenuButton).toBeInTheDocument();
  });

  it("Mobile header toggle icon", async () => {
    window.innerWidth = 1000;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    await userEvent.click(mobileMenuButton);
    const closeIcon = screen.getByRole("button", { name: CROSS.alt });
    expect(closeIcon).toBeInTheDocument();
    await userEvent.click(closeIcon);
    const afterClose = screen.queryByRole("button", { name: CROSS.alt });
    expect(afterClose).not.toBeInTheDocument();
  });

  it("Mobile header auto close if width > 1024", async () => {
    window.innerWidth = 700;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    await userEvent.click(mobileMenuButton);
    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));
    const mobileMenuButtonAfter = screen.queryByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(mobileMenuButtonAfter).not.toBeInTheDocument();
  });

  it("Open and close authModal", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    fireEvent.click(getStartedButton);
    const signupForm = screen.getByTestId("signup-form");
    expect(signupForm).toBeInTheDocument();
    const closeModalButton = screen.getAllByText(BUTTON_TEXT.cross);
    fireEvent.click(closeModalButton[0]);
    const signupFormAfter = screen.queryByTestId("signup-form");
    expect(signupFormAfter).not.toBeInTheDocument();
  });
});
