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

vi.mock("../../src/hooks/useApi.js", () => ({
  useApi: vi.fn(() => ({
    makeRequest: vi.fn(),
    errorMsg: null,
  })),
}));

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
  setUserData: vi.fn(),
});

const mockAuthContext = (isAuthenticated = true, logout = vi.fn()) => ({
  isAuthenticated,
  logout,
});

const renderDashboard = ({
  userContextValue,
  authContextValue = mockAuthContext(true),
  toastContextValue = mockToastContext,
} = {}) => {
  return render(
    <ToastContext.Provider value={toastContextValue}>
      <AuthContext.Provider value={authContextValue}>
        <UserContext.Provider value={userContextValue}>
          <Dashboard />
        </UserContext.Provider>
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
};

const renderDropdown = ({
  options = [],
  selectedOption = "",
  setSelectedOption = vi.fn(),
} = {}) => {
  render(
    <Dropdown
      options={options}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
    />
  );
  return {
    dropdown: screen.getByTestId("testid-dropdown"),
    setSelectedOption,
  };
};

const renderDropdown_add = ({
  options = ["ADMIN", "USER"],
  selectedOption = "USER",
  setSelectedOption = vi.fn(),
} = {}) =>
  render(
    <Dropdown
      options={options}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
    />
  );

describe("Dashboard", () => {
  it("should render loading text when loading is true", () => {
    const userContext = mockUserContext(null, true);
    renderDashboard({ userContextValue: userContext });

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render dashboard with user data when loading is false", async () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    renderDashboard({ userContextValue: userContext });

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
    renderDashboard({ userContextValue: userContext });
    await waitFor(() => {
      const emptyMessage = screen.getByText(API_KEY_TABLE.emptyMessage);
      expect(emptyMessage).toBeInTheDocument();
    });

    expect(userContext.fetchUserData).toHaveBeenCalled();
  });

  it("should render logout button if user is authenticated and user data exists", () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    renderDashboard({ userContextValue: userContext });
    const logoutButton = screen.getByText(BUTTON_TEXT.signOut);
    expect(logoutButton).toBeInTheDocument();
  });

  it("should not render logout button if user is not authenticated or user data is null", () => {
    const userContext = mockUserContext(null, false);
    const authContext = {
      isAuthenticated: false,
      logout: vi.fn(),
    };
    renderDashboard({
      userContextValue: userContext,
      authContextValue: authContext,
    });
    const logoutButton = screen.queryByText(BUTTON_TEXT.signOut);
    expect(logoutButton).not.toBeInTheDocument();
  });

  it("should call logout function when logout button is clicked", () => {
    const logoutMock = vi.fn();
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    const authContext = mockAuthContext(true, logoutMock);
    renderDashboard({
      userContextValue: userContext,
      authContextValue: authContext,
    });
    const logoutButton = screen.getByText(BUTTON_TEXT.signOut);
    fireEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalled();
  });

  it("should allow ADMIN to switch between ADMIN, OPERATOR, and USER dashboards", async () => {
    const adminUserContext = mockUserContext(
      { ...MOCK_USER_DATA, role: "ADMIN" },
      false
    );
    renderDashboard({ userContextValue: adminUserContext });
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
    renderDashboard({ userContextValue: operatorUserContext });
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
    renderDashboard({ userContextValue: userContext });
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
    renderDropdown({ options, selectedOption: "USER" });
    const dropdown = screen.getByTestId("testid-dropdown");
    const renderedOptions = within(dropdown).getAllByRole("option");
    expect(renderedOptions).toHaveLength(options.length);
    expect(renderedOptions.map((opt) => opt.value)).toEqual(options);
  });

  it("should display options in uppercase", () => {
    const options = ["admin", "user"];
    renderDropdown({ options, selectedOption: "user" });
    const renderedOptions = screen.getAllByRole("option");
    expect(renderedOptions.map((opt) => opt.textContent)).toEqual([
      "ADMIN",
      "USER",
    ]);
  });

  it("should set selected option based on selectedOption prop", () => {
    const { dropdown } = renderDropdown({
      options: ["ADMIN", "USER"],
      selectedOption: "ADMIN",
    });
    expect(dropdown.value).toBe("ADMIN");
  });

  it("should call setSelectedOption function in case of onChange event", () => {
    const mockSetSelectedOption = vi.fn();
    const { dropdown } = renderDropdown({
      options: ["ADMIN", "USER"],
      selectedOption: "ADMIN",
      setSelectedOption: mockSetSelectedOption,
    });
    fireEvent.change(dropdown, { target: { value: "USER" } });
    expect(mockSetSelectedOption).toHaveBeenCalledWith("USER");
  });

  it("should handle undefined options without crashing", () => {
    const { dropdown } = renderDropdown({
      options: undefined,
      selectedOption: "",
    });
    expect(dropdown.children.length).toBe(0);
  });

  it("should focusable and allows keyboard interaction", () => {
    const { dropdown } = renderDropdown({
      options: ["ADMIN", "USER"],
      selectedOption: "USER",
    });
    dropdown.focus();
    expect(dropdown).toHaveFocus();
  });

  it("should render options with special characters", () => {
    const options = ["@dm!n", "us3r_1"];
    renderDropdown({ options, selectedOption: "us3r_1" });
    const renderedOptions = screen.getAllByRole("option");
    expect(renderedOptions.map((opt) => opt.value)).toEqual([
      "@dm!n",
      "us3r_1",
    ]);
  });

  it("should call fetchUserData only once", () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    renderDashboard({ userContextValue: userContext });
    expect(userContext.fetchUserData).toHaveBeenCalledTimes(1);
  });

  it("should show empty message if user has no API keys", async () => {
    const userWithoutKeys = { ...MOCK_USER_DATA, keys: [] };
    const userContext = mockUserContext(userWithoutKeys, false);
    renderDashboard({ userContextValue: userContext });
    await waitFor(() => {
      expect(screen.getByTestId("empty-api-message")).toHaveTextContent(
        API_KEY_TABLE.emptyMessage
      );
    });
  });

  it("should not crash if selectedOption is not in options", () => {
    expect(() => {
      renderDropdown_add({ selectedOption: "GUEST" });
    }).not.toThrow();
  });
});

