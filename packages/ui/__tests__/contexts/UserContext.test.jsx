import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserProvider } from "../../src/contexts/UserContext";
import { UserContext } from "../../src/contexts/Contexts";
import { instance } from "../../src/api/api_instance";
import { useContext } from "react";

vi.mock("../../src/api/api_instance", () => ({
  instance: {
    get: vi.fn(),
  },
}));

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
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId("user-data").textContent).toBe("No User Data");
    expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
    expect(screen.getByTestId("error").textContent).toBe("No Error");
  });

  it("should update userData when fetchUserData is successful", async () => {
    const mockUserData = { id: 1, name: "John Doe", email: "john@example.com" };

    instance.get.mockResolvedValueOnce({
      data: { data: mockUserData },
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByTestId("fetch-btn").click();

    await waitFor(() => {
      expect(screen.getByTestId("user-data").textContent).toBe(
        JSON.stringify(mockUserData)
      );
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
      expect(screen.getByTestId("error").textContent).toBe("No Error");
    });

    expect(instance.get).toHaveBeenCalledWith("/api/user/data");
  });

  it("should set error when fetchUserData fails", async () => {
    instance.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByTestId("fetch-btn").click();

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Error Occurred");
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
    });

    expect(instance.get).toHaveBeenCalledWith("/api/user/data");
  });
});
