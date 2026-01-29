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
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      <p data-testid="theme-status">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </p>
      <button data-testid="toggle-theme-btn" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    document.documentElement.dataset.theme = "";
    document.documentElement.style.colorScheme = "";
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "";
    document.documentElement.style.colorScheme = "";
  });

  it("renders children with initial light theme", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeStatus = screen.getByTestId("theme-status").textContent;
    expect(themeStatus).toBe("Light Mode");
  });

  it("toggles theme when toggle button is clicked", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    let themeStatus = screen.getByTestId("theme-status").textContent;
    expect(themeStatus).toBe("Light Mode");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      themeStatus = screen.getByTestId("theme-status").textContent;
      expect(themeStatus).toBe("Dark Mode");
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      themeStatus = screen.getByTestId("theme-status").textContent;
      expect(themeStatus).toBe("Light Mode");
    });
  });

  it("persists dark mode to localStorage", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const savedTheme = JSON.parse(localStorage.getItem("darkMode"));
      expect(savedTheme).toBe(true);
    });
  });

  it("persists light mode to localStorage", async () => {
    localStorage.setItem("darkMode", JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const savedTheme = JSON.parse(localStorage.getItem("darkMode"));
      expect(savedTheme).toBe(false);
    });
  });

  it("loads theme from localStorage on mount", () => {
    localStorage.setItem("darkMode", JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeStatus = screen.getByTestId("theme-status").textContent;
    expect(themeStatus).toBe("Dark Mode");
  });

  it("handles invalid localStorage data gracefully", () => {
    localStorage.setItem("darkMode", "invalid-json");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeStatus = screen.getByTestId("theme-status").textContent;
    expect(themeStatus).toBe("Light Mode");
  });

  it("sets document theme attribute to 'dark' when dark mode is enabled", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
  });

  it("removes document theme attribute when dark mode is disabled", async () => {
    localStorage.setItem("darkMode", JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBeUndefined();
    });
  });

  it("sets document colorScheme to 'dark' when dark mode is enabled", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });
  });

  it("sets document colorScheme to 'light' when dark mode is disabled", async () => {
    localStorage.setItem("darkMode", JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement.style.colorScheme).toBe("light");
    });
  });

  it("respects system preference when localStorage is empty", () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: true,
    });
    globalThis.matchMedia = matchMediaMock;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeStatus = screen.getByTestId("theme-status").textContent;
    expect(themeStatus).toBe("Dark Mode");
  });

  it("defaults to light mode when matchMedia is not available", () => {
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = null;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeStatus = screen.getByTestId("theme-status").textContent;
    expect(themeStatus).toBe("Light Mode");

    globalThis.matchMedia = originalMatchMedia;
  });

  it("provides correct context value", async () => {
    let contextValue = null;

    const ContextChecker = () => {
      contextValue = useContext(ThemeContext);
      return null;
    };

    render(
      <ThemeProvider>
        <ContextChecker />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(contextValue).toHaveProperty("isDarkMode");
      expect(contextValue).toHaveProperty("toggleTheme");
      expect(typeof contextValue.isDarkMode).toBe("boolean");
      expect(typeof contextValue.toggleTheme).toBe("function");
    });
  });
});
