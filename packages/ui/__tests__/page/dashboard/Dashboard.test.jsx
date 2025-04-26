import { render, screen, waitFor } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
import { UserContext } from "../../../src/contexts/Contexts";
import Dashboard from "../../../src/page/dashboard/Dashboard";
import { BUTTON_TEXT } from "../../../src/utils/Constants";

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
    render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("testid-dashboard")).toBeInTheDocument();
      expect(screen.getByText("Usage")).toBeInTheDocument();
      expect(screen.getByText("Generate New API Key")).toBeInTheDocument();
      expect(screen.getByText("Plan")).toBeInTheDocument();
      expect(screen.getByText("User Info")).toBeInTheDocument();
      expect(screen.getByText("Change Password")).toBeInTheDocument();
      expect(screen.getByText("Setting")).toBeInTheDocument();
      // Checking table headers
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Created")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
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
      expect(screen.getByTestId("testid-dashboard")).toBeInTheDocument();
      expect(screen.getByText("Usage")).toBeInTheDocument();
      expect(screen.getByText("Generate New API Key")).toBeInTheDocument();
      expect(screen.getByText("Plan")).toBeInTheDocument();
      expect(screen.getByText("User Info")).toBeInTheDocument();
      expect(screen.getByText("Change Password")).toBeInTheDocument();
      expect(screen.getByText("Setting")).toBeInTheDocument();
      // Checking table headers
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Created")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("renders api key table & is delete button clickable", async () => {
    const userContext = mockUserContext(null, false);
    render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      const deleteApiKeyBtns = screen.getAllByRole("button", {
        name: BUTTON_TEXT.delete,
      });
      deleteApiKeyBtns[0].click();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });
});
