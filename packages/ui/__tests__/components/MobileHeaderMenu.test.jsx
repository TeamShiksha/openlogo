import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthContext, UserContext } from "../../src/contexts/Contexts";
import { render, screen, within, fireEvent } from "@testing-library/react";
import Documentation from "../../src/page/documentation/Documentation";
import MobileHeaderMenu from "../../src/components/header/MobileHeaderMenu";

const mockCloseMenu = vi.fn();

const mockAuthContext = (isAuthenticated, logout = vi.fn()) => ({
  isAuthenticated,
  logout,
});

const mockUserContext = (userData = null, setUserData = vi.fn()) => ({
  userData,
  setUserData,
});

const mockUserData = {
  email: "test@example.com",
  name: "Test User",
};

describe("MobileHeaderMenu Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Doesn't render when isOpen = false", () => {
    const authContext = mockAuthContext(false);
    const userContext = mockUserContext(mockUserData);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <UserContext.Provider value={userContext}>
            <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={false} />
          </UserContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const mobileMenu = screen.queryByTestId("mobile-menu");
    expect(mobileMenu).not.toBeInTheDocument();
  });

  it("Does render when isOpen = true and navigation works", () => {
    const authContext = mockAuthContext(true);
    const userContext = mockUserContext(mockUserData);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <UserContext.Provider value={userContext}>
            <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
          </UserContext.Provider>
        </AuthContext.Provider>
        <Documentation />
      </BrowserRouter>
    );

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();
    const docsNavigation = within(mobileMenu).getByText("Docs");
    expect(docsNavigation).toBeInTheDocument();
    fireEvent.click(docsNavigation);
    expect(window.location.pathname).toBe("/docs");
  });

  it("calls closeMenu when screen width exceeds 1024px", () => {
    const authContext = mockAuthContext(false);
    const userContext = mockUserContext(mockUserData);
    window.innerWidth = 800;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <UserContext.Provider value={userContext}>
            <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={false} />
          </UserContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    window.innerWidth = 1100;
    window.dispatchEvent(new Event("resize"));
    expect(mockCloseMenu).toHaveBeenCalledWith(false);
  });

  it("calls logout, clears user data, and closes menu on Sign Out", () => {
    const mockLogout = vi.fn();
    const mockSetUserData = vi.fn();

    const authContext = mockAuthContext(true, mockLogout);
    const userContext = mockUserContext(mockUserData, mockSetUserData);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <UserContext.Provider value={userContext}>
            <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
          </UserContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const logoutBtn = screen.getByRole("button", { name: "Sign Out" });
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockSetUserData).toHaveBeenCalledWith(null);
    expect(mockCloseMenu).toHaveBeenCalledWith(false);
  });
});
