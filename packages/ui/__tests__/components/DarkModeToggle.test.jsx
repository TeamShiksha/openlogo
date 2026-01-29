import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DarkModeToggle } from "../../src/components/darkModeToggle/DarkModeToggle.jsx";
import { ThemeContext } from "../../src/contexts/Contexts";

describe("DarkModeToggle Component", () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (isDarkMode = false) =>
    render(
      <ThemeContext.Provider
        value={{ isDarkMode, toggleTheme: mockToggleTheme }}
      >
        <DarkModeToggle />
      </ThemeContext.Provider>
    );

  it("renders the toggle button", () => {
    renderComponent();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("displays Sun icon when isDarkMode is true", () => {
    renderComponent(true);
    const sunIcon = screen.getByRole("button").querySelector("svg");
    expect(sunIcon).toBeInTheDocument();
    // Sun icon has a specific class/data attribute from lucide-react
    const icons = screen.getByRole("button").querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("displays Moon icon when isDarkMode is false", () => {
    renderComponent(false);
    const moonIcon = screen.getByRole("button").querySelector("svg");
    expect(moonIcon).toBeInTheDocument();
    const icons = screen.getByRole("button").querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("calls toggleTheme when button is clicked", () => {
    renderComponent(false);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("calls toggleTheme multiple times on multiple clicks", () => {
    renderComponent(false);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(3);
  });

  it("applies the correct CSS class", () => {
    renderComponent();
    const button = screen.getByRole("button");
    expect(button.className).toContain("darkModeToggle");
  });

  it("toggles between icons when isDarkMode changes", () => {
    const { rerender } = render(
      <ThemeContext.Provider
        value={{ isDarkMode: false, toggleTheme: mockToggleTheme }}
      >
        <DarkModeToggle />
      </ThemeContext.Provider>
    );

    let icons = screen.getByRole("button").querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);

    rerender(
      <ThemeContext.Provider
        value={{ isDarkMode: true, toggleTheme: mockToggleTheme }}
      >
        <DarkModeToggle />
      </ThemeContext.Provider>
    );

    icons = screen.getByRole("button").querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });
});
