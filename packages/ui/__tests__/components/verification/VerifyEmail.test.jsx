import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VerifyEmail from "../../../src/components/verification/VerifyEmail";

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

describe("VerifyEmail component", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    const title = screen.getByText("Verifying");
    expect(title).toBeInTheDocument();
  });

  it("displays loading animation", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    const loadingDots = document.querySelector(".loading-dots");
    expect(loadingDots).not.toBeNull();
    expect(loadingDots.children.length).toBe(3);
  });

  it("displays correct title and message", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
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
        <VerifyEmail />
      </BrowserRouter>
    );

    const pageContainer = document.querySelector(
      ".verification-page-container"
    );
    expect(pageContainer).not.toBeNull();

    const card = document.querySelector(".verification-card");
    expect(card).not.toBeNull();

    expect(pageContainer.contains(card)).toBe(true);
  });

  it("has appropriate CSS classes for styling", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    const title = screen.getByText("Verifying");
    expect(title.classList.contains("verify-title")).toBe(true);

    const loadingDotsContainer = document.querySelector(".loading-dots");
    const spans = loadingDotsContainer.querySelectorAll("span");
    expect(spans.length).toBe(3);
  });
});
