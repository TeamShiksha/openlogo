import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserContext } from "../../../../src/contexts/Contexts";
import Usage from "../../../../src/components/dashboard/usage/Usage";

const mockUserData = {
  subscription: {
    usage_count: 25,
    usage_limit: 100,
  },
};

describe("Usage Component", () => {
  it("Should show loading values when loading is true", () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: true }}>
        <Usage />
      </UserContext.Provider>
    );

    const loadingText = screen.getByText("loading...");
    expect(loadingText).toBeInTheDocument();
  });

  it("Should show correct usage count, usage limit", () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: false }}>
        <Usage />
      </UserContext.Provider>
    );

    const usageCountText = screen.getByText(
      mockUserData.subscription.usage_count
    );
    const usageLimitText = screen.getByText(
      mockUserData.subscription.usage_limit
    );
    expect(usageCountText).toBeInTheDocument();
    expect(usageLimitText).toBeInTheDocument();
  });

  it("Should render PieGraph with correct percentage", () => {
    const { container } = render(
      <UserContext.Provider value={{ userData: mockUserData, loading: false }}>
        <Usage />
      </UserContext.Provider>
    );

    const pieGraph = container.querySelector("svg");
    const usedPercent =
      (mockUserData.subscription.usage_count /
        mockUserData.subscription.usage_limit) *
      100;
    const percentageText = screen.getByText(`${usedPercent}%`);
    expect(pieGraph).toBeInTheDocument();
    expect(percentageText).toBeInTheDocument();
  });
});
