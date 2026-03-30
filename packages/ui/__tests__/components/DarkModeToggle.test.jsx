import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DarkModeToggle } from "../../src/components/darkModeToggle/DarkModeToggle.jsx";
import { ThemeContext } from "../../src/contexts/Contexts";

describe("DarkModeToggle Component", () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (theme = "light") =>
    render(
      <ThemeContext.Provider value={{ theme, setTheme: mockSetTheme }}>
        <DarkModeToggle />
      </ThemeContext.Provider>
    );

  it("renders the toggle button", () => {
    renderComponent();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays Sun icon when theme is light", () => {
    renderComponent("light");
    expect(screen.getByRole("button")).toHaveTextContent(""); // Icons are SVGs
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("displays Moon icon when theme is dark", () => {
    renderComponent("dark");
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("displays Monitor icon when theme is device", () => {
    renderComponent("device");
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("cycles theme correctly on click (light → dark)", () => {
    renderComponent("light");
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("cycles theme correctly on click (dark → device)", () => {
    renderComponent("dark");
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("device");
  });

  it("cycles theme correctly on click (device → light)", () => {
    renderComponent("device");
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("applies the correct CSS class", () => {
    renderComponent();
    const button = screen.getByRole("button");
    expect(button.className).toContain("darkModeToggle");
  });
});
