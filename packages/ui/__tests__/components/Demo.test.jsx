import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("../../utils/Constants", () => ({
  SVGS: {
    searchIcon: "search-icon.svg",
    curvedArrow: "curved-arrow.svg",
  },
  BUTTON_TEXT: {
    requestLogo: "Request Logo",
  },
}));

import axios from "axios";
import Demo from "../../src/components/demo/Demo.jsx";
vi.mock("axios");

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
    axios.get.mockResolvedValueOnce(new Promise(() => {}));

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
      { id: 1, name: "Apple", logo: "apple-logo.svg" },
      { id: 2, name: "Amazon", logo: "amazon-logo.svg" },
      { id: 3, name: "Adobe", logo: "adobe-logo.svg" },
      { id: 4, name: "Airbnb", logo: "airbnb-logo.svg" },
    ];

    axios.get.mockResolvedValueOnce({ data: mockCompanies });

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
    axios.get.mockResolvedValueOnce({ data: [] });

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
    axios.get.mockResolvedValueOnce({ data: [] });

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
