import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CatalogItem from "../../src/components/catalog/CatalogItem";
import { companies } from "../../src/utils/Constants";

describe("CatalogItem Component", () => {
  const mockCompany = companies[0];

  it("Should render company image name correctly", () => {
    render(<CatalogItem company={mockCompany} />);

    const companyImageElement = screen.getByText(mockCompany.companyImage);
    expect(companyImageElement).toBeInTheDocument();
  });

  it("Should render creation date correctly", () => {
    render(<CatalogItem company={mockCompany} />);

    const createdDateElement = screen.getByText(mockCompany.createdAt);
    expect(createdDateElement).toBeInTheDocument();
  });

  it("Should render update date correctly", () => {
    render(<CatalogItem company={mockCompany} />);

    const updatedDateElement = screen.getByText(mockCompany.updatedAt);
    expect(updatedDateElement).toBeInTheDocument();
  });

  it("Should render reupload button", () => {
    render(<CatalogItem company={mockCompany} />);

    const reuploadButton = screen.getByText("Reupload");
    expect(reuploadButton).toBeInTheDocument();
  });

  it("Should pass correct props to Button component", () => {
    render(<CatalogItem company={mockCompany} />);

    const button = screen.getByText("Reupload");
    expect(button).toHaveAttribute(
      "class",
      expect.stringContaining("reupload-btn")
    );
  });
});
