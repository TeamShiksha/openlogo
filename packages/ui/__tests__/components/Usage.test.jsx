import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Usage from "../../src/components/usage/Usage";
import { MOCK_USER_DATA } from "../../src/utils/Constants";

describe("Usage Component", () => {
  it("Should show correct usage count, usage limit", () => {
    render(
      <Usage
        usageCount={MOCK_USER_DATA.subscription.usage_count}
        usageLimit={MOCK_USER_DATA.subscription.usage_limit}
      />
    );

    const usageCountText = screen.getByText(
      MOCK_USER_DATA.subscription.usage_count
    );
    const usageLimitText = screen.getByText(
      MOCK_USER_DATA.subscription.usage_limit
    );
    expect(usageCountText).toBeInTheDocument();
    expect(usageLimitText).toBeInTheDocument();
  });

  it("Should render PieGraph with correct percentage", () => {
    const { container } = render(
      <Usage
        usageCount={MOCK_USER_DATA.subscription.usage_count}
        usageLimit={MOCK_USER_DATA.subscription.usage_limit}
      />
    );

    const pieGraph = container.querySelector("svg");
    const usedPercent =
      (MOCK_USER_DATA.subscription.usage_count /
        MOCK_USER_DATA.subscription.usage_limit) *
      100;
    const percentageText = screen.getByText(`${usedPercent}%`);
    expect(pieGraph).toBeInTheDocument();
    expect(percentageText).toBeInTheDocument();
  });
});
