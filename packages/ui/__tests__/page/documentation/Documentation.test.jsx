import { expect, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Documentation from "../../../src/page/documentation/Documentation";
import { DOCUMENTATION } from "../../../src/utils/Constants";
import { BrowserRouter } from "react-router-dom";
import { getBaseApiUrl } from "../../../src/utils/Helpers";

describe("Documentation Component", () => {
  it("renders the introduction heading, text, and base URL", () => {
    render(
      <BrowserRouter>
        <Documentation />
      </BrowserRouter>
    );

    const heading = screen.getByText(DOCUMENTATION.introduction.heading);
    const text = screen.getByText(DOCUMENTATION.introduction.text);
    const baseUrl = screen.getByText(/Base URL:/);

    expect(heading).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(baseUrl).toBeInTheDocument();
  });

  it("returns correct BASE API URL for different environments", () => {
    expect(getBaseApiUrl("http://localhost:3000")).toBe(DOCUMENTATION.localUrl);
    expect(getBaseApiUrl("https://stage-openlogo.vercel.app")).toBe(
      DOCUMENTATION.baseStageUrl
    );
    expect(getBaseApiUrl("https://openlogo.fyi")).toBe(
      DOCUMENTATION.baseProdUrl
    );
  });

  it("renders all API features with their headings, descriptions, endpoints", () => {
    render(
      <BrowserRouter>
        <Documentation />
      </BrowserRouter>
    );

    DOCUMENTATION.apiDocs.forEach((feature) => {
      const featureHeading = screen.getByText(feature.heading);
      const featureText = screen.getByText(feature.text);
      const endpointText = screen.getByText(feature.endPoint);

      expect(featureHeading).toBeInTheDocument();
      expect(featureText).toBeInTheDocument();
      expect(endpointText).toBeInTheDocument();
    });
  });

  it("displays and closes the contact form modal when clicking 'contact us'", () => {
    render(
      <BrowserRouter>
        <Documentation />
      </BrowserRouter>
    );

    const contactUsLink = screen.getByText("contact us");
    expect(contactUsLink).toBeInTheDocument();
    fireEvent.click(contactUsLink);

    const closeModalButton = screen.getByText("×");
    expect(closeModalButton).toBeInTheDocument();
    fireEvent.click(closeModalButton);
    expect(closeModalButton).not.toBeInTheDocument();
  });

  it("check if copy to clipboard is working or not", async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, "writeText");
    render(
      <BrowserRouter>
        <Documentation />
      </BrowserRouter>
    );

    const copyButtons = screen.getAllByAltText("tick-copy-code");
    expect(copyButtons.length).toBeLessThanOrEqual(
      DOCUMENTATION.apiDocs.length
    );
    const firstCopyButton = copyButtons[0];
    await userEvent.click(firstCopyButton);

    const javascripteCode = DOCUMENTATION.apiDocs[0].codeExample["javascript"];
    expect(clipboardSpy).toHaveBeenCalledWith(javascripteCode);
  });
});
