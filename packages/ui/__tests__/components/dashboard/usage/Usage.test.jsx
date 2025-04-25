import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Usage from "../../../../src/components/dashboard/usage/Usage";

const mockUserData = {
  usage_count: 25,
  usage_limit: 100,
};

describe("Usage Component", () => {
  it("Should show correct usage count, usage limit", () => {
    render(
      <Usage
        usageCount={mockUserData.usage_count}
        usageLimit={mockUserData.usage_limit}
      />
    );

    const usageCountText = screen.getByText(mockUserData.usage_count);
    const usageLimitText = screen.getByText(mockUserData.usage_limit);
    expect(usageCountText).toBeInTheDocument();
    expect(usageLimitText).toBeInTheDocument();
  });

  it("Should render PieGraph with correct percentage", () => {
    const { container } = render(
      <Usage
        usageCount={mockUserData.usage_count}
        usageLimit={mockUserData.usage_limit}
      />
    );

    const pieGraph = container.querySelector("svg");
    const usedPercent =
      (mockUserData.usage_count / mockUserData.usage_limit) * 100;
    const percentageText = screen.getByText(`${usedPercent}%`);
    expect(pieGraph).toBeInTheDocument();
    expect(percentageText).toBeInTheDocument();
  });
});
