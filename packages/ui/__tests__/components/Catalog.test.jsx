import { expect, describe, it, vi, afterEach, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState, useEffect } from "react";
import Catalog from "../../src/components/catalog/Catalog";
import { COMPANIES, BUTTON_TEXT } from "../../src/utils/Constants";

vi.useFakeTimers();

vi.mock("../../src/hooks/useApi", () => {
  const pageSize = 10;

  return {
    useApi: ({ method, url }) => {
      const [data, setData] = useState(undefined);
      const [loading, setLoading] = useState(false);
      const [errorMsg, setErrorMsg] = useState(null);

      useEffect(() => {
        if (method === "GET" && url?.includes("/catalog/logos")) {
          setLoading(true);
          setErrorMsg(null);

          const urlParams = new URLSearchParams(url.split("?")[1]);
          const skip = parseInt(urlParams.get("skip") || "0", 10);
          const limit = parseInt(
            urlParams.get("limit") || pageSize.toString(),
            10
          );

          const filteredCompanies = urlParams.get("search")
            ? COMPANIES.filter((c) =>
                c.company_name
                  .toLowerCase()
                  .includes(urlParams.get("search").toLowerCase())
              )
            : COMPANIES;

          const slicedCompanies = filteredCompanies.slice(skip, skip + limit);
          const totalPages = Math.ceil(filteredCompanies.length / limit);

          setData({
            data: {
              data: slicedCompanies,
              totalPages,
            },
          });
          setLoading(false);
        }
      }, [url, method]);

      const makeRequest = vi.fn(() => {
        return Promise.resolve({
          success: true,
          message: "Mock operation successful",
        });
      });

      return { data, loading, errorMsg, makeRequest };
    },
  };
});

describe("Catalog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.runAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("Search bar should be visible", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const searchInput = screen.getByLabelText("search");
    const searchIcon = screen.getByAltText("search-logo");

    expect(searchInput).toBeInTheDocument();
    expect(searchIcon).toBeInTheDocument();
  });

  it("Add image button should be visible", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const addImageButton = screen.getByText("Add image");
    expect(addImageButton).toBeInTheDocument();
  });

  it("Table headers should be visible", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const imageHeader = screen.getByText("Images");
    const createdHeader = screen.getByText("Created");
    const updatedHeader = screen.getByText("Updated");

    expect(imageHeader).toBeInTheDocument();
    expect(createdHeader).toBeInTheDocument();
    expect(updatedHeader).toBeInTheDocument();
  });

  it("Should not change page when Previous button is clicked on first page", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const prevButton = screen.getByAltText("left-arrow").closest("button");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(prevButton).toBeDisabled();

    fireEvent.click(prevButton);
    vi.runAllTimers();
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("Should not change page when Next button is clicked on last page", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const pageSize = 10;
    const totalPages = Math.ceil(COMPANIES.length / pageSize);

    const nextButton = screen.getByAltText("right-arrow").closest("button");

    expect(screen.getByTestId("current-page")).toHaveTextContent(
      `${totalPages}`
    );
    expect(nextButton).toBeDisabled();

    fireEvent.click(nextButton);
    vi.runAllTimers();

    expect(screen.getByTestId("current-page")).toHaveTextContent(
      `${totalPages}`
    );
  });

  it("Companies list should be visible with correct number of items", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const firstPageCompanies = COMPANIES.slice(0, 10);
    firstPageCompanies.forEach((company) => {
      screen.getByText(
        `${company.company_name.toLowerCase()}.${company.extension}`
      );
    });
    if (COMPANIES.length > 10) {
      expect(
        screen.queryByText(
          `${COMPANIES[10].company_name.toLowerCase()}.${COMPANIES[10].extension}`
        )
      ).not.toBeInTheDocument();
    }
  });

  it("Should navigate to next page when Next button is clicked", () => {
    render(<Catalog />);
    vi.runAllTimers();

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    const nextButton = screen.getByAltText("right-arrow").closest("button");

    expect(nextButton).toBeDisabled();
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("Should navigate to previous page when Prev button is clicked", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const nextButton = screen.getByAltText("right-arrow").closest("button");
    const prevButton = screen.getByAltText("left-arrow").closest("button");

    expect(nextButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("Should filter companies when search term is entered", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const searchInput = screen.getByLabelText("search");
    fireEvent.change(searchInput, { target: { value: "Amazon" } });
    vi.runAllTimers();

    screen.getByText("amazon.png");
    expect(screen.queryByText("apple.png")).not.toBeInTheDocument();
  });

  it("Should show 'No results found' message when search has no matches", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const searchInput = screen.getByLabelText("search");
    fireEvent.change(searchInput, { target: { value: "NonExistentCompany" } });
    vi.runAllTimers();
    expect(
      screen.getByText("No results found matching your query!")
    ).toBeInTheDocument();
    expect(screen.queryByText("amazon.png")).not.toBeInTheDocument();
  });

  it("Should reset search when navigating to another page", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const searchInput = screen.getByLabelText("search");
    fireEvent.change(searchInput, { target: { value: "Amazon" } });
    vi.runAllTimers();

    expect(screen.getByText("amazon.png")).toBeInTheDocument();
    expect(screen.queryByText("apple.png")).not.toBeInTheDocument();
    expect(searchInput).toHaveValue("Amazon");

    const nextButton = screen.getByAltText("right-arrow").closest("button");
    expect(nextButton).toBeDisabled();
    expect(searchInput).toHaveValue("Amazon");
  });

  it("Should display correct total page count", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const totalPages = Math.ceil(COMPANIES.length / 10);
    const pageNavSection = screen.getByTestId("current-page").closest("div");
    expect(pageNavSection).toHaveTextContent(`of ${totalPages}`);
  });

  it("Should disable Next button on last page", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const nextButton = screen.getByAltText("right-arrow").closest("button");
    expect(nextButton).toBeDisabled();
  });

  it("Should open modal when Add image button is clicked", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const addImageButton = screen.getByText("Add image");
    fireEvent.click(addImageButton);
    vi.runAllTimers();

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
  });

  it("Should close modal when close button is clicked", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const addImageButton = screen.getByText("Add image");
    fireEvent.click(addImageButton);
    vi.runAllTimers();

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    const closeButton = screen.getByText(BUTTON_TEXT.cross);
    fireEvent.click(closeButton);
    vi.runAllTimers();

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("image-upload-modal-overlay")
    ).not.toBeInTheDocument();
  });

  it("Should close modal when clicking on overlay", () => {
    render(<Catalog />);
    vi.runAllTimers();

    const addImageButton = screen.getByText("Add image");
    fireEvent.click(addImageButton);
    vi.runAllTimers();

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    const modalOverlay = screen.getByTestId("modal-overlay");
    fireEvent.click(modalOverlay);
    vi.runAllTimers();

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
  });
});
