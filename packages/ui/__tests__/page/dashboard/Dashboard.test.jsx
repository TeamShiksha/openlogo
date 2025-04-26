import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
import { UserContext } from "../../../src/contexts/Contexts";
import Dashboard from "../../../src/page/dashboard/Dashboard";
import { BUTTON_TEXT } from "../../../src/utils/Constants";
import { formatDate } from "../../../src/utils/Helpers";

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
      // api key table headers
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Created")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      // api key table contents
      mockUserData.keys.forEach(({ key_description, updated_at }) => {
        const row = screen.getByText(key_description).closest("tr");
        expect(within(row).getByText(key_description)).toBeInTheDocument();
        expect(
          within(row).getByText(formatDate(updated_at))
        ).toBeInTheDocument();
        const deleteBtn = within(row).getByRole("button", {
          name: BUTTON_TEXT.delete,
        });
        fireEvent.click(deleteBtn);
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
      expect(screen.getByTestId("testid-dashboard")).toBeInTheDocument();
      expect(screen.getByText("Usage")).toBeInTheDocument();
      expect(screen.getByText("Generate New API Key")).toBeInTheDocument();
      expect(screen.getByText("Plan")).toBeInTheDocument();
      expect(screen.getByText("User Info")).toBeInTheDocument();
      expect(screen.getByText("Change Password")).toBeInTheDocument();
      expect(screen.getByText("Setting")).toBeInTheDocument();
      // Checking table headers & empty body message
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Created")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your api keys will be visible here, click on generate key to add new api key"
        )
      ).toBeInTheDocument();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });
});
