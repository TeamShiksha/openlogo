import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Verification from "../../../src/page/verification/Verification";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [
      {
        get: () => null,
      },
      vi.fn(),
    ],
  };
});

describe("Verification page", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <Verification />
      </BrowserRouter>
    );

    const title = screen.getByText("Verifying");
    expect(title).toBeInTheDocument();
  });

  it("displays loading spinner", () => {
    render(
      <BrowserRouter>
        <Verification />
      </BrowserRouter>
    );

    const loadingContainer = document.querySelector(
      "[class*='loadingContainer']"
    );
    expect(loadingContainer).not.toBeNull();
  });

  it("displays correct title and message", () => {
    render(
      <BrowserRouter>
        <Verification />
      </BrowserRouter>
    );

    const title = screen.getByText("Verifying");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H2");

    const message = screen.getByText(
      "Please wait, while we verify your email."
    );
    expect(message).toBeInTheDocument();
  });

  it("has correct container structure", () => {
    render(
      <BrowserRouter>
        <Verification />
      </BrowserRouter>
    );

    const pageContainer = document.querySelector(
      "[class*='verificationPageContainer']"
    );
    expect(pageContainer).not.toBeNull();

    const card = document.querySelector("[class*='verificationCard']");
    expect(card).not.toBeNull();

    expect(pageContainer.contains(card)).toBe(true);
  });

  it("has appropriate CSS module classes for styling", () => {
    render(
      <BrowserRouter>
        <Verification />
      </BrowserRouter>
    );

    const title = screen.getByText("Verifying");
    expect(title.classList.toString()).toContain("verifyTitle");
  });
});
