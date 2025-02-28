import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";
import ScrollManager from "../src/components/common/ScrollManager";
import { handleNavigation } from "../src/utils/Helpers";

describe("ScrollManager Component", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls to the stored hash element", async () => {
    document.body.innerHTML =
      '<div id="test-element" style="margin-top: 2000px;">Test</div>';
    sessionStorage.setItem("scrollTo", "test-element");

    render(
      <MemoryRouter>
        <ScrollManager />
      </MemoryRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("scrolls to the top when no stored hash", () => {
    render(
      <MemoryRouter>
        <ScrollManager />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

describe("handleNavigation function", () => {
  let navigate;

  beforeEach(() => {
    navigate = vi.fn();
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    sessionStorage.clear();
    document.body.innerHTML =
      '<div id="test-section" style="margin-top: 2000px;">Section</div>';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("navigates to a new page when path changes and stores sectionId", () => {
    const event = { preventDefault: vi.fn() };
    handleNavigation(event, "/new-page#test-section", navigate);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(sessionStorage.getItem("scrollTo")).toBe("test-section");
    expect(navigate).toHaveBeenCalledWith("/new-page");
  });

  it("scrolls to the section on the same page", () => {
    const event = { preventDefault: vi.fn() };
    handleNavigation(event, "/#test-section", navigate);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("scrolls to the top if no section id is provided", () => {
    const event = { preventDefault: vi.fn() };
    handleNavigation(event, "/", navigate);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
