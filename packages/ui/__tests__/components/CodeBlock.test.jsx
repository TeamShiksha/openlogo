import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeBlock from "../../src/page/documentation/CodeBlock";

const mockCodeExamples = {
  javascript: "console.log('Hello, JavaScript!');",
  python: "print('Hello, Python!')",
  java: "System.out.println('Hello, Java!');",
};

describe("CodeBlock component", () => {
  beforeEach(() => {
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  });

  it("Defaults to JavaScript on initial render", () => {
    render(<CodeBlock id="test" codeExamples={mockCodeExamples} />);

    expect(screen.getByText(mockCodeExamples.javascript)).toBeInTheDocument();
  });

  it("Copies code to clipboard on button click", async () => {
    render(<CodeBlock id="test" codeExamples={mockCodeExamples} />);

    const copyButton = screen.getByRole("button", { name: /tick-copy-code/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockCodeExamples.javascript
    );
  });

  it("Changes displayed code when clicking on language icon", () => {
    render(<CodeBlock id="test" codeExamples={mockCodeExamples} />);

    const pythonButton = screen.getByRole("button", { name: /python logo/i });
    fireEvent.click(pythonButton);
    expect(screen.getByText(mockCodeExamples.python)).toBeInTheDocument();

    const javaButton = screen.getByRole("button", { name: /java logo/i });
    fireEvent.click(javaButton);
    expect(screen.getByText(mockCodeExamples.java)).toBeInTheDocument();
  });

  it("Renders buttons for all available languages", () => {
    render(<CodeBlock id="test" codeExamples={mockCodeExamples} />);

    Object.keys(mockCodeExamples).forEach((lang) => {
      const button = screen.getByRole("button", {
        name: new RegExp(`${lang} logo`, "i"),
      });
      expect(button).toBeInTheDocument();
    });
  });
});
