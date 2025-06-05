import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserInfo from "../../../../src/components/dashboard/userinfo/UserInfo";
import { MOCK_USER_DATA } from "../../../../src/utils/Constants";
import { ToastProvider } from "../../../../src/contexts/ToastContext";

const mockMakeRequest = vi.fn();
vi.mock("../../../../src/hooks/useApi.js", () => ({
  useApi: () => ({
    makeRequest: mockMakeRequest,
    errorMsg: "",
  }),
}));

describe("UserInfo Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form elements correctly", async () => {
    render(
      <ToastProvider>
        <UserInfo name={MOCK_USER_DATA.name} email={MOCK_USER_DATA.email} />
      </ToastProvider>
    );

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput.value).toBe(MOCK_USER_DATA.name);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput.value).toBe(MOCK_USER_DATA.email);
    expect(emailInput).toBeDisabled();

    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeDisabled();
  });

  it("update name input value", () => {
    render(
      <ToastProvider>
        <UserInfo name={MOCK_USER_DATA.name} email={MOCK_USER_DATA.email} />
      </ToastProvider>
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(nameInput.value).toBe("New Name");
  });

  it("show error if name is empty & removes error if name is valid on submit", async () => {
    render(
      <ToastProvider>
        <UserInfo name={MOCK_USER_DATA.name} email={MOCK_USER_DATA.email} />
      </ToastProvider>
    );

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
    render(
      <ToastProvider>
        <UserInfo name={MOCK_USER_DATA.name} email={MOCK_USER_DATA.email} />
      </ToastProvider>
    );

    const nameInput = screen.getByLabelText(/name/i);
    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Another Name" } });
    expect(saveButton).not.toBeDisabled();
  });

  it("calls the update user API on form submission", async () => {
    render(
      <ToastProvider>
        <UserInfo
          name={MOCK_USER_DATA.name}
          email={MOCK_USER_DATA.email}
          isGuest={false}
        />
      </ToastProvider>
    );

    const nameInput = screen.getByLabelText("Username");
    expect(nameInput.value).toBe(MOCK_USER_DATA.name);

    fireEvent.change(nameInput, { target: { value: "Updated Name" } });
    expect(nameInput.value).toBe("Updated Name");

    const saveButton = screen.getByText("Save");
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMakeRequest).toBeCalled();
    });
  });
});
