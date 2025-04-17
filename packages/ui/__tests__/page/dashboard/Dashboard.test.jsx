import { render, screen } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import { UserContext } from "../../../src/contexts/Contexts";
import Dashboard from "../../../src/page/dashboard/Dashboard";

const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  subscription: {
    usage_count: 42,
    usage_limit: 100,
  },
};

describe("Dashboard", () => {
  it("should render loading when loading is true", () => {
    render(
      <UserContext.Provider value={{ userData: null, loading: true }}>
        <Dashboard />
      </UserContext.Provider>
    );

    expect(screen.getByText(/loading../i)).toBeInTheDocument();
  });

  it("should render dashboard with user data when loading is false", () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: false }}>
        <Dashboard />
      </UserContext.Provider>
    );

    expect(screen.getByTestId("testid-dashboard")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
    expect(screen.getByText("Generate New API Key")).toBeInTheDocument();
    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("User Info")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByText("Setting")).toBeInTheDocument();
  });
});
