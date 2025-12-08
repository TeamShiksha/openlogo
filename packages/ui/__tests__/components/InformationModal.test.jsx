import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InformationModal from "../../src/components/Information/Information";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  heading: "Information",
  message: "This is a test message",
  buttonText: "I Understand",
};

describe("InformationModal Component", () => {
  it("renders heading, message and button", () => {
    render(<InformationModal {...defaultProps} />);

    const heading = screen.getByText(defaultProps.heading);
    expect(heading).toBeInTheDocument();
    expect(heading).toBeVisible();

    const message = screen.getByText(defaultProps.message);
    expect(message).toBeInTheDocument();

    const button = screen.getByText(defaultProps.buttonText);
    expect(button).toBeInTheDocument();
  });

  it("renders default button text when buttonText prop is not provided", () => {
    const propsWithoutButtonText = {
      isOpen: true,
      onClose: vi.fn(),
      heading: "Information",
      message: "Test message",
    };

    render(<InformationModal {...propsWithoutButtonText} />);

    const button = screen.getByText("I Understand");
    expect(button).toBeInTheDocument();
  });

  it("when button is clicked, onClose function should be triggered", () => {
    render(<InformationModal {...defaultProps} />);

    const button = screen.getByText(defaultProps.buttonText);
    fireEvent.click(button);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    render(<InformationModal {...defaultProps} isOpen={false} />);

    const heading = screen.queryByText(defaultProps.heading);
    expect(heading).not.toBeInTheDocument();
  });

  it("renders message as JSX element", () => {
    const jsxMessage = (
      <>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </>
    );

    render(<InformationModal {...defaultProps} message={jsxMessage} />);

    const firstPara = screen.getByText("First paragraph");
    const secondPara = screen.getByText("Second paragraph");

    expect(firstPara).toBeInTheDocument();
    expect(secondPara).toBeInTheDocument();
  });
});
