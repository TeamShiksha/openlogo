import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { AuthContext, ToastContext } from "../../src/contexts/Contexts";
import { useContext } from "react";

const signOutMock = vi.fn();
const validateSessionMock = vi.fn();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: vi.fn((config) => {
    if (config.url === "/auth/validate-session") {
      return { makeRequest: validateSessionMock };
    }
    if (config.url === "/auth/signout") {
      return { makeRequest: signOutMock };
    }
    return { makeRequest: vi.fn() };
  }),
}));

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  clearToast: vi.fn(),
};

const TestComponent = () => {
  const { isAuthenticated, setIsAuthenticated, logout } =
    useContext(AuthContext);
  return (
    <div>
      <p data-testid="auth-status">
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </p>
      <button onClick={() => setIsAuthenticated(true)}>Login</button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Successfully authenticates after success response", async () => {
    validateSessionMock.mockResolvedValue(true);

    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ToastContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status").textContent).toBe(
        "Authenticated"
      );
    });
  });

  it("Not authenticated after failure", async () => {
    validateSessionMock.mockResolvedValue(false);

    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ToastContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status").textContent).toBe(
        "Not Authenticated"
      );
    });
  });

  it("Set authenticated to false on logout", async () => {
    validateSessionMock.mockResolvedValue(true);
    signOutMock.mockResolvedValue(true);

    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ToastContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status").textContent).toBe(
        "Authenticated"
      );
    });

    screen.getByTestId("logout-btn").click();

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
      expect(screen.getByTestId("auth-status").textContent).toBe(
        "Not Authenticated"
      );
    });
  });
});
