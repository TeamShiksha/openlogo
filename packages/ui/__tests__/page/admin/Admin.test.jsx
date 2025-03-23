import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AdminDashboard from "../../../src/page/admin/Admin";

describe("AdminDashboard Component", () => {
  it("renders Analytics, Catalog Component in AdminDashboard", () => {
    render(<AdminDashboard />);

    const analytics = screen.getByTestId("analytics");
    expect(analytics).toBeInTheDocument();

    const catalog = screen.getByTestId("catalog");
    expect(catalog).toBeInTheDocument();
  });
});
