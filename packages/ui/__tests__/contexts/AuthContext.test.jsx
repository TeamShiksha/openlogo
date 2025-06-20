import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { AuthContext, ToastContext } from "../../src/contexts/Contexts";
import { useContext } from "react";

const makeRequestMock = vi.fn();

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

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Successfully authenticates after success response", async () => {
    makeRequestMock.mockImplementation(() => Promise.resolve(true));

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

  it("Not authenticated after fialure", async () => {
    makeRequestMock.mockImplementation(() => Promise.resolve(false));

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

  it("Set authenticated to false on logout", async () => {
    makeRequestMock.mockImplementation(() => Promise.resolve(true));

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
