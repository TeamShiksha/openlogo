import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserContext } from "../../../src/contexts/Contexts";
import Dashboard from "../../../src/page/dashboard/Dashboard";
import { API_KEY_TABLE } from "../../../src/utils/Constants";

const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  subscription: {
    usage_count: 42,
    usage_limit: 100,
  },
  keys: [
    {
      key_description: "Testing Environment Key",
      updated_at: "2023-10-30T11:20:00.000Z",
    },
    {
      key_description: "Analytics Service Key",
      updated_at: "2023-11-10T13:10:00.000Z",
    },
  ],
};
const dashboardCardsTitle = [
  "Usage",
  "Generate New API Key",
  "Plan",
  "User Info",
  "Change Password",
  "Setting",
];
const mockUserContext = (userData, loading) => ({
  userData,
  loading,
  fetchUserData: vi.fn(),
});

describe("Dashboard", () => {
  it("should render loading text when loading is true", () => {
    const userContext = mockUserContext(null, true);
    render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    expect(screen.getByText(/loading../i)).toBeInTheDocument();
    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render dashboard with user data when loading is false", async () => {
    const userContext = mockUserContext(mockUserData, false);
    render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      const dashboard = screen.getByTestId("testid-dashboard");
      expect(dashboard).toBeInTheDocument();

      dashboardCardsTitle.map((title) => {
        const titleText = screen.getByText(title);
        expect(titleText).toBeInTheDocument();
      });

      API_KEY_TABLE.headers.map((header) => {
        const headerText = screen.getByText(header);
        expect(headerText).toBeInTheDocument();
      });
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render dashboard with default values when user data is null and loading is false", async () => {
    const userContext = mockUserContext(null, false);
    render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      const emptyMessage = screen.getByText(API_KEY_TABLE.emptyMessage);
      expect(emptyMessage).toBeInTheDocument();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });
});
