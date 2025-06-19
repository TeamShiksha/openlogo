import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingCard from "../../src/components/settings/SettingCard";
import { SETTING, MOCK_USER_DATA } from "../../src/utils/Constants";
import {
  ToastContext,
  UserContext,
  AuthContext,
} from "../../src/contexts/Contexts";

const mockUserData = MOCK_USER_DATA;

const mockAuthContext = {
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
  setIsAuthenticated: vi.fn(),
};

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  clearToast: vi.fn(),
};

const mockMakeRequest = vi.fn();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: () => ({
    makeRequest: mockMakeRequest,
    errorMsg: "Something went wrong",
  }),
}));

const renderWithProviders = (isGuest = false) =>
  render(
    <AuthContext.Provider value={mockAuthContext}>
      <ToastContext.Provider value={mockToastContext}>
        <UserContext.Provider value={{ userData: mockUserData }}>
          <SettingCard isGuest={isGuest} />
        </UserContext.Provider>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );

describe("SettingCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the SettingCard component with correct number of buttons", () => {
    renderWithProviders();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(SETTING.length);
  });

  it("displays correct button titles and subtitles", () => {
    renderWithProviders();
    SETTING.forEach(({ subtitle, buttontitle }) => {
      const buttonElement = screen.getByText(buttontitle);
      const subtitleElement = screen.getByText(subtitle);

      expect(buttonElement).toBeInTheDocument();
      expect(subtitleElement).toBeInTheDocument();
    });
  });

  it("assigns correct button variants", () => {
    renderWithProviders();
    SETTING.forEach(({ buttontitle }) => {
      const button = screen.getByText(buttontitle);
      const isDeleteButton = buttontitle.toLowerCase().includes("delete");

      if (isDeleteButton) {
        expect(button).toHaveAttribute(
          "class",
          expect.stringContaining("danger")
        );
      } else {
        expect(button).toHaveAttribute(
          "class",
          expect.stringContaining("primary")
        );
      }
    });
  });
  it("disables buttons when isGuest is true", () => {
    renderWithProviders(true);
    SETTING.forEach((setting) => {
      expect(screen.getByText(setting.buttontitle)).toBeDisabled();
    });
  });
});

describe("Delete Account Confirmation Flow", () => {
  it("opens confirmation modal on delete button click", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/delete account/i));
    expect(
      screen.getByText(/are you sure you want to delete/i)
    ).toBeInTheDocument();
  });

  it("disables confirm button if email does not match", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/delete account/i));
    await userEvent.type(screen.getByLabelText(/email/i), "wrong@example.com");
    const modal = screen.getByTestId("confirmation-modal");
    const confirmButton = within(modal).getByRole("button", {
      name: /delete/i,
    });
    expect(confirmButton).toBeDisabled();
  });

  it("enables confirm button if email matches", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText(/delete account/i));
    await userEvent.type(screen.getByLabelText(/email/i), mockUserData.email);

    const modal = screen.getByTestId("confirmation-modal");
    const confirmButton = within(modal).getByRole("button", {
      name: /delete/i,
    });
    expect(confirmButton).not.toBeDisabled();
  });

  it("calls API and closes modal on successful deletion", async () => {
    mockMakeRequest.mockResolvedValue(true);
    renderWithProviders();

    fireEvent.click(screen.getByText(/delete account/i));
    await userEvent.type(screen.getByLabelText(/email/i), mockUserData.email);

    const modal = screen.getByTestId("confirmation-modal");
    const confirmButton = within(modal).getByRole("button", {
      name: /delete/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockMakeRequest).toHaveBeenCalled();
      expect(mockToastContext.success).toHaveBeenCalled();
      expect(
        screen.queryByText(/are you sure you want to delete/i)
      ).not.toBeInTheDocument();
    });
  });

  it("shows error toast on API failure", async () => {
    mockMakeRequest.mockResolvedValue(false);
    renderWithProviders();

    fireEvent.click(screen.getByText(/delete account/i));
    await userEvent.type(screen.getByLabelText(/email/i), mockUserData.email);

    const modal = screen.getByTestId("confirmation-modal");
    const confirmButton = within(modal).getByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockMakeRequest).toHaveBeenCalled();
      expect(mockToastContext.error).toHaveBeenCalled();
    });
  });
});
