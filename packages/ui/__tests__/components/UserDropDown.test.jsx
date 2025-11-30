import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import UserDropDown from "../../src/components/dropdown/UserDropDown.jsx";
import { AuthContext, UserContext } from "../../src/contexts/Contexts";
import { MemoryRouter } from "react-router-dom";
import { BUTTON_TEXT } from "../../src/utils/Constants";

describe("UserDropDown Component", () => {
  const mockLogout = vi.fn();
  const mockSetUserData = vi.fn();
  const mockFetchUserData = vi.fn();
  const mockUserData = { email: "test@example.com" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = ({
    userData = mockUserData,
    isAuthenticated = true,
    fetchUserData = mockFetchUserData,
  } = {}) =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ logout: mockLogout, isAuthenticated }}>
          <UserContext.Provider
            value={{ userData, setUserData: mockSetUserData, fetchUserData }}
          >
            <UserDropDown />
          </UserContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

  it("renders profile button with user initial", () => {
    renderComponent();
    const userInitial = mockUserData.email[0].toUpperCase();
    const button = screen.getByRole("button", { name: userInitial });
    expect(button).toBeInTheDocument();
  });

  it("toggles dropdown on button click", () => {
    renderComponent();
    const userInitial = mockUserData.email[0].toUpperCase();
    const button = screen.getByRole("button", { name: userInitial });

    fireEvent.click(button);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BUTTON_TEXT.signOut })
    ).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: BUTTON_TEXT.signOut })
    ).not.toBeInTheDocument();
  });

  it("calls logout and clears user data on logout click", async () => {
    renderComponent();
    const userInitial = mockUserData.email[0].toUpperCase();
    const button = screen.getByRole("button", { name: userInitial });

    fireEvent.click(button);

    const logoutBtn = screen.getByRole("button", { name: BUTTON_TEXT.signOut });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockSetUserData).toHaveBeenCalledWith(null);
    });
  });

  it("fetche user data when authenticated but userData is null", async () => {
    renderComponent({
      isAuthenticated: true,
      userData: null,
      fetchUserData: mockFetchUserData,
    });
    await waitFor(() => {
      expect(mockFetchUserData).toHaveBeenCalled();
    });
  });

  it("closes dropdown when clicking outside", () => {
    renderComponent();
    const userInitial = mockUserData.email[0].toUpperCase();
    const button = screen.getByRole("button", { name: userInitial });
    fireEvent.click(button);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("applies active class on Dashboard route", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { pathname: "/dashboard" },
    });

    renderComponent();

    const userInitial = mockUserData.email[0].toUpperCase();
    const button = screen.getByRole("button", { name: userInitial });

    fireEvent.click(button);

    const dashboardLink = screen.getByText("Dashboard");

    expect(dashboardLink.className).toContain("active");
  });

  it("calls logout when clicking Sign Out", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", { name: mockUserData.email[0].toUpperCase() })
    );

    const logoutBtn = screen.getByRole("button", { name: BUTTON_TEXT.signOut });

    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
  });
});