describe("API Key Deletion", () => {
  it("opens confirmation modal on delete button click", async () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    renderDashboard({ userContextValue: userContext });
    const deleteButtons = await screen.findAllByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    fireEvent.click(deleteButtons[0]);

    const modal = await screen.findByTestId("delete-api-key-modal");
    expect(modal).toBeInTheDocument();
  });

  it("disables confirm button if ApiKeyName does not match", async () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    renderDashboard({ userContextValue: userContext });
    const deleteButtons = await screen.findAllByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    fireEvent.click(deleteButtons[0]);

    const modal = await screen.findByTestId("delete-api-key-modal");
    const input = within(modal).getByTestId("api-key-confirm-input");
    fireEvent.change(input, { target: { value: "Wrong_Key_Name" } });

    const confirmButton = within(modal).getByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    expect(confirmButton).toBeDisabled();
  });

  it("enables confirm button if ApiKeyName matches", async () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    renderDashboard({ userContextValue: userContext });
    const deleteButtons = await screen.findAllByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    fireEvent.click(deleteButtons[0]);

    const modal = await screen.findByTestId("delete-api-key-modal");
    const keyDescriptionEl = within(modal).getByText((_, element) => {
      return element?.tagName === "STRONG";
    });

    const keyDescription = keyDescriptionEl.textContent.trim();
    const input = within(modal).getByTestId("api-key-confirm-input");
    fireEvent.change(input, { target: { value: keyDescription } });

    const confirmButton = within(modal).getByRole("button", {
      name: BUTTON_TEXT.delete,
    });

    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });
  });

  it.skip("calls API and closes modal on successful deletion", async () => {
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    const mockFetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    globalThis.fetch = mockFetch;
    renderDashboard({ userContextValue: userContext });
    const deleteButtons = await screen.findAllByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    fireEvent.click(deleteButtons[0]);

    const modal = await screen.findByTestId("delete-api-key-modal");
    const input = within(modal).getByTestId("api-key-confirm-input");
    fireEvent.change(input, {
      target: { value: MOCK_USER_DATA.keys[0].key_description },
    });
    const confirmButton = within(modal).getByRole("button", {
      name: BUTTON_TEXT.delete,
    });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(
        screen.queryByTestId("delete-api-key-modal")
      ).not.toBeInTheDocument();
      expect(mockToastContext.success).toHaveBeenCalled();
    });
  });
});
