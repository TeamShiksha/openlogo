import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import GetInTouch from "../../../src/components/contact/GetInTouch";
import { BUTTON_TEXT } from "../../../src/utils/Constants";

describe("GetInTouch Component", () => {
  it("renders the GetInTouch card with title and description", () => {
    render(<GetInTouch />);
    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
    const description = screen.getByText(
      "Can't find the answer you're looking for? Please chat to our friendly team."
    );
    expect(description).toBeInTheDocument();
  });

  it("renders the 'Get in touch' button", () => {
    render(<GetInTouch />);
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
  });

  it("opens the ContactForm modal when 'Get in touch' button is clicked", () => {
    render(<GetInTouch />);
    fireEvent.click(screen.getByText("Get in touch"));
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("closes the ContactForm modal when the close button is clicked", () => {
    render(<GetInTouch />);
    fireEvent.click(screen.getByText("Get in touch"));
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: BUTTON_TEXT.cross }));
    expect(screen.queryByText("Contact Us")).not.toBeInTheDocument();
  });
});
