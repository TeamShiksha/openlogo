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
import Dropdown from "../../../src/components/common/dropdown/Dropdown";

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  clearToast: vi.fn(),
  addToast: vi.fn(),
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
    const adminUserContext = mockUserContext(
      { ...MOCK_USER_DATA, role: "ADMIN" },
      false
    );
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <UserContext.Provider value={adminUserContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    const dropdown = await screen.findByTestId("testid-dropdown");
    const options = within(dropdown).getAllByRole("option");
    expect(options.map((opt) => opt.value)).toEqual([
      "ADMIN",
      "OPERATOR",
      "USER",
    ]);
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
    const operatorUserContext = mockUserContext(
      { ...MOCK_USER_DATA, role: "OPERATOR" },
      false
    );
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <UserContext.Provider value={operatorUserContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    const dropdown = await screen.findByTestId("testid-dropdown");
    const options = within(dropdown).getAllByRole("option");
    expect(options.map((opt) => opt.value)).toEqual(["OPERATOR", "USER"]);
    expect(dropdown.value).toBe("USER");
    fireEvent.change(dropdown, { target: { value: "OPERATOR" } });
    await waitFor(() => {
      expect(dropdown.value).toBe("OPERATOR");
      const operatorDashboard = screen.getByTestId("testid-operator-dashboard");
      expect(operatorDashboard).toBeInTheDocument();
    });
  });

  it("should not render dashboard dropdown if user role is USER", () => {
    const userContext = mockUserContext(
      { ...MOCK_USER_DATA, role: "USER" },
      false
    );
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <UserContext.Provider value={userContext}>
            <Dashboard />
          </UserContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    );

    const dropdown = screen.queryByTestId("testid-dropdown");
    expect(dropdown).not.toBeInTheDocument();
    const dashboard = screen.getByTestId("testid-dashboard");
    expect(dashboard).toBeInTheDocument();
  });

  it("should render nothing if options array is empty", () => {
    render(
      <Dropdown options={[]} selectedOption="" setSelectedOption={vi.fn()} />
    );

    expect(screen.getByTestId("testid-dropdown").children.length).toBe(0);
  });

  it("should render all provided options", () => {
    const options = ["ADMIN", "USER", "OPERATOR"];
    render(
      <Dropdown
        options={options}
        selectedOption="USER"
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    const renderedOptions = within(dropdown).getAllByRole("option");
    expect(renderedOptions).toHaveLength(options.length);
    expect(renderedOptions.map((opt) => opt.value)).toEqual(options);
  });

  it("should display options in uppercase", () => {
    const options = ["admin", "user"];
    render(
      <Dropdown
        options={options}
        selectedOption="user"
        setSelectedOption={vi.fn()}
      />
    );

    const renderedOptions = screen.getAllByRole("option");
    expect(renderedOptions.map((opt) => opt.textContent)).toEqual([
      "ADMIN",
      "USER",
    ]);
  });

  it("should set selected option based on selectedOption prop", () => {
    render(
      <Dropdown
        options={["ADMIN", "USER"]}
        selectedOption="ADMIN"
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    expect(dropdown.value).toBe("ADMIN");
  });

  it("should call setSelectedOption function in case of onChange event", () => {
    const mockSetSelectedOption = vi.fn();
    render(
      <Dropdown
        options={["ADMIN", "USER"]}
        selectedOption="ADMIN"
        setSelectedOption={mockSetSelectedOption}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    fireEvent.change(dropdown, { target: { value: "USER" } });

    expect(mockSetSelectedOption).toHaveBeenCalledWith("USER");
  });

  it("should handle undefined options without crashing", () => {
    render(
      <Dropdown
        options={undefined}
        selectedOption=""
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    expect(dropdown.children.length).toBe(0);
  });

  it("should focusable and allows keyboard interaction", () => {
    render(
      <Dropdown
        options={["ADMIN", "USER"]}
        selectedOption="USER"
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    dropdown.focus();
    expect(dropdown).toHaveFocus();
  });

  it("should render options with special characters", () => {
    const options = ["@dm!n", "us3r_1"];
    render(
      <Dropdown
        options={options}
        selectedOption="us3r_1"
        setSelectedOption={vi.fn()}
      />
    );

    const renderedOptions = screen.getAllByRole("option");
    expect(renderedOptions.map((opt) => opt.value)).toEqual([
      "@dm!n",
      "us3r_1",
    ]);
  });
  it("should call fetchUserData only once", () => {
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

    expect(userContext.fetchUserData).toHaveBeenCalledTimes(1);
  });

  it("should show empty message if user has no API keys", async () => {
    const userWithoutKeys = {
      ...MOCK_USER_DATA,
      keys: [],
    };

    const userContext = mockUserContext(userWithoutKeys, false);
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
      expect(screen.getByTestId("empty-api-message")).toHaveTextContent(
        API_KEY_TABLE.emptyMessage
      );
    });
  });

  it("should not allow delete if confirmation input does not match", async () => {
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

    const deleteButtons = await screen.findAllByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    fireEvent.click(deleteButtons[0]);
    screen.debug();
    const modal = await screen.findByTestId("confirmation-modal");
    const confirmInput = within(modal).getByTestId("api-key-confirm-input");
    expect(confirmInput).toBeInTheDocument();

    fireEvent.change(confirmInput, {
      target: { value: "incorrect-key" },
    });

    const confirmButton = within(modal).getByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    expect(confirmButton).toBeDisabled();
  });
});

it("should not crash if selectedOption is not in options", () => {
  expect(() => {
    render(
      <Dropdown
        options={["ADMIN", "USER"]}
        selectedOption="GUEST"
        setSelectedOption={vi.fn()}
      />
    );
  }).not.toThrow();
});
