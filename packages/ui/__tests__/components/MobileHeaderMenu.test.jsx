import { vi, describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthContext, UserContext } from "../../src/contexts/Contexts";
import { render, screen, within, fireEvent } from "@testing-library/react";
import Documentation from "../../src/page/documentation/Documentation";
import MobileHeaderMenu from "../../src/components/header/MobileHeaderMenu";

const mockCloseMenu = vi.fn();
const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});

const mockUserContext = (userData, loading) => ({
  userData,
  loading,
  fetchUserData: vi.fn(),
});

describe("MobileHeaderMenu Component", () => {
  it("Doesn't render when isOpen = false", () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={false} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const mobileMenu = screen.queryByTestId("mobile-menu");
    expect(mobileMenu).not.toBeInTheDocument();
  });

  it("Does render when isOpen = true and navigation works", () => {
    const authContext = mockAuthContext(true);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
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
    window.innerWidth = 800;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={false} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    window.innerWidth = 1100;
    window.dispatchEvent(new Event("resize"));
    expect(mockCloseMenu).toHaveBeenCalledWith(false);
  });

  it("calls logout function when sign out button is clicked", () => {
    const logoutMock = vi.fn();
    const authContext = {
      isAuthenticated: true,
      logout: logoutMock,
    };
    const userContext = mockUserContext({ role: "USER" }, true);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <UserContext.Provider value={userContext}>
            <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
          </UserContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);
    expect(logoutMock).toHaveBeenCalled();
  });
});
