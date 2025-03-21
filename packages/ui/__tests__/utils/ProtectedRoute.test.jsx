import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthContext, UserContext } from "../../src/contexts/Contexts";
import { MemoryRouter, useNavigate } from "react-router-dom";
import ProtectedRoute from "../../src/utils/ProtectedRoute";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    Navigate: vi.fn().mockImplementation(({ to, replace, state }) => {
      mockNavigate(to, { replace, state });
      return null;
    }),
  };
});

const mockNavigate = vi.fn();

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});

const mockUserContext = (userData, loading) => ({
  userData,
  loading,
  fetchUserData: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockReset();
  useNavigate.mockReturnValue(mockNavigate);
});

describe("ProtectedRoute", () => {
  it("should render children if the user is authenticated for non-admin routes", () => {
    const authContext = mockAuthContext(true);
    const userContext = mockUserContext(null, false);

    render(
      <AuthContext.Provider value={authContext}>
        <UserContext.Provider value={userContext}>
          <MemoryRouter>
            <ProtectedRoute adminOnly={false}>
              <p data-testid="protected-content">Protected Content</p>
            </ProtectedRoute>
          </MemoryRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const protectedContent = screen.getByTestId("protected-content");
    expect(protectedContent).toBeInTheDocument();
  });

  it("should redirect to the home page if user is not authenticated", () => {
    const authContext = mockAuthContext(false);
    const userContext = mockUserContext(null, false);

    render(
      <AuthContext.Provider value={authContext}>
        <UserContext.Provider value={userContext}>
          <MemoryRouter>
            <ProtectedRoute adminOnly={false}>
              <p data-testid="protected-content">Protected Content</p>
            </ProtectedRoute>
          </MemoryRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/", {
      replace: true,
      state: { from: expect.any(String) },
    });
  });

  it("should allow admin access to admin routes", () => {
    const authContext = mockAuthContext(true);
    const userContext = mockUserContext({ userType: "ADMIN" }, false);

    render(
      <AuthContext.Provider value={authContext}>
        <UserContext.Provider value={userContext}>
          <MemoryRouter>
            <ProtectedRoute adminOnly={true}>
              <p data-testid="admin-content">Admin Content</p>
            </ProtectedRoute>
          </MemoryRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    const adminContent = screen.getByTestId("admin-content");
    expect(adminContent).toBeInTheDocument();
  });

  it("should redirect non-admin users from admin routes to the home page", () => {
    const authContext = mockAuthContext(true);
    const userContext = mockUserContext({ userType: "USER" }, false);

    render(
      <AuthContext.Provider value={authContext}>
        <UserContext.Provider value={userContext}>
          <MemoryRouter>
            <ProtectedRoute adminOnly={true}>
              <p data-testid="admin-content">Admin Content</p>
            </ProtectedRoute>
          </MemoryRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
