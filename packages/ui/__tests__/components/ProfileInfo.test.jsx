import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileInfo from "../../src/components/profileinfo/ProfileInfo";
import { UserContext } from "../../src/contexts/Contexts";

// Mock child components to isolate ProfileInfo testing
vi.mock("../../src/components/userinfo/UserInfo", () => ({
  default: ({ name, email, isGuest }) => (
    <div data-testid="user-info">
      {name} - {email} - {isGuest ? "Guest" : "User"}
    </div>
  ),
}));

vi.mock("../../src/components/changepassword/ChangePassword", () => ({
  default: ({ isGuest }) => (
    <div data-testid="change-password">{isGuest ? "Guest" : "User"}</div>
  ),
}));

vi.mock("../../src/components/settings/SettingCard", () => ({
  default: ({ isGuest }) => (
    <div data-testid="setting-card">{isGuest ? "Guest" : "User"}</div>
  ),
}));

vi.mock("../../src/components/currentplan/CurrentPlan", () => ({
  default: ({ isGuest }) => (
    <div data-testid="current-plan">{isGuest ? "Guest" : "User"}</div>
  ),
}));

const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  isGuest: false,
};

describe("ProfileInfo Component", () => {
  it("renders all sections correctly for a regular user", () => {
    render(
      <UserContext.Provider value={{ userData: mockUserData }}>
        <ProfileInfo />
      </UserContext.Provider>
    );

    // Check headings
    expect(screen.getByText("User Info")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByText("Setting")).toBeInTheDocument();
    expect(screen.getByText("Plan")).toBeInTheDocument();

    // Check if child components are rendered with correct data
    expect(screen.getByTestId("user-info")).toHaveTextContent(
      "John Doe - john@example.com - User"
    );
    expect(screen.getByTestId("change-password")).toHaveTextContent("User");
    expect(screen.getByTestId("setting-card")).toHaveTextContent("User");
    expect(screen.getByTestId("current-plan")).toHaveTextContent("User");
  });

  it("passes isGuest=true to child components when user is a guest", () => {
    const guestData = { ...mockUserData, isGuest: true };
    render(
      <UserContext.Provider value={{ userData: guestData }}>
        <ProfileInfo />
      </UserContext.Provider>
    );

    expect(screen.getByTestId("user-info")).toHaveTextContent("Guest");
    expect(screen.getByTestId("change-password")).toHaveTextContent("Guest");
    expect(screen.getByTestId("setting-card")).toHaveTextContent("Guest");
    expect(screen.getByTestId("current-plan")).toHaveTextContent("Guest");
  });

  it("does not render UserInfo if userData is missing", () => {
    render(
      <UserContext.Provider value={{ userData: null }}>
        <ProfileInfo />
      </UserContext.Provider>
    );

    expect(screen.queryByTestId("user-info")).not.toBeInTheDocument();
    // Other components still render because they only depend on isGuest (defaulting to false)
    expect(screen.getByTestId("change-password")).toBeInTheDocument();
  });
});
