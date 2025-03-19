import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import AdminDashboard from "../../../src/page/admin/Admin";

describe("AdminDashboard Component", () => {
  it("renders AdminDashboard Component", () => {
    render(<AdminDashboard />);
  });
});
