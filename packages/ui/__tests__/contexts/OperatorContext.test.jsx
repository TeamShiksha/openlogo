import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OperatorProvider } from "../../src/contexts/OperatorContext";
import { OperatorContext } from "../../src/contexts/Contexts";
import { instance } from "../../src/api/api_instance";
import { useContext } from "react";

vi.mock("../../src/api/api_instance", () => ({
  instance: {
    get: vi.fn(),
  },
}));

const TestComponent = () => {
  const { queries, loading, error, fetchQueries } = useContext(OperatorContext);

  return (
    <div>
      <p data-testid="queries">
        {queries.length > 0 ? JSON.stringify(queries) : "No Queries"}
      </p>
      <p data-testid="loading">{loading ? "Loading..." : "Not Loading"}</p>
      <p data-testid="error">{error ? "Error Occurred" : "No Error"}</p>
      <button data-testid="fetch-btn" onClick={() => fetchQueries(true, 1, 5)}>
        Fetch Queries
      </button>
    </div>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("OperatorProvider", () => {
  it("should have default values on initialization", () => {
    render(
      <OperatorProvider>
        <TestComponent />
      </OperatorProvider>
    );

    const queriesText = screen.getByTestId("queries").textContent;
    const loadingText = screen.getByTestId("loading").textContent;
    const errorText = screen.getByTestId("error").textContent;

    expect(queriesText).toBe("No Queries");
    expect(loadingText).toBe("Not Loading");
    expect(errorText).toBe("No Error");
  });

  it("should update queries when fetchQueries is successful", async () => {
    const mockQueries = [
      { id: 1, query: "What is AI?" },
      { id: 2, query: "How does React work?" },
    ];

    instance.get.mockResolvedValueOnce({ data: mockQueries });

    render(
      <OperatorProvider>
        <TestComponent />
      </OperatorProvider>
    );

    screen.getByTestId("fetch-btn").click();

    await waitFor(() => {
      const queriesText = screen.getByTestId("queries").textContent;
      const loadingText = screen.getByTestId("loading").textContent;
      const errorText = screen.getByTestId("error").textContent;

      expect(queriesText).toBe(JSON.stringify(mockQueries));
      expect(loadingText).toBe("Not Loading");
      expect(errorText).toBe("No Error");
    });

    expect(instance.get).toHaveBeenCalledWith("/api/common/pagination", {
      params: {
        type: "queries",
        page: 1,
        limit: 5,
        active: true,
      },
    });
  });

  it("should set error when fetchQueries fails", async () => {
    instance.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <OperatorProvider>
        <TestComponent />
      </OperatorProvider>
    );

    screen.getByTestId("fetch-btn").click();

    await waitFor(() => {
      const errorText = screen.getByTestId("error").textContent;
      const loadingText = screen.getByTestId("loading").textContent;

      expect(errorText).toBe("Error Occurred");
      expect(loadingText).toBe("Not Loading");
    });

    expect(instance.get).toHaveBeenCalledWith("/api/common/pagination", {
      params: {
        type: "queries",
        page: 1,
        limit: 5,
        active: true,
      },
    });
  });
});
