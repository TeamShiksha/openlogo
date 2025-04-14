import { expect, describe, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserInfo from "../../../../src/components/dashboard/userinfo/UserInfo";
import { UserContext } from "../../../../src/contexts/Contexts";

const mockUserData = {
  name: "Jane Doe",
  email: "janedoe@gmail.com",
};

describe("UserInfo Component", () => {
  it("Should render loading state", () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: true }}>
        <UserInfo />
      </UserContext.Provider>
    );

    const loadingText = screen.getByText("loading...");
    expect(loadingText).toBeInTheDocument();
  });

  it("Should render name and email correctly", async () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: false }}>
        <UserInfo />
      </UserContext.Provider>
    );

    const nameInput = screen.getByDisplayValue(mockUserData.name);
    const emailInput = screen.getByDisplayValue(mockUserData.email);
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it("Should update name input value & email input value", () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: false }}>
        <UserInfo />
      </UserContext.Provider>
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(nameInput.value).toBe("New Name");

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "newemail@gmail.com" } });
    expect(emailInput.value).toBe("newemail@gmail.com");
  });

  it("Should show error if name or email is empty on submit", async () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: false }}>
        <UserInfo />
      </UserContext.Provider>
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      const nameErrorText = screen.getByText("Name is required!");
      expect(nameErrorText).toBeInTheDocument();
    });
  });

  it("Should enable Save button when name is changed", () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData, loading: false }}>
        <UserInfo />
      </UserContext.Provider>
    );

    const nameInput = screen.getByLabelText(/name/i);
    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Another Name" } });
    expect(saveButton).not.toBeDisabled();
  });
});
