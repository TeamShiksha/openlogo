import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserContext } from "../../../src/contexts/Contexts";
import Dashboard from "../../../src/page/dashboard/Dashboard";
import {
  API_KEY_TABLE,
  BUTTON_TEXT,
  DASHBOARD_CARDS_TITLE,
  MOCK_USER_DATA,
} from "../../../src/utils/Constants";

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
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    render(
      <UserContext.Provider value={userContext}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(async () => {
      const dashboard = screen.getByTestId("testid-dashboard");
      expect(dashboard).toBeInTheDocument();

      DASHBOARD_CARDS_TITLE.forEach((title) => {
        const titleText = screen.getByText(title);
        expect(titleText).toBeInTheDocument();
      });

      API_KEY_TABLE.headers.forEach((header) => {
        const headerText = screen.getByText(header);
        expect(headerText).toBeInTheDocument();
      });

      const apiKeyTable = screen
        .getByText(API_KEY_TABLE.headers[0])
        .closest("table");
      const deleteButtons = await within(apiKeyTable).findAllByRole("button", {
        name: BUTTON_TEXT.delete,
      });
      fireEvent.click(deleteButtons[0]);
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
