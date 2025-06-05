import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { AuthContext, ToastContext } from "../../src/contexts/Contexts";
import { useContext } from "react";

const makeRequestMock = vi.fn(() => Promise.resolve(true));

vi.mock("../../src/hooks/useApi", () => ({
  useApi: () => ({
    makeRequest: makeRequestMock,
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

const clearCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
};

beforeEach(() => {
  clearCookies();
  vi.clearAllMocks();
});

describe("AuthProvider", () => {
  it("should set isAuthenticated to true if jwt cookie exists", async () => {
    document.cookie = "jwt=valid_token; path=/";
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ToastContext.Provider>
    );

    await waitFor(() => {
      const authStatusText = screen.getByTestId("auth-status").textContent;
      expect(authStatusText).toBe("Authenticated");
    });
  });

  it("should set isAuthenticated to false if jwt cookie does not exist", async () => {
    clearCookies();

    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ToastContext.Provider>
    );

    await waitFor(() => {
      const authStatusText = screen.getByTestId("auth-status").textContent;
      expect(authStatusText).toBe("Not Authenticated");
    });
  });

  it("should call API on logout and set isAuthenticated to false", async () => {
    document.cookie = "jwt=valid_token; path=/";
    render(
      <ToastContext.Provider value={mockToastContext}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </ToastContext.Provider>
    );

    await waitFor(() => {
      const authStatusText = screen.getByTestId("auth-status").textContent;
      expect(authStatusText).toBe("Authenticated");
    });

    screen.getByTestId("logout-btn").click();

    await waitFor(() => {
      const authStatusText = screen.getByTestId("auth-status").textContent;
      expect(makeRequestMock).toHaveBeenCalled();
      expect(authStatusText).toBe("Not Authenticated");
    });
  });
});
