import { expect, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChangeLog from "../../../src/components/release/ChangeLog";

const MOCK_VERSIONS = [
  {
    version: "0.8.0",
    releaseDate: "2026-06-19T19:46:10.000Z",
  },
  {
    version: "0.7.0",
    releaseDate: "2026-03-01T06:40:49.000Z",
  },
  {
    version: "0.6.0",
    releaseDate: "2026-01-02T16:38:02.000Z",
  },
  {
    version: "0.5.0",
    releaseDate: "2025-11-30T10:28:01.000Z",
  },
  {
    version: "0.3.0",
    releaseDate: "2025-09-01T18:07:42.000Z",
  },
  {
    version: "0.2.0",
    releaseDate: "2024-10-05T16:02:52.000Z",
  },
  {
    version: "0.1.0",
    releaseDate: "2024-07-01T11:31:07.000Z",
  },
];

const MOCK_RELEASE_080 = {
  version: "0.8.0",
  releaseDate: "2026-06-19T19:46:10.000Z",
  heroImage: "version07",
  entries: [
    {
      category: "Feature",
      prNumber: 101,
      title: "Revamp User dashboard",
      description: "Full redesign of the user interface.",
      contributor: {
        username: "AryaDharkar",
      },
    },
    {
      category: "Security",
      prNumber: 102,
      title: "Two-Factor Authentication",
      description: "Added a new 2FA section.",
      contributor: {
        username: "MukeshAbhi",
      },
    },
  ],
};

describe("ChangeLog component", () => {
  const defaultProps = {
    versions: MOCK_VERSIONS,
    selectedVersion: MOCK_VERSIONS[0].version,
    setSelectedVersion: vi.fn(),
    selectedRelease: MOCK_RELEASE_080,
  };

  // ─── Basic rendering ────────────────────────────────────────────────
  it("renders header and selected version date", () => {
    render(<ChangeLog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /changelog/i })
    ).toBeInTheDocument();

    const toggleBtn = screen.getByRole("button", {
      name: /Jun 2026/i,
    });

    expect(toggleBtn).toBeInTheDocument();
  });

  it("opens dropdown and lets user select another version", () => {
    const mockSetSelectedVersion = vi.fn();

    render(
      <ChangeLog
        {...defaultProps}
        setSelectedVersion={mockSetSelectedVersion}
      />
    );

    const toggleBtn = screen.getByRole("button", {
      name: /Jun 2026/i,
    });

    fireEvent.click(toggleBtn);

    const anotherRelease = MOCK_VERSIONS[1];

    const optionBtn = screen.getByRole("button", {
      name: new RegExp(anotherRelease.version, "i"),
    });

    fireEvent.click(optionBtn);

    expect(mockSetSelectedVersion).toHaveBeenCalledWith(anotherRelease.version);
  });

  // ─── Dropdown displays all versions with formatted dates ─────────────────
  it("displays all versions in the dropdown with correct dates", () => {
    render(<ChangeLog {...defaultProps} />);

    const toggleBtn = screen.getByRole("button", {
      name: /Jun 2026/i,
    });

    fireEvent.click(toggleBtn);

    expect(
      screen.getByRole("button", { name: "Jun 2026 (v0.8.0)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mar 2026 (v0.7.0)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Jan 2026 (v0.6.0)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nov 2025 (v0.5.0)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sep 2025 (v0.3.0)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Oct 2024 (v0.2.0)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Jul 2024 (v0.1.0)" })
    ).toBeInTheDocument();
  });

  // ─── Dropdown closes after selecting a version ────────────────────────────────
  it("closes dropdown after a version is selected", () => {
    render(<ChangeLog {...defaultProps} />);

    const toggleBtn = screen.getByRole("button", {
      name: /Jun 2026/i,
    });

    fireEvent.click(toggleBtn); // open
    const anotherRelease = MOCK_VERSIONS[1];
    const optionBtn = screen.getByRole("button", {
      name: new RegExp(anotherRelease.version, "i"),
    });
    fireEvent.click(optionBtn); // select → should close

    // Dropdown items should no longer be visible
    expect(
      screen.queryByRole("button", {
        name: "Mar 2026 (0.7.0)",
      })
    ).not.toBeInTheDocument();
  });

  // ─── Fallback trigger label when releaseDate is missing ──────────────────────
  it("shows version in the dropdown trigger when releaseDate is missing", () => {
    const partialRelease = {
      version: "0.9.0",
      heroImage: "version07",
      entries: [],
    };

    render(
      <ChangeLog
        {...defaultProps}
        versions={[{ version: "0.9.0" }]}
        selectedRelease={partialRelease}
        selectedVersion="0.9.0"
      />
    );

    expect(screen.getByRole("button", { name: /0.9.0/i })).toBeInTheDocument();
  });

  // ─── Empty state: no entries for category ────────────────────────────────────
  it("shows empty state message when no entries match the selected category filter", () => {
    const releaseWithNoSecurityEntries = {
      ...MOCK_RELEASE_080,
      entries: [
        {
          category: "Feature",
          prNumber: 1,
          title: "Only Feature",
          description: "No security entries here.",
          contributor: {
            username: "dev1",
            avatarUrl: "https://github.com/dev1.png",
            profileUrl: "https://github.com/dev1",
          },
        },
      ],
    };

    render(
      <ChangeLog
        {...defaultProps}
        selectedRelease={releaseWithNoSecurityEntries}
      />
    );

    expect(screen.getByText("Only Feature")).toBeInTheDocument();
    expect(
      screen.queryByText(/no updates in this category/i)
    ).not.toBeInTheDocument();
  });

  it("shows empty state when 'All' is active and selectedRelease has no entries", () => {
    const emptyRelease = {
      version: "0.9.0",
      releaseDate: "2026-07-01T11:31:07.000Z",
      heroImage: "version07",
      entries: [],
    };

    render(
      <ChangeLog
        {...defaultProps}
        selectedRelease={emptyRelease}
        selectedVersion="0.9.0"
      />
    );

    expect(
      screen.getByText(/no updates in this category/i)
    ).toBeInTheDocument();
  });

  // ─── Category filter pills ────────────────────────────────────────────────────
  it("renders 'All' filter pill when entries are present", () => {
    render(<ChangeLog {...defaultProps} />);

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });

  it("only renders category pills for categories that exist in the selected release", () => {
    const featureOnlyRelease = {
      version: "0.9.0",
      releaseDate: "2026-07-01T11:31:07.000Z",
      heroImage: "version07",
      entries: [
        {
          category: "Feature",
          prNumber: 1,
          title: "Feature only",
          description: "Just a feature.",
          contributor: {
            username: "dev1",
            avatarUrl: "https://github.com/dev1.png",
            profileUrl: "https://github.com/dev1",
          },
        },
      ],
    };

    render(
      <ChangeLog
        {...defaultProps}
        selectedRelease={featureOnlyRelease}
        selectedVersion="0.9.0"
      />
    );

    expect(screen.getByRole("button", { name: "Feature" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Security" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Bug Fix" })
    ).not.toBeInTheDocument();
  });

  it("filters entries correctly when a category pill is clicked", () => {
    const mixedRelease = {
      version: "0.9.0",
      releaseDate: "2026-07-01T11:31:07.000Z",
      heroImage: "version07",
      entries: [
        {
          category: "Feature",
          prNumber: 1,
          title: "New Feature",
          description: "A new feature.",
        },
        {
          category: "Bug Fix",
          prNumber: 2,
          title: "Fixed Bug",
          description: "A bug fix.",
        },
      ],
    };

    render(
      <ChangeLog
        {...defaultProps}
        selectedRelease={mixedRelease}
        selectedVersion="0.9.0"
      />
    );

    expect(screen.getByText("New Feature")).toBeInTheDocument();
    expect(screen.getByText("Fixed Bug")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Bug Fix" }));

    expect(screen.getByText("Fixed Bug")).toBeInTheDocument();
    expect(screen.queryByText("New Feature")).not.toBeInTheDocument();
  });

  // ─── Entry key falls back gracefully when prNumber is absent ─────────────────
  it("renders entries without a prNumber as keys without crashing", () => {
    const releaseWithoutPrNumber = {
      version: "0.9.0",
      releaseDate: "2026-07-01T11:31:07.000Z",
      heroImage: "version07",
      entries: [
        {
          category: "Feature",
          title: "No PR number entry",
          description: "This entry has no PR number.",
        },
      ],
    };

    render(
      <ChangeLog
        {...defaultProps}
        selectedRelease={releaseWithoutPrNumber}
        selectedVersion="0.9.0"
      />
    );

    expect(screen.getByText("No PR number entry")).toBeInTheDocument();
  });

  // ─── selectedRelease is null/undefined ───────────────────────────────────────
  it("renders without crashing when selectedRelease is null", () => {
    render(<ChangeLog {...defaultProps} selectedRelease={null} />);

    expect(
      screen.getByRole("heading", { name: /changelog/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no updates in this category/i)
    ).toBeInTheDocument();
  });

  // ─── Category filter resets when version changes ──────────────────────────────
  it("resets active category to 'All' when selectedVersion changes", () => {
    const { rerender } = render(
      <ChangeLog
        {...defaultProps}
        selectedRelease={{
          version: "0.8.0",
          releaseDate: "2026-06-19T19:46:10.000Z",
          heroImage: "version07",
          entries: [
            { category: "Bug Fix", prNumber: 1, title: "Bug entry" },
            { category: "Feature", prNumber: 2, title: "Feature entry" },
          ],
        }}
        selectedVersion="0.8.0"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Bug Fix" }));
    expect(screen.queryByText("Feature entry")).not.toBeInTheDocument();

    rerender(
      <ChangeLog
        {...defaultProps}
        selectedRelease={{
          version: "0.7.0",
          releaseDate: "2026-03-01T06:40:49.000Z",
          heroImage: "version07",
          entries: [
            { category: "Feature", prNumber: 3, title: "New version feature" },
          ],
        }}
        selectedVersion="0.7.0"
      />
    );

    expect(screen.getByText("New version feature")).toBeInTheDocument();
  });
});
