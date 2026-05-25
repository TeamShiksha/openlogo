import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CatalogItem from "../../src/components/catalog/CatalogItem";
import { COMPANIES } from "../../src/utils/Constants";
import { formatDate } from "../../src/utils/Helpers";

describe("CatalogItem Component", () => {
  const mockCompany = COMPANIES[0];
  const mockOnUpdate = vi.fn();

  it("Should render company image name correctly", () => {
    render(<CatalogItem company={mockCompany} onUpdate={mockOnUpdate} />);

    const expectedText = `${mockCompany.company_name.toLowerCase()}.${mockCompany.extension}`;
    const companyImageElement = screen.getByText(expectedText);
    expect(companyImageElement).toBeInTheDocument();
  });

  it("Should render creation date correctly", () => {
    render(<CatalogItem company={mockCompany} onUpdate={mockOnUpdate} />);

    const expectedFormattedDate = formatDate(mockCompany.created_at);
    const createdDateElement = screen.getByText(expectedFormattedDate);
    expect(createdDateElement).toBeInTheDocument();
  });

  it("Should render update date correctly", () => {
    render(<CatalogItem company={mockCompany} onUpdate={mockOnUpdate} />);

    const expectedFormattedDate = formatDate(mockCompany.updated_at);
    const updatedDateElement = screen.getByText(expectedFormattedDate);
    expect(updatedDateElement).toBeInTheDocument();
  });

  it("Should render reupload button", () => {
    render(<CatalogItem company={mockCompany} onUpdate={mockOnUpdate} />);

    const reuploadButton = screen.getByText("Reupload");
    expect(reuploadButton).toBeInTheDocument();
  });

  it("Should pass correct props to Button component", () => {
    render(<CatalogItem company={mockCompany} onUpdate={mockOnUpdate} />);

    const button = screen.getByText("Reupload");
    expect(button).toHaveAttribute(
      "class",
      expect.stringContaining("reupload-btn")
    );
  });
});
