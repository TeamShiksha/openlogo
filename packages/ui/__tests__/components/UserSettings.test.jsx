import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserSettings from "../../src/components/usersettings/UserSettings";
import { UserContext } from "../../src/contexts/Contexts";

vi.mock("../../src/components/profileinfo/ProfileInfo", () => ({
  default: () => <div data-testid="profile-info">Profile Info Component</div>,
}));

vi.mock("../../src/components/twofactorauth/TwoFactorAuth", () => ({
  default: () => (
    <div data-testid="two-factor-auth">Two Factor Auth Component</div>
  ),
}));

const mockUserContext = {
  user: {
    name: "Test User",
    email: "test@example.com",
    role: "USER",
  },
  isGuest: false,
};

describe("UserSettings Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default profile tab active", () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserSettings />
      </UserContext.Provider>
    );

    expect(
      screen.getByRole("heading", { name: "Profile Info" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Manage your personal details and account security preferences."
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("profile-info")).toBeInTheDocument();
  });

  it("renders all menu items", () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserSettings />
      </UserContext.Provider>
    );

    expect(
      screen.getByRole("button", { name: /Profile Info/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /2FA Settings/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Password/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Notifications/i })
    ).toBeInTheDocument();
  });

  it("switches to 2FA tab when clicked", () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserSettings />
      </UserContext.Provider>
    );

    const twoFAButton = screen.getByRole("button", { name: /2FA Settings/i });
    fireEvent.click(twoFAButton);

    expect(screen.getByText("Security Settings")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Manage your account security and two-factor authentication."
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("two-factor-auth")).toBeInTheDocument();
  });

  it("shows coming soon message for password tab", () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserSettings />
      </UserContext.Provider>
    );

    const passwordButton = screen.getByRole("button", { name: /Password/i });
    fireEvent.click(passwordButton);

    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(
      screen.getByText(/The Password settings are currently under development/i)
    ).toBeInTheDocument();
  });

  it("shows coming soon message for notifications tab", () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserSettings />
      </UserContext.Provider>
    );

    const notificationsButton = screen.getByRole("button", {
      name: /Notifications/i,
    });
    fireEvent.click(notificationsButton);

    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(
      screen.getByText(
        /The Notifications settings are currently under development/i
      )
    ).toBeInTheDocument();
  });

  it("applies active class to selected tab", () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserSettings />
      </UserContext.Provider>
    );

    const profileButton = screen.getByRole("button", { name: /Profile Info/i });
    const twoFAButton = screen.getByRole("button", { name: /2FA Settings/i });

    expect(profileButton.className).toContain("navItemActive");
    expect(twoFAButton.className).not.toContain("navItemActive");

    fireEvent.click(twoFAButton);

    expect(profileButton.className).not.toContain("navItemActive");
    expect(twoFAButton.className).toContain("navItemActive");
  });

  it("switches between tabs correctly", () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserSettings />
      </UserContext.Provider>
    );

    expect(screen.getByTestId("profile-info")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /2FA Settings/i }));
    expect(screen.getByTestId("two-factor-auth")).toBeInTheDocument();
    expect(screen.queryByTestId("profile-info")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Password/i }));
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(screen.queryByTestId("two-factor-auth")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Profile Info/i }));
    expect(screen.getByTestId("profile-info")).toBeInTheDocument();
    expect(screen.queryByText("Coming Soon")).not.toBeInTheDocument();
  });
});
