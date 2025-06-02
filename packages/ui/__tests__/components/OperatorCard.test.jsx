import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
import OperatorCard from "../../src/components/operator/OperatorCard";

const mockItem = {
  _id: "683c76bdc92459606a4f",
  name: "Charan Praveen",
  email: "charan@example.com",
  companyUrl: "https://example.com",
  message: "This is a sample message to test",
  status: "PENDING",
  openedAt: "2024-01-01T00:00:00Z",
  closedAt: "2024-01-02T00:00:00Z",
  comment: "Issue resolved after the discussion",
};

const onRespondClick = vi.fn();

describe("OperatorCard Component", () => {
  it("shows request ID, status, and opened date", () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.getByText(mockItem._id)).toBeInTheDocument();
    expect(screen.getByText(mockItem.status)).toBeInTheDocument();
    expect(
      screen.getByText(
        `Opened at : ${new Date(mockItem.openedAt).toLocaleDateString()}`
      )
    ).toBeInTheDocument();
  });

  it("show closed date when status is RESOLVED or REJECTED", () => {
    const resolvedItem = { ...mockItem, status: "RESOLVED" };
    render(
      <OperatorCard
        item={resolvedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(
      screen.getByText(
        `Closed at : ${new Date(mockItem.closedAt).toLocaleDateString()}`
      )
    ).toBeInTheDocument();

    const rejectedItem = { ...mockItem, status: "REJECTED" };
    render(
      <OperatorCard
        item={rejectedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(
      screen.getAllByText(
        `Closed at : ${new Date(mockItem.closedAt).toLocaleDateString()}`
      ).length
    ).toBe(2);
  });

  it("does not show closed date when status is PENDING", () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.queryByText(/Closed at/)).not.toBeInTheDocument();
  });

  it('displays user name and email when searchType is "messages"', () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    expect(screen.getByText(mockItem.email)).toBeInTheDocument();
  });

  it('displays company URL when searchType is "requests"', () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="requests"
      />
    );
    expect(
      screen.getByText(`Company URL: ${mockItem.companyUrl}`)
    ).toBeInTheDocument();
  });

  it('does not display user info when searchType is "requests"', () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="requests"
      />
    );
    expect(screen.queryByText(mockItem.name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockItem.email)).not.toBeInTheDocument();
  });

  it('displays message title when searchType is "messages"', () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("displays the correct message content", () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.getByText(mockItem.message)).toBeInTheDocument();
  });

  it('does not display message title when searchType is "requests"', () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="requests"
      />
    );
    expect(screen.queryByText("Message")).not.toBeInTheDocument();
  });

  it("does not render Respond and Reject buttons when status is RESOLVED", () => {
    const resolvedItem = { ...mockItem, status: "RESOLVED" };
    render(
      <OperatorCard
        item={resolvedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.queryByText("Respond")).not.toBeInTheDocument();
    expect(screen.queryByText("Reject")).not.toBeInTheDocument();
  });

  it("renders Respond and Reject buttons when status is PENDING", () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.getByText("Respond")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("calls onRespondClick with 'respond' on Respond button click", async () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const respondButton = screen.getByText("Respond");
    fireEvent.click(respondButton);
    expect(onRespondClick).toHaveBeenCalledWith(mockItem, "respond");
  });

  it("calls onRespondClick with 'reject' on Reject button click", async () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const rejectButton = screen.getByText("Reject");
    fireEvent.click(rejectButton);
    expect(onRespondClick).toHaveBeenCalledWith(mockItem, "reject");
  });

  it("displays summary when status is RESOLVED", () => {
    const resolvedItem = { ...mockItem, status: "RESOLVED" };
    render(
      <OperatorCard
        item={resolvedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText(mockItem.comment)).toBeInTheDocument();
  });

  it("does not display summary when status is PENDING", () => {
    render(
      <OperatorCard
        item={mockItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    expect(screen.queryByText("Summary")).not.toBeInTheDocument();
  });
});
