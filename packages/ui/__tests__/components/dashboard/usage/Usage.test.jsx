import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Usage from "../../../../src/components/dashboard/usage/Usage";

const mockUsageProps = {
  usageCount: 25,
  usageLimit: 100,
};

describe("Usage Component", () => {
  it("Should show correct usage count, usage limit", () => {
    render(<Usage {...mockUsageProps} />);

    const usageCountText = screen.getByText(mockUsageProps.usageCount);
    const usageLimitText = screen.getByText(mockUsageProps.usageLimit);
    expect(usageCountText).toBeInTheDocument();
    expect(usageLimitText).toBeInTheDocument();
  });

  it("Should render PieGraph with correct percentage", () => {
    const { container } = render(<Usage {...mockUsageProps} />);

    const pieGraph = container.querySelector("svg");
    const usedPercent =
      (mockUsageProps.usageCount / mockUsageProps.usageLimit) * 100;
    const percentageText = screen.getByText(`${usedPercent}%`);
    expect(pieGraph).toBeInTheDocument();
    expect(percentageText).toBeInTheDocument();
  });
});
