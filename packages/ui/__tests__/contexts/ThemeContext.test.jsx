import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ThemeProvider } from "../../src/contexts/ThemeContext";
import { ThemeContext } from "../../src/contexts/Contexts";
import { useContext } from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

const TestComponent = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div>
      <p data-testid="current-theme">{theme}</p>
      <button data-testid="set-dark-btn" onClick={() => setTheme("dark")}>
        Set Dark
      </button>
      <button data-testid="set-light-btn" onClick={() => setTheme("light")}>
        Set Light
      </button>
      <button data-testid="set-device-btn" onClick={() => setTheme("device")}>
        Set Device
      </button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "";
    document.documentElement.style.colorScheme = "";
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "";
    document.documentElement.style.colorScheme = "";
  });

  it("defaults to 'light' theme when no localStorage", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme").textContent).toBe("light");
  });

  it("loads saved theme from localStorage on mount", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
  });

  it("applies 'dark' theme to document when theme is dark", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("set-dark-btn"));

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });
  });

  it("applies 'light' theme to document when theme is light", async () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("set-light-btn"));

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBeUndefined();
      expect(document.documentElement.style.colorScheme).toBe("light");
    });
  });

  it("respects system preference when theme is 'device'", async () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    globalThis.matchMedia = matchMediaMock;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("set-device-btn"));

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });
  });

  it("persists theme to localStorage when changed", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("set-dark-btn"));

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  it("provides correct context values", () => {
    let contextValue;

    const ContextChecker = () => {
      contextValue = useContext(ThemeContext);
      return null;
    };

    render(
      <ThemeProvider>
        <ContextChecker />
      </ThemeProvider>
    );

    expect(contextValue).toHaveProperty("theme");
    expect(contextValue).toHaveProperty("setTheme");
    expect(contextValue).toHaveProperty("toggleTheme");
    expect(typeof contextValue.setTheme).toBe("function");
    expect(typeof contextValue.toggleTheme).toBe("function");
    expect(["light", "dark", "device"]).toContain(contextValue.theme);
  });

  it("cleans up matchMedia listener on unmount when using device mode", async () => {
    const removeListener = vi.fn();
    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeListener,
    });

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("set-device-btn"));

    unmount();

    expect(removeListener).toHaveBeenCalled();
  });
});
