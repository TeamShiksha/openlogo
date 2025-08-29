import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserProvider } from "../../src/contexts/UserContext";
import { ToastContext, UserContext } from "../../src/contexts/Contexts";
import { instance } from "../../src/api/api_instance";
import { useContext } from "react";

vi.mock("../../src/api/api_instance", () => ({
  instance: {
    get: vi.fn(),
  },
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
  const { userData, loading, error, fetchUserData } = useContext(UserContext);

  return (
    <div>
      <p data-testid="user-data">
        {userData ? JSON.stringify(userData) : "No User Data"}
      </p>
      <p data-testid="loading">{loading ? "Loading..." : "Not Loading"}</p>
      <p data-testid="error">{error ? "Error Occurred" : "No Error"}</p>
      <button data-testid="fetch-btn" onClick={fetchUserData}>
        Fetch User
      </button>
    </div>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("UserProvider", () => {
  it("should have default values on initialization", () => {
    render(
      <ToastContext.Provider value={mockToastContext}>
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </ToastContext.Provider>
    );

    const userDataText = screen.getByTestId("user-data").textContent;
    const loadingText = screen.getByTestId("loading").textContent;
    const errorText = screen.getByTestId("error").textContent;

    expect(userDataText).toBe("No User Data");
    expect(loadingText).toBe("Not Loading");
    expect(errorText).toBe("No Error");
  });

  it("should update userData when fetchUserData is successful", async () => {
    const mockUserData = { id: 1, name: "John Doe", email: "john@example.com" };

    instance.get.mockResolvedValueOnce({
      data: { data: mockUserData },
    });

    render(
      <ToastContext.Provider value={mockToastContext}>
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </ToastContext.Provider>
    );

    screen.getByTestId("fetch-btn").click();

    await waitFor(() => {
      const userDataText = screen.getByTestId("user-data").textContent;
      const loadingText = screen.getByTestId("loading").textContent;
      const errorText = screen.getByTestId("error").textContent;

      expect(userDataText).toBe(JSON.stringify(mockUserData));
      expect(loadingText).toBe("Not Loading");
      expect(errorText).toBe("No Error");
    });

    expect(instance.get).toHaveBeenCalledWith("user/me");
  });

  it("should set error when fetchUserData fails", async () => {
    instance.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <ToastContext.Provider value={mockToastContext}>
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </ToastContext.Provider>
    );

    screen.getByTestId("fetch-btn").click();

    await waitFor(() => {
      const errorText = screen.getByTestId("error").textContent;
      const loadingText = screen.getByTestId("loading").textContent;

      expect(errorText).toBe("Error Occurred");
      expect(loadingText).toBe("Not Loading");
    });

    expect(instance.get).toHaveBeenCalledWith("user/me");
  });
});
