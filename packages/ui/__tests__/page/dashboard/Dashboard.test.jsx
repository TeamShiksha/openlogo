import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  UserContext,
  AuthContext,
  ToastContext,
} from "../../../src/contexts/Contexts";
import Dashboard from "../../../src/page/dashboard/Dashboard";
import {
  API_KEY_TABLE,
  BUTTON_TEXT,
  DASHBOARD_CARDS_TITLE,
  MOCK_USER_DATA,
} from "../../../src/utils/Constants";
import { ToastProvider } from "../../../src/contexts/Contexts";

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  clearToast: vi.fn(),
};

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
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <UserContext.Provider value={userContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    const loading = screen.getByText(/loading../i);
    expect(loading).toBeInTheDocument();
    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render dashboard with user data when loading is false", async () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <UserContext.Provider value={userContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
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
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <UserContext.Provider value={userContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    await waitFor(() => {
      const emptyMessage = screen.getByText(API_KEY_TABLE.emptyMessage);
      expect(emptyMessage).toBeInTheDocument();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render logout button if user is authenticated and user data exists", () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <UserContext.Provider value={userContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    const logoutButton = screen.getByText(BUTTON_TEXT.signOut);
    expect(logoutButton).toBeInTheDocument();
  });

  it("should not render logout button if user is not authenticated or user data is null", () => {
    const userContext = mockUserContext(null, false);
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(false)}>
          <UserContext.Provider value={userContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    const logoutButton = screen.queryByText(BUTTON_TEXT.signOut);
    expect(logoutButton).not.toBeInTheDocument();
  });

  it("should call logout function when logout button is clicked", () => {
    const logoutMock = vi.fn();
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    const authContext = mockAuthContext(true, logoutMock);
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={authContext}>
          <UserContext.Provider value={userContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    const logoutButton = screen.getByText(BUTTON_TEXT.signOut);
    fireEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalled();
  });

  it("should allow ADMIN to switch between ADMIN, OPERATOR, and USER dashboards", async () => {
    const adminUserContext = mockUserContext({ ...MOCK_USER_DATA, role: "ADMIN" }, false);
    render(
      <AuthContext.Provider value={mockAuthContext(true)}>
        <UserContext.Provider value={adminUserContext}>
          <ToastProvider>
            <Dashboard />
          </ToastProvider>
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const dropdown = await screen.findByTestId("testid-dashboard-dropdown");
    const options = within(dropdown).getAllByRole("option");
    expect(options.map(opt => opt.value)).toEqual(["ADMIN", "OPERATOR", "USER"]);
    expect(dropdown.value).toBe("USER");
    fireEvent.change(dropdown, { target: { value: "OPERATOR" } });

    await waitFor(() => {
      expect(dropdown.value).toBe("OPERATOR");
      const operatorDashboard = screen.getByTestId("testid-operator-dashboard");
      expect(operatorDashboard).toBeInTheDocument();
    });

    fireEvent.change(dropdown, { target: { value: "ADMIN" } });
    await waitFor(() => {
      expect(dropdown.value).toBe("ADMIN");
      const adminDashboard = screen.getByTestId("testid-admin-dashboard");
      expect(adminDashboard).toBeInTheDocument();
    });
  });

  it("should allow OPERATOR to switch between OPERATOR and USER dashboards", async () => {
    const operatorUserContext = mockUserContext({ ...MOCK_USER_DATA, role: "OPERATOR" }, false);
    render(
      <AuthContext.Provider value={mockAuthContext(true)}>
        <UserContext.Provider value={operatorUserContext}>
          <ToastProvider>
            <Dashboard />
          </ToastProvider>
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const dropdown = await screen.findByTestId("testid-dashboard-dropdown");
    const options = within(dropdown).getAllByRole("option");
    expect(options.map(opt => opt.value)).toEqual(["OPERATOR", "USER"]);
    expect(dropdown.value).toBe("USER");
    fireEvent.change(dropdown, { target: { value: "OPERATOR" } });
    await waitFor(() => {
      expect(dropdown.value).toBe("OPERATOR");
      const operatorDashboard = screen.getByTestId("testid-operator-dashboard");
      expect(operatorDashboard).toBeInTheDocument();
    });
  });

  it("should not render dashboard dropdown if user role is USER", () => {
    const userContext = mockUserContext({ ...MOCK_USER_DATA, role: "USER" }, false);
    render(
      <AuthContext.Provider value={mockAuthContext(true)}>
        <UserContext.Provider value={userContext}>
          <ToastProvider>
            <Dashboard />
          </ToastProvider>
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const dashboarDropdown = screen.getByTestId("testid-dashboard-dropdown");
    expect(dashboarDropdown).not.toBeInTheDocument();
    const dashboard = screen.getByTestId("testid-dashboard");
    expect(dashboard).toBeInTheDocument();
  });
});
