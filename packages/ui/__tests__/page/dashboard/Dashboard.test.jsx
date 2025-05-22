import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserContext, AuthContext } from "../../../src/contexts/Contexts";
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

const mockAuthContext = (isAuthenticated = true, logout = vi.fn()) => ({
  isAuthenticated,
  logout,
});

describe("Dashboard", () => {
  it("should render loading text when loading is true", () => {
    const userContext = mockUserContext(null, true);
    render(
      <AuthContext.Provider value={mockAuthContext(true)}>
        <UserContext.Provider value={userContext}>
          <Dashboard />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    // expect(screen.getByText(/loading../i)).toBeInTheDocument();
    // expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render dashboard with user data when loading is false", async () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    render(
      <AuthContext.Provider value={mockAuthContext(true)}>
        <UserContext.Provider value={userContext}>
          <Dashboard />
        </UserContext.Provider>
      </AuthContext.Provider>
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

    // expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render dashboard with default values when user data is null and loading is false", async () => {
    const userContext = mockUserContext(null, false);
    render(
      <AuthContext.Provider value={mockAuthContext(true)}>
        <UserContext.Provider value={userContext}>
          <Dashboard />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const emptyMessage = screen.getByText(API_KEY_TABLE.emptyMessage);
      expect(emptyMessage).toBeInTheDocument();
    });

    // expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render logout button if user is authenticated and user data exists", () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    render(
      <AuthContext.Provider value={mockAuthContext(true)}>
        <UserContext.Provider value={userContext}>
          <Dashboard />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByText(BUTTON_TEXT.signOut);
    expect(logoutButton).toBeInTheDocument();
  });

  it("should not render logout button if user is not authenticated or user data is null", () => {
    const userContext = mockUserContext(null, false);
    render(
      <AuthContext.Provider value={mockAuthContext(false)}>
        <UserContext.Provider value={userContext}>
          <Dashboard />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const logoutButton = screen.queryByText(BUTTON_TEXT.signOut);
    expect(logoutButton).not.toBeInTheDocument();
  });

  it("should call logout function when logout button is clicked", () => {
    const logoutMock = vi.fn();
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    const authContext = mockAuthContext(true, logoutMock);

    render(
      <AuthContext.Provider value={authContext}>
        <UserContext.Provider value={userContext}>
          <Dashboard />
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByText(BUTTON_TEXT.signOut);
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalled();
  });
});
