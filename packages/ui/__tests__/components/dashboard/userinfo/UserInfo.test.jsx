import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UserInfo from "../../../../src/components/dashboard/userinfo/UserInfo";

const mockUserInfoProps = {
  name: "Jane Doe",
  email: "janedoe@gmail.com",
};

describe("UserInfo Component", () => {
  it("renders all form elements correctly", async () => {
    render(<UserInfo {...mockUserInfoProps} />);

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput.value).toBe(mockUserInfoProps.name);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput.value).toBe(mockUserInfoProps.email);
    expect(emailInput).toBeDisabled();

    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeDisabled();
  });

  it("update name input value", () => {
    render(<UserInfo {...mockUserInfoProps} />);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(nameInput.value).toBe("New Name");
  });

  it("show error if name is empty & removes error if name is valid on submit", async () => {
    render(<UserInfo {...mockUserInfoProps} />);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      const nameErrorText = screen.getByText("Name is required!");
      expect(nameErrorText).toBeInTheDocument();
    });

    fireEvent.change(nameInput, { target: { value: "New Name" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      const nameErrorText = screen.queryByText("Name is required!");
      expect(nameErrorText).not.toBeInTheDocument();
    });
  });

  it("enable Save button when name is changed", () => {
    render(<UserInfo {...mockUserInfoProps} />);

    const nameInput = screen.getByLabelText(/name/i);
    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Another Name" } });
    expect(saveButton).not.toBeDisabled();
  });
});
