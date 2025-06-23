import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthContext } from "../../src/contexts/Contexts";
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

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockReset();
  useNavigate.mockReturnValue(mockNavigate);
});

describe("ProtectedRoute", () => {
  it("should render children if the user is authenticated", () => {
    const authContext = mockAuthContext(true);

    render(
      <AuthContext.Provider value={authContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <p data-testid="protected-content">Protected Content</p>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const protectedContent = screen.getByTestId("protected-content");
    expect(protectedContent).toBeInTheDocument();
  });

  it("should redirect to the home page if user is not authenticated", () => {
    const authContext = mockAuthContext(false);

    render(
      <AuthContext.Provider value={authContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <p data-testid="protected-content">Protected Content</p>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/", {
      replace: true,
      state: { from: expect.any(String) },
    });
  });
});
