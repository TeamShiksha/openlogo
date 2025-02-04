import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Demo from "../src/components/demo/Demo";
import { SVGS, COMPANIES } from "../src/utils/Constants";

describe("Demo Component", () => {
  it("should have render title and description", () => {
    render(<Demo />);
    expect(screen.getByText("See API In Action")).toBeVisible();
    expect(
      screen.getByText(
        "Powerful, self-serve product and growth analytics to help you convert, engage, and retain more."
      )
    ).toBeVisible();
  });

  it("should have render search input and button", () => {
    render(<Demo />);
    expect(screen.getByLabelText("search")).toBeVisible();
    expect(screen.getByRole("button")).toBeVisible();
  });

  it("should have update search term on input change", () => {
    render(<Demo />);
    const input = screen.getByLabelText("search");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");
  });

  it("should have show results when searching", () => {
    render(<Demo />);
    const input = screen.getByLabelText("search");
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: COMPANIES[0].name } });
    fireEvent.click(button);
    expect(screen.getByText(COMPANIES[0].name)).toBeVisible();
  });

  it("should have no results when input is empty", () => {
    render(<Demo />);
    const input = screen.getByLabelText("search");
    const button = screen.getByRole("button");
    fireEvent.change(input, { target: { value: "" } });
    expect(button.parentElement).not.toHaveClass(
      "_searchInputContainer_66da6a _hasResults_66da6a"
    );
  });

  it("renders integration images", () => {
    render(<Demo />);
    expect(screen.getByAltText("curved-arrow")).toHaveAttribute(
      "src",
      SVGS.curvedArrow
    );
    expect(screen.getByAltText("Search")).toHaveAttribute(
      "src",
      SVGS.searchIcon
    );
  });
});
