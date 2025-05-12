import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// vi.mock("../../utils/Constants", () => ({
//   SVGS: {
//     searchIcon: "search-icon.svg",
//     curvedArrow: "curved-arrow.svg",
//   },
//   BUTTON_TEXT: {
//     requestLogo: "Request Logo",
//   },
// }));

import Demo from "../../src/components/demo/Demo.jsx";
import { instance } from "../../src/api/api_instance.js";
vi.mock("../../src/api/api_instance.js", () => ({
  instance: {
    get: vi.fn(),
  },
}));

describe("Demo Component", () => {
  const mockOpenAuthModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Demo component correctly", () => {
    render(<Demo openAuthModal={mockOpenAuthModal} />);
    expect(screen.getByText("See In Action")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("shows loading animation while fetching", async () => {
    instance.get.mockResolvedValueOnce(new Promise(() => {}));

    render(<Demo openAuthModal={mockOpenAuthModal} />);

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "aa" },
    });
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByTestId("loading-dots")).toBeInTheDocument();
    });
  });

  it("displays up to 3 search results after fetching", async () => {
    const mockCompanies = [
      { companyName: "Apple", image: "apple-logo.svg" },
      { companyName: "Amazon", image: "amazon-logo.svg" },
      { companyName: "Adobe", image: "adobe-logo.svg" },
      { companyName: "Airbnb", image: "airbnb-logo.svg" },
    ];

    instance.get.mockResolvedValueOnce({ data: { data: mockCompanies } });

    render(<Demo openAuthModal={mockOpenAuthModal} />);

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "aa" },
    });
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Amazon")).toBeInTheDocument();
      expect(screen.getByText("Adobe")).toBeInTheDocument();
      expect(screen.queryByText("Airbnb")).not.toBeInTheDocument();
    });
  });

  it("shows 'No results' and request button if search returns nothing", async () => {
    instance.get.mockResolvedValueOnce({ data: [] });

    render(<Demo openAuthModal={mockOpenAuthModal} />);

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "nope" },
    });
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText(/did not match any logo/i)).toBeInTheDocument();
      expect(screen.getByText("Request Logo")).toBeInTheDocument();
    });
  });

  it("calls openAuthModal when request button is clicked", async () => {
    instance.get.mockResolvedValueOnce({ data: [] });

    render(<Demo openAuthModal={mockOpenAuthModal} />);

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "nothing" },
    });
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Request Logo"));
      expect(mockOpenAuthModal).toHaveBeenCalledTimes(1);
    });
  });
});
