import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Release from "../../src/page/release/Release";
import { instance } from "../../src/api/api_instance";

vi.mock("../../src/api/api_instance", () => ({
  instance: {
    get: vi.fn(),
  },
}));

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

const MOCK_RELEASES = {
  "0.8.0": {
    version: "0.8.0",
    releaseDate: "2026-06-19T19:46:10.000Z",
    heroImage: "version07",
    entries: [
      {
        category: "Feature",
        prNumber: 101,
        title: "Revamp User dashboard",
        description: "Full redesign of user interface.",
        contributor: {
          username: "AryaDharkar",
        },
      },
      {
        category: "Security",
        prNumber: 102,
        title: "Two-Factor Authentication",
        description: "Added 2FA section.",
        contributor: {
          username: "MukeshAbhi",
        },
      },
    ],
  },
  "0.7.0": {
    version: "0.7.0",
    releaseDate: "2026-03-01T06:40:49.000Z",
    heroImage: "version07",
    entries: [
      {
        category: "Enhancement",
        prNumber: 95,
        title: "Optimize Search Index",
        description: "Faster query responses.",
        contributor: {
          username: "L-Tarun-Aditya",
        },
      },
    ],
  },
};

describe("Release page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    instance.get.mockImplementation((url) => {
      if (url === "/releases/versions") {
        return Promise.resolve({
          data: {
            statusCode: 200,
            data: MOCK_VERSIONS,
          },
        });
      }
      if (url.startsWith("/releases/")) {
        const ver = url.replace("/releases/", "");
        const releaseDoc = MOCK_RELEASES[ver] || {
          version: ver,
          releaseDate: "2024-07-01T11:31:07.000Z",
          entries: [],
        };
        return Promise.resolve({
          data: {
            statusCode: 200,
            data: releaseDoc,
          },
        });
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  // ─── Smoke test ───────────────────────────────────────────────────────────

  it("renders Hero and Changelog sections", async () => {
    render(<Release />);

    const heroHeading = screen.getByRole("heading", {
      level: 1,
      name: /What's new at Openlogo/i,
    });
    expect(heroHeading).toBeInTheDocument();

    const changelogHeading = screen.getByRole("heading", {
      level: 2,
      name: "Changelog",
    });
    expect(changelogHeading).toBeInTheDocument();
  });

  // ─── Defaults to first release ────────────────────────────────────────────

  it("defaults to displaying the first release version on load", async () => {
    render(<Release />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Jun 2026/i })
      ).toBeInTheDocument();
    });
  });

  // ─── Contributors deduplication ───────────────────────────────────────────

  it("does not crash and renders at least one contributor avatar when entries have contributors", async () => {
    render(<Release />);

    await waitFor(() => {
      const allAvatars = screen.queryAllByRole("img");
      expect(allAvatars.length).toBeGreaterThan(1);
    });
  });

  // ─── Renders without crashing ─────────────────────────────────────────────

  it("renders the full page without crashing", async () => {
    const { container } = render(<Release />);
    expect(container.firstChild).not.toBeNull();
  });
});
