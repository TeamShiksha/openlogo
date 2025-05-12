import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VerifyEmail from "../../../src/components/verification/VerifyEmail";

let mockToken = "mock-verification-token";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [
      {
        get: (param) => {
          if (param === "token") return mockToken;
          return null;
        },
      },
      vi.fn(),
    ],
  };
});

describe("VerifyEmail component", () => {
  beforeEach(() => {
    mockToken = "mock-verification-token";
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

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

  it("logs the token from URL parameters", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    expect(console.log).toHaveBeenCalledWith(
      "Token received:",
      "mock-verification-token"
    );
  });

  it("has correct responsive container structure", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    const pageContainer = document.querySelector(
      ".verification-page-container"
    );
    expect(pageContainer).not.toBeNull();

    const container = document.querySelector(".verification-container");
    expect(container).not.toBeNull();

    const card = document.querySelector(".verification-card");
    expect(card).not.toBeNull();

    const content = document.querySelector(".verification-content");
    expect(content).not.toBeNull();

    expect(pageContainer.contains(container)).toBe(true);
    expect(container.contains(card)).toBe(true);
    expect(card.contains(content)).toBe(true);
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

  it("renders correctly with null token", () => {
    mockToken = null;
    console.log.mockClear();

    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    const title = screen.getByText("Verifying");
    expect(title).toBeInTheDocument();

    expect(console.log).toHaveBeenCalledWith("Token received:", null);
  });
});
