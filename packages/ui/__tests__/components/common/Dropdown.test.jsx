import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Dropdown from "../../../src/components/common/dropdown/Dropdown";

describe("Dropdown Component", () => {

  it("should render nothing if options array is empty", () => {
    render(
      <Dropdown options={[]} selectedOption="" setSelectedOption={vi.fn()} />
    );

    expect(screen.getByTestId("testid-dropdown").children.length).toBe(0);
  });

  it("should render all provided options", () => {
    const options = ["ADMIN", "USER", "OPERATOR"];
    render(
      <Dropdown
        options={options}
        selectedOption="USER"
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    const renderedOptions = within(dropdown).getAllByRole("option");
    expect(renderedOptions).toHaveLength(options.length);
    expect(renderedOptions.map((opt) => opt.value)).toEqual(options);
  });

  it("should display options in uppercase", () => {
    const options = ["admin", "user"];
    render(
      <Dropdown
        options={options}
        selectedOption="user"
        setSelectedOption={vi.fn()}
      />
    );

    const renderedOptions = screen.getAllByRole("option");
    expect(renderedOptions.map((opt) => opt.textContent)).toEqual([
      "ADMIN",
      "USER",
    ]);
  });

  it("should set selected option based on selectedOption prop", () => {
    render(
      <Dropdown
        options={["ADMIN", "USER"]}
        selectedOption="ADMIN"
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    expect(dropdown.value).toBe("ADMIN");
  });

  it("should call setSelectedOption function in case of onChange event", () => {
    const mockSetSelectedOption = vi.fn();
    render(
      <Dropdown
        options={["ADMIN", "USER"]}
        selectedOption="ADMIN"
        setSelectedOption={mockSetSelectedOption}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    fireEvent.change(dropdown, { target: { value: "USER" } });

    expect(mockSetSelectedOption).toHaveBeenCalledWith("USER");
  });

  it("should handle undefined options without crashing", () => {
    render(
      <Dropdown
        options={undefined}
        selectedOption=""
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    expect(dropdown.children.length).toBe(0);
  });

  it("should focusable and allows keyboard interaction", () => {
    render(
      <Dropdown
        options={["ADMIN", "USER"]}
        selectedOption="USER"
        setSelectedOption={vi.fn()}
      />
    );

    const dropdown = screen.getByTestId("testid-dropdown");
    dropdown.focus();
    expect(dropdown).toHaveFocus();
  });

  it("should render options with special characters", () => {
    const options = ["@dm!n", "us3r_1"];
    render(
      <Dropdown
        options={options}
        selectedOption="us3r_1"
        setSelectedOption={vi.fn()}
      />
    );

    const renderedOptions = screen.getAllByRole("option");
    expect(renderedOptions.map((opt) => opt.value)).toEqual([
      "@dm!n",
      "us3r_1",
    ]);
  });
});
