import { expect, describe, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Catalog from "../../src/components/admindashboard/Catalog";
import { companies, BUTTON_TEXT } from "../../src/utils/Constants";

describe("Catalog Component", () => {
  it("Search bar should be visible", () => {
    render(<Catalog />);

    const searchInput = screen.getByLabelText("search");
    const searchIcon = screen.getByAltText("search-logo");

    expect(searchInput).toBeInTheDocument();
    expect(searchIcon).toBeInTheDocument();
  });

  it("Add image button should be visible", () => {
    render(<Catalog />);

    const addImageButton = screen.getByText("Add image");
    expect(addImageButton).toBeInTheDocument();
  });

  it("Table headers should be visible", () => {
    render(<Catalog />);

    const imageHeader = screen.getByText("Images");
    const createdHeader = screen.getByText("Created");
    const updatedHeader = screen.getByText("Updated");

    expect(imageHeader).toBeInTheDocument();
    expect(createdHeader).toBeInTheDocument();
    expect(updatedHeader).toBeInTheDocument();
  });

  it("Should not change page when Previous button is clicked on first page", () => {
    render(<Catalog />);

    const prevButton = screen.getByAltText("left-arrow").closest("button");
    expect(screen.getByTestId("current-page").textContent).toBe("1");
    fireEvent.click(prevButton);
    expect(screen.getByTestId("current-page").textContent).toBe("1");
  });

  it("Should not change page when Next button is clicked on last page", () => {
    render(<Catalog />);

    const totalPages = Math.floor(companies.length / 10);
    const nextButton = screen.getByAltText("right-arrow").closest("button");
    for (let i = 0; i < totalPages; i++) {
      fireEvent.click(nextButton);
    }
    expect(screen.getByTestId("current-page").textContent).toBe(
      `${totalPages + 1}`
    );
    fireEvent.click(nextButton);
    expect(screen.getByTestId("current-page").textContent).toBe(
      `${totalPages + 1}`
    );
  });

  it("Companies list should be visible with correct number of items", () => {
    render(<Catalog />);

    const firstPageCompanies = companies.slice(0, 10);
    firstPageCompanies.forEach((company) => {
      const companyImage = screen.getByText(company.companyImage);
      expect(companyImage).toBeInTheDocument();
    });
  });

  it("Should navigate to next page when Next button is clicked", () => {
    render(<Catalog />);

    const currentPage = screen.getByTestId("current-page").textContent;
    expect(currentPage).toBe("1");
    const nextButton = screen.getByAltText("right-arrow").closest("button");
    fireEvent.click(nextButton);
    const updatedCurrentPage = screen.getByTestId("current-page").textContent;
    expect(updatedCurrentPage).toBe("2");
    const previousButton = screen.getByAltText("left-arrow").closest("button");
    expect(previousButton).not.toHaveAttribute(
      "class",
      expect.stringContaining("catalog-footer-nav-btn-disable")
    );
  });

  it("Should navigate to pevious page when Prev button is clicked", () => {
    render(<Catalog />);

    const nextButton = screen.getByAltText("right-arrow").closest("button");
    fireEvent.click(nextButton);
    const currentPage = screen.getByTestId("current-page").textContent;
    expect(currentPage).toBe("2");
    const prevButton = screen.getByAltText("left-arrow").closest("button");
    fireEvent.click(prevButton);
    const updatedCurrentPage = screen.getByTestId("current-page").textContent;
    expect(updatedCurrentPage).toBe("1");
    expect(prevButton).toHaveAttribute(
      "class",
      expect.stringContaining("catalog-footer-nav-btn-disable")
    );
  });

  it("Should filter companies when search term is entered", async () => {
    render(<Catalog />);

    const searchInput = screen.getByLabelText("search");
    fireEvent.change(searchInput, { target: { value: "Amazon" } });
    expect(screen.getByText("Amazon.png")).toBeInTheDocument();
    expect(screen.queryByText("Apple.png")).not.toBeInTheDocument();
  });

  it("Should show 'No results found' message when search has no matches", async () => {
    render(<Catalog />);

    const searchInput = screen.getByLabelText("search");
    fireEvent.change(searchInput, { target: { value: "NonExistentCompany" } });
    expect(
      screen.getByText("No results found matching your query!")
    ).toBeInTheDocument();
  });

  it("Should reset search when navigating to another page", async () => {
    render(<Catalog />);

    const searchInput = screen.getByLabelText("search");
    fireEvent.change(searchInput, { target: { value: "Amazon" } });
    expect(screen.getByText("Amazon.png")).toBeInTheDocument();
    expect(screen.queryByText("Apple.png")).not.toBeInTheDocument();
    const nextButton = screen.getByAltText("right-arrow").closest("button");
    fireEvent.click(nextButton);
    const secondPageItems = companies.slice(10, 20);
    if (secondPageItems.length > 0) {
      expect(
        screen.getByText(secondPageItems[0].companyImage)
      ).toBeInTheDocument();
    }
  });

  it("Should display correct total page count", () => {
    render(<Catalog />);

    const totalPages = Math.floor(companies.length / 10) + 1;
    const pageNavSection = screen.getByTestId("current-page").closest("div");
    expect(pageNavSection.textContent).toContain(`of ${totalPages}`);
  });

  it("Should disable Next button on last page", async () => {
    render(<Catalog />);

    const totalPages = Math.floor(companies.length / 10);
    for (let i = 0; i < totalPages; i++) {
      const nextButton = screen.getByAltText("right-arrow").closest("button");
      fireEvent.click(nextButton);
    }
    const nextButton = screen.getByAltText("right-arrow").closest("button");
    expect(nextButton).toHaveAttribute(
      "class",
      expect.stringContaining("catalog-footer-nav-btn-disable")
    );
  });

  it("Should open modal when Add image button is clicked", () => {
    const { container } = render(<Catalog />);

    const addImageButton = screen.getByText("Add image");
    fireEvent.click(addImageButton);
    const modalOverlay = container.querySelector('[class*="modal-overlay"]');
    expect(modalOverlay).not.toBeNull();
  });

  it("Should close modal when close button is clicked", () => {
    const { container } = render(<Catalog />);

    const addImageButton = screen.getByText("Add image");
    fireEvent.click(addImageButton);
    const closeButton = screen.getByText(BUTTON_TEXT.cross);
    fireEvent.click(closeButton);

    const modalOverlay = container.querySelector('[class*="modal-overlay"]');
    expect(modalOverlay).toBeNull();
  });

  it("Should close modal when clicking on overlay", () => {
    const { container } = render(<Catalog />);

    const addImageButton = screen.getByText("Add image");
    fireEvent.click(addImageButton);
    const modalOverlay = container.querySelector('[class*="modal-overlay"]');
    fireEvent.click(modalOverlay);
    expect(container.querySelector('[class*="modal-overlay"]')).toBeNull();
  });
});
