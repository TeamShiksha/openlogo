import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Usage from "../../src/components/usage/Usage";
import { MOCK_USER_DATA } from "../../src/utils/Constants";

const mockToastWarning = vi.fn();
const mockToastError = vi.fn();

vi.mock("../../src/hooks/useToast.js", () => ({
  useToast: () => ({
    warning: mockToastWarning,
    error: mockToastError,
  }),
}));
import { UserContext } from "../../src/contexts/Contexts";
import { ToastProvider } from "../../src/contexts/ToastContext";

describe("Usage Component", () => {
  const mockUserData = {
    userData: MOCK_USER_DATA,
  };

  const renderWithProviders = (component) => {
    return render(
      <UserContext.Provider value={mockUserData}>
        <ToastProvider>
          {component}
        </ToastProvider>
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should show correct usage count, usage limit", () => {
    renderWithProviders(
      <Usage
        usageCount={MOCK_USER_DATA.subscription.usage_count}
        usageLimit={MOCK_USER_DATA.subscription.usage_limit}
      />
    );

    const usageCountText = screen.getByText(
      MOCK_USER_DATA.subscription.usage_count
    );
    const usageLimitText = screen.getByText(
      MOCK_USER_DATA.subscription.usage_limit
    );
    expect(usageCountText).toBeInTheDocument();
    expect(usageLimitText).toBeInTheDocument();
  });

  it("Should render PieGraph with correct percentage", () => {
    const { container } = renderWithProviders(
      <Usage
        usageCount={MOCK_USER_DATA.subscription.usage_count}
        usageLimit={MOCK_USER_DATA.subscription.usage_limit}
      />
    );

    const pieGraph = container.querySelector("svg");
    const usedPercent =
      (MOCK_USER_DATA.subscription.usage_count /
        MOCK_USER_DATA.subscription.usage_limit) *
      100;
    const percentageText = screen.getByText(`${usedPercent}%`);
    expect(pieGraph).toBeInTheDocument();
    expect(percentageText).toBeInTheDocument();
  });

  describe("Toast Notifications Logic", () => {
    const LIMIT = 500;

    it("should not trigger any toast when usage is below 80%", () => {
      render(<Usage usageCount={350} usageLimit={LIMIT} />);
      expect(mockToastWarning).not.toHaveBeenCalled();
      expect(mockToastError).not.toHaveBeenCalled();
    });

    it("should trigger warning toast exactly once at 80%", () => {
      render(<Usage usageCount={400} usageLimit={LIMIT} />);
      expect(mockToastWarning).toHaveBeenCalledTimes(1);
      expect(mockToastWarning).toHaveBeenCalledWith(
        expect.stringContaining("80%")
      );
    });

    it("should trigger only the highest threshold warning (90%) and suppress lower ones", () => {
      render(<Usage usageCount={450} usageLimit={LIMIT} />);
      expect(mockToastWarning).toHaveBeenCalledTimes(1);
      expect(mockToastWarning).toHaveBeenCalledWith(
        expect.stringContaining("90%")
      );
    });

    it("should trigger error toast at 95% and suppress warnings", () => {
      render(<Usage usageCount={475} usageLimit={LIMIT} />);
      expect(mockToastError).toHaveBeenCalledTimes(1);
      expect(mockToastError).toHaveBeenCalledWith(
        expect.stringContaining("95%")
      );
      expect(mockToastWarning).not.toHaveBeenCalled();
    });

    it("should trigger error toast at 100% and suppress lower thresholds", () => {
      render(<Usage usageCount={500} usageLimit={LIMIT} />);
      expect(mockToastError).toHaveBeenCalledTimes(1);
      expect(mockToastError).toHaveBeenCalledWith(
        expect.stringContaining("100%")
      );
      expect(mockToastWarning).not.toHaveBeenCalled();
    });

    it("should handle sequential usage increases correctly (no duplicates)", () => {
      const { rerender } = render(
        <Usage usageCount={400} usageLimit={LIMIT} />
      );
      expect(mockToastWarning).toHaveBeenCalledTimes(1);
      expect(mockToastWarning).toHaveBeenCalledWith(
        expect.stringContaining("80%")
      );

      vi.clearAllMocks();

      rerender(<Usage usageCount={425} usageLimit={LIMIT} />);
      expect(mockToastWarning).not.toHaveBeenCalled();

      rerender(<Usage usageCount={480} usageLimit={LIMIT} />);
      expect(mockToastError).toHaveBeenCalledTimes(1);
      expect(mockToastError).toHaveBeenCalledWith(
        expect.stringContaining("96%")
      );
      expect(mockToastWarning).not.toHaveBeenCalled();
    });
  });
});
