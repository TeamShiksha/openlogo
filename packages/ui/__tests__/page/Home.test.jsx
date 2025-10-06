import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import {
  AuthContext,
  ToastContext,
  UserContext,
} from "../../src/contexts/Contexts";
import Home from "../../src/page/home/Home";
import { BUTTON_TEXT, MOCK_USER_DATA } from "../../src/utils/Constants";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));
const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});
const mockUserContext = (userData, loading) => ({
  userData,
  loading,
  fetchUserData: vi.fn(),
});
const mockOpenAuthModel = vi.fn();

describe("Home Page", () => {
  it("renders home page", () => {
    const authContext = mockAuthContext(false);
    const userContext = mockUserContext(null, false);
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockAuthContext}>
          <AuthContext.Provider value={authContext}>
            <UserContext.Provider value={userContext}>
              <Home openAuthModal={mockOpenAuthModel} />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );
  });

  it("when logged out: shows get started button & opens auth model on click", () => {
    const authContext = mockAuthContext(false);
    const userContext = mockUserContext(null, false);
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockAuthContext}>
          <AuthContext.Provider value={authContext}>
            <UserContext.Provider value={userContext}>
              <Home openAuthModal={mockOpenAuthModel} />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const getStartedButtons = screen.getAllByRole("button", {
      name: BUTTON_TEXT.getStarted,
    });
    fireEvent.click(getStartedButtons[0]);

    expect(mockOpenAuthModel).toHaveBeenCalled();
  });

  it("renders home page when user is logged in & is go to dashboard button works", async () => {
    const authContext = mockAuthContext(true);
    const userContext = mockUserContext(MOCK_USER_DATA, false);
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockAuthContext}>
          <AuthContext.Provider value={authContext}>
            <UserContext.Provider value={userContext}>
              <Home openAuthModal={mockOpenAuthModel} />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const heroSectionPrimaryBtn = screen.getByRole("button", {
      name: BUTTON_TEXT.gotoDashboard,
    });
    fireEvent.click(heroSectionPrimaryBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
