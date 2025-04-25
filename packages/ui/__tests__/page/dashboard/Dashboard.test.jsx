import { render, screen, waitFor } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
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
    const doc = render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(doc.getByTestId("testid-dashboard")).toBeInTheDocument();
      expect(doc.getByText("Usage")).toBeInTheDocument();
      expect(doc.getByText("Generate New API Key")).toBeInTheDocument();
      expect(doc.getByText("Plan")).toBeInTheDocument();
      expect(doc.getByText("User Info")).toBeInTheDocument();
      expect(doc.getByText("Change Password")).toBeInTheDocument();
      expect(doc.getByText("Setting")).toBeInTheDocument();
      // Checking table headers
      expect(doc.getByText("Description")).toBeInTheDocument();
      expect(doc.getByText("Created")).toBeInTheDocument();
      expect(doc.getByText("Action")).toBeInTheDocument();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render dashboard with default values when user data is null and loading is false", async () => {
    const userContext = mockUserContext(null, false);
    const doc = render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(doc.getByTestId("testid-dashboard")).toBeInTheDocument();
      expect(doc.getByText("Usage")).toBeInTheDocument();
      expect(doc.getByText("Generate New API Key")).toBeInTheDocument();
      expect(doc.getByText("Plan")).toBeInTheDocument();
      expect(doc.getByText("User Info")).toBeInTheDocument();
      expect(doc.getByText("Change Password")).toBeInTheDocument();
      expect(doc.getByText("Setting")).toBeInTheDocument();
      // Checking table headers
      expect(doc.getByText("Description")).toBeInTheDocument();
      expect(doc.getByText("Created")).toBeInTheDocument();
      expect(doc.getByText("Action")).toBeInTheDocument();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });
});
