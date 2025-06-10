import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VerifyEmail from "../../../src/page/verification/VerifyEmail";

const mockMakeRequest = vi.fn();
const mockData = { title: "Test Title", message: "Test Message" };
const mockErrorMsg = "";
const mockIsSuccess = false;

vi.mock("../../../src/hooks/useApi", () => ({
  useApi: () => ({
    makeRequest: mockMakeRequest,
    data: mockData,
    errorMsg: mockErrorMsg,
    isSuccess: mockIsSuccess,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [
      {
        get: () => "test-token",
      },
      vi.fn(),
    ],
  };
});

describe("VerifyEmail component", () => {
  it("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    const title = screen.getByText("Verifying");
    expect(title).toBeInTheDocument();

    const message = screen.getByText(
      "Please wait, while we verify your email."
    );
    expect(message).toBeInTheDocument();
  });

  it("displays loading spinner during verification", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    const loadingContainer = document.querySelector(".loading-container");
    expect(loadingContainer).not.toBeNull();
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

    const loadingContainer = document.querySelector(".loading-container");
    expect(loadingContainer).not.toBeNull();
  });
});
