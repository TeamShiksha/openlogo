import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider } from "../../src/contexts/ToastContext.jsx";
import { useToast } from "../../src/hooks/useToast.js";

vi.useFakeTimers();

const TestComponent = () => {
  const { success, error, info, warning, show, clear, clearToast } = useToast();

  return (
    <div>
      <button onClick={() => success("Success message")}>Success</button>
      <button onClick={() => error("Error message")}>Error</button>
      <button onClick={() => info("Info message")}>Info</button>
      <button onClick={() => warning("Warning message")}>Warning</button>
      <button
        onClick={() => show("Custom toast", { type: "info", duration: 1000 })}
      >
        Custom
      </button>
      <button onClick={clear}>Clear All</button>
      <button onClick={() => clearToast(12345)}>Clear One</button>
    </div>
  );
};

const renderWithProvider = (ui, options) =>
  render(<ToastProvider {...options}>{ui}</ToastProvider>);

describe("ToastContext", () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  it("renders and displays different toast types", () => {
    renderWithProvider(<TestComponent />);

    fireEvent.click(screen.getByText("Success"));
    fireEvent.click(screen.getByText("Error"));
    fireEvent.click(screen.getByText("Info"));
    fireEvent.click(screen.getByText("Warning"));

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByText("Info message")).toBeInTheDocument();
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("auto-closes toast after duration", () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText("Custom"));

    expect(screen.getByText("Custom toast")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(screen.queryByText("Custom toast")).not.toBeInTheDocument();
  });

  it("respects maxToasts limit", () => {
    renderWithProvider(<TestComponent />, { maxToasts: 2 });

    fireEvent.click(screen.getByText("Success"));
    fireEvent.click(screen.getByText("Error"));
    fireEvent.click(screen.getByText("Info"));

    expect(screen.queryByText("Success message")).not.toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("clears all toasts", () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText("Success"));
    fireEvent.click(screen.getByText("Error"));

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Clear All"));

    expect(screen.queryByText("Success message")).not.toBeInTheDocument();
    expect(screen.queryByText("Error message")).not.toBeInTheDocument();
  });
});
