import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Toast from "../../src/components/toast/Toast.jsx";

describe("Toast Component", () => {
  let onCloseMock;

  beforeEach(() => {
    onCloseMock = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders the toast with message", () => {
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={onCloseMock}
        id="1"
      />
    );
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("calls onClose after duration", () => {
    render(
      <Toast
        message="Test auto close"
        duration={3000}
        onClose={onCloseMock}
        id="2"
      />
    );
    act(() => {
      vi.advanceTimersByTime(3300);
    });
    expect(onCloseMock).toHaveBeenCalledWith("2");
  });

  it("pauses timer on hover and resumes on mouse leave", () => {
    render(
      <Toast
        message="Hover pause test"
        duration={5000}
        onClose={onCloseMock}
        id="3"
      />
    );

    const toast = screen.getByRole("alert");

    act(() => {
      fireEvent.mouseEnter(toast);
      vi.advanceTimersByTime(6000);
    });

    expect(onCloseMock).not.toHaveBeenCalled();

    act(() => {
      fireEvent.mouseLeave(toast);
      vi.advanceTimersByTime(5300);
    });

    expect(onCloseMock).toHaveBeenCalledWith("3");
  });

  it("closes immediately when close button is clicked", () => {
    render(<Toast message="Manual close" onClose={onCloseMock} id="4" />);
    const closeButton = screen.getByRole("button");

    act(() => {
      fireEvent.click(closeButton);
      vi.advanceTimersByTime(300);
    });

    expect(onCloseMock).toHaveBeenCalledWith("4");
  });

  it("applies correct class for toast type", () => {
    const { container } = render(
      <Toast message="Error message" type="error" id="5" />
    );
    const toastElement = container.querySelector('[role="alert"]');
    expect(toastElement.className).toMatch(/error/);
  });
});
