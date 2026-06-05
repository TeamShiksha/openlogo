import "@testing-library/jest-dom";
import { vi } from "vitest";

// PageMeta renders <Helmet> on most pages. Tests render those pages only to
// exercise navigation/UI, never to assert on meta tags, so stub react-helmet-async
// globally to avoid needing a <HelmetProvider> wrapper in every test.
vi.mock("react-helmet-async", () => ({
  Helmet: () => null,
  HelmetProvider: ({ children }) => children,
}));
