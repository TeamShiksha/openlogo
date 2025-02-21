import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SettingCard from "../src/components/dashboard/settingpage/SettingCard";
import { SETTING } from "../src/utils/Constants";

describe("SettingCard Component", () => {
  it("renders the SettingCard component with correct number of buttons", () => {
    render(<SettingCard />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(SETTING.length);
  });

  it("displays correct button titles and subtitles", () => {
    render(<SettingCard />);
    SETTING.forEach(({ subtitle, buttontitle }) => {
      const buttonElement = screen.getByText(buttontitle);
      const subtitleElement = screen.getByText(subtitle);

      expect(buttonElement).toBeInTheDocument();
      expect(subtitleElement).toBeInTheDocument();
    });
  });

  it("assigns correct button variants", () => {
    render(<SettingCard />);
    SETTING.forEach(({ buttontitle }) => {
      const button = screen.getByText(buttontitle);
      const isDeleteButton = buttontitle.toLowerCase().includes("delete");

      if (isDeleteButton) {
        expect(button).toHaveAttribute(
          "class",
          expect.stringContaining("danger")
        );
      } else {
        expect(button).toHaveAttribute(
          "class",
          expect.stringContaining("primary")
        );
      }
    });
  });
});
