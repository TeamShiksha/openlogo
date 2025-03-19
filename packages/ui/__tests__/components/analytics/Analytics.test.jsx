import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Analytics from "../../../src/components/analytics/Analytics";
import { INFO } from "../../../src/utils/Constants";

describe("Analytics component", () => {
  it("renders correct number of AnalyticsCard components ", () => {
    render(<Analytics />);

    INFO.forEach((item) => {
      const titleElement = screen.getByText(item.title);

      expect(titleElement).toBeInTheDocument();
    });
  });
});
