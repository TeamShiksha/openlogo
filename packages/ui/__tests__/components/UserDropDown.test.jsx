import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import UserDropDown from "../../src/components/dropdown/UserDropDown.jsx";
import { AuthContext, UserContext } from "../../src/contexts/Contexts";
import { MemoryRouter } from "react-router-dom";
import { BUTTON_TEXT } from "../../src/utils/Constants";

describe("UserDropDown Component", () => {
  const mockLogout = vi.fn();
  const mockSetUserData = vi.fn();
  const mockUserData = { email: "test@example.com" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ logout: mockLogout }}>
          <UserContext.Provider
            value={{ userData: mockUserData, setUserData: mockSetUserData }}
          >
            <UserDropDown />
          </UserContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

  it("renders profile button with user initial", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /T/i }); // T from test@example.com
    expect(button).toBeInTheDocument();
  });

  it("toggles dropdown on button click", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /T/i });
    fireEvent.click(button);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BUTTON_TEXT.signOut })
    ).toBeInTheDocument();

    fireEvent.click(button); // close dropdown
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });

  it("calls logout and clears user data on logout click", async () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /T/i });
    fireEvent.click(button);

    const logoutBtn = screen.getByRole("button", { name: BUTTON_TEXT.signOut });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockSetUserData).toHaveBeenCalledWith(null);
    });
  });
});
