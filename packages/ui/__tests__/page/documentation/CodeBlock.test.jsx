import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeBlock from "../../../src/page/documentation/CodeBlock";
import userEvent from "@testing-library/user-event";

const mockCodeExamples = {
  javascript: "console.log('Hello, JavaScript!');",
  python: "print('Hello, Python!')",
  java: "System.out.println('Hello, Java!');",
};

describe("CodeBlock component", () => {
  it("Defaults to JavaScript on initial render", () => {
    render(<CodeBlock id="test" codeExamples={mockCodeExamples} />);

    const javascriptCode = screen.getByText(mockCodeExamples.javascript);
    expect(javascriptCode).toBeInTheDocument();
  });

  it("Copies code to clipboard on button click", async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, "writeText");
    render(<CodeBlock id="test" codeExamples={mockCodeExamples} />);

    const copyButton = screen.getByRole("button", { name: /tick-copy-code/i });
    fireEvent.click(copyButton);
    expect(clipboardSpy).toHaveBeenCalledWith(mockCodeExamples.javascript);
  });

  it("Changes displayed code when clicking on language icon", async () => {
    render(<CodeBlock id="test" codeExamples={mockCodeExamples} />);

    const pythonButton = screen.getByRole("button", { name: /python logo/i });
    fireEvent.click(pythonButton);
    const pythonCode = screen.getByText(mockCodeExamples.python);
    expect(pythonCode).toBeInTheDocument();

    const javaButton = screen.getByRole("button", { name: /java logo/i });
    await userEvent.click(javaButton);
    const javaCode = screen.getByText(mockCodeExamples.java);
    expect(javaCode).toBeInTheDocument();
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
