import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../../src/components/common/button/Button";
import { describe, it, expect, vi } from "vitest";
import { BUTTON_TEXT } from "../../../src/utils/Constants";

describe("Button Component", () => {
  it("renders the button with children, click and classname", () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick} className="new">
        {BUTTON_TEXT.commingSoon}
      </Button>
    );

    const buttonElement = screen.getByText(BUTTON_TEXT.commingSoon);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalled();
    expect(buttonElement.className).toContain("new");
    expect(buttonElement.className).toContain("primary");
  });

  it("disabled when the disabled prop is true", () => {
    render(
      <Button variant="primary" disabled={true}>
        {BUTTON_TEXT.commingSoon}
      </Button>
    );

    const buttonElement = screen.getByText(BUTTON_TEXT.commingSoon);
    expect(buttonElement).toBeDisabled();
  });
});
