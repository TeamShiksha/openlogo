import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPolicy from "../../src/page/privacypolicy/PrivacyPolicy";
import { PRIVACY_AND_TERMS } from "../../src/utils/Constants";

describe("PrivacyPolicy Component", () => {
  it("renders all text", () => {
    render(<PrivacyPolicy />);

    PRIVACY_AND_TERMS.forEach((policyItem) => {
      const headingText = screen.getByText(policyItem.HEADLINE);
      expect(headingText).toBeInTheDocument();
      policyItem.TEXTS.forEach((text) => {
        const paragraphText = screen.getByText(text);
        expect(paragraphText).toBeInTheDocument();
      });
    });
  });
});
