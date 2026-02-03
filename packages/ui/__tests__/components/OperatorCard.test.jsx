import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, describe, vi } from "vitest";
import OperatorCard from "../../src/components/operatorcard/OperatorCard";
import { MOCK_OPERATOR_CARD_DATA } from "../../src/utils/Constants";
import { formatDate } from "../../src/utils/Helpers";

const onRespondClick = vi.fn();

describe("OperatorCard Component", () => {
  it("shows request ID, status, and opened date", () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const requestId = screen.getByText(
      `Ticket #${MOCK_OPERATOR_CARD_DATA._id.slice(-8)}`
    );
    expect(requestId).toBeInTheDocument();
    const status = screen.getByText(MOCK_OPERATOR_CARD_DATA.status);
    expect(status).toBeInTheDocument();
    const openedDate = screen.getByText(
      formatDate(MOCK_OPERATOR_CARD_DATA.openedAt)
    );
    expect(openedDate).toBeInTheDocument();
  });

  it("show closed date when status is RESOLVED or REJECTED", () => {
    const resolvedItem = { ...MOCK_OPERATOR_CARD_DATA, status: "RESOLVED" };
    render(
      <OperatorCard
        item={resolvedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const closedDate = screen.getByText(
      `- ${formatDate(MOCK_OPERATOR_CARD_DATA.closedAt)}`
    );
    expect(closedDate).toBeInTheDocument();

    const rejectedItem = { ...MOCK_OPERATOR_CARD_DATA, status: "REJECTED" };
    render(
      <OperatorCard
        item={rejectedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const closedDates = screen.getAllByText(
      `- ${formatDate(MOCK_OPERATOR_CARD_DATA.closedAt)}`
    );
    expect(closedDates.length).toBe(2);
  });

  it("does not show closed date when status is PENDING", () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const closedDate = screen.queryByText(/Closed at/);
    expect(closedDate).not.toBeInTheDocument();
  });

  it('displays user name and email when searchType is "messages"', () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const name = screen.getByText(MOCK_OPERATOR_CARD_DATA.name);
    expect(name).toBeInTheDocument();
    const email = screen.getByText(MOCK_OPERATOR_CARD_DATA.email);
    expect(email).toBeInTheDocument();
  });

  it('displays company URL when searchType is "requests"', () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="requests"
      />
    );
    const companyUrl = screen.getByText(MOCK_OPERATOR_CARD_DATA.companyUrl);
    expect(companyUrl).toBeInTheDocument();
  });

  it('does not display user info when searchType is "requests"', () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="requests"
      />
    );
    const name = screen.queryByText(MOCK_OPERATOR_CARD_DATA.name);
    expect(name).not.toBeInTheDocument();
    const email = screen.queryByText(MOCK_OPERATOR_CARD_DATA.email);
    expect(email).not.toBeInTheDocument();
  });

  it('displays message title when searchType is "messages"', () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const messageTitle = screen.getByText("Message");
    expect(messageTitle).toBeInTheDocument();
  });

  it("displays the correct message content", () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const messageContent = screen.getByText(MOCK_OPERATOR_CARD_DATA.message);
    expect(messageContent).toBeInTheDocument();
  });

  it('does not display message title when searchType is "requests"', () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="requests"
      />
    );
    const messageTitle = screen.queryByText("Message");
    expect(messageTitle).not.toBeInTheDocument();
  });

  it("does not render Respond and Reject buttons when status is RESOLVED", () => {
    const resolvedItem = { ...MOCK_OPERATOR_CARD_DATA, status: "RESOLVED" };
    render(
      <OperatorCard
        item={resolvedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const respondButton = screen.queryByText("Respond");
    expect(respondButton).not.toBeInTheDocument();
    const rejectButton = screen.queryByText("Reject");
    expect(rejectButton).not.toBeInTheDocument();
  });

  it("renders Respond and Reject buttons when status is PENDING", () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const respondButton = screen.getByText("Respond");
    expect(respondButton).toBeInTheDocument();
    const rejectButton = screen.getByText("Reject");
    expect(rejectButton).toBeInTheDocument();
  });

  it("calls onRespondClick with 'respond' on Respond button click", async () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const respondButton = screen.getByText("Respond");
    fireEvent.click(respondButton);
    expect(onRespondClick).toHaveBeenCalledWith(
      MOCK_OPERATOR_CARD_DATA,
      "respond"
    );
  });

  it("calls onRespondClick with 'reject' on Reject button click", async () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const rejectButton = screen.getByText("Reject");
    fireEvent.click(rejectButton);
    expect(onRespondClick).toHaveBeenCalledWith(
      MOCK_OPERATOR_CARD_DATA,
      "reject"
    );
  });

  it("displays summary when status is RESOLVED", () => {
    const resolvedItem = { ...MOCK_OPERATOR_CARD_DATA, status: "RESOLVED" };
    render(
      <OperatorCard
        item={resolvedItem}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const summary = screen.getByText("Summary");
    expect(summary).toBeInTheDocument();
    const comment = screen.getByText(MOCK_OPERATOR_CARD_DATA.comment);
    expect(comment).toBeInTheDocument();
  });

  it("does not display summary when status is PENDING", () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const summary = screen.queryByText("Summary");
    expect(summary).not.toBeInTheDocument();
  });
  it("displays logo preview image when previewUrl is present", () => {
    const itemWithPreview = {
      ...MOCK_OPERATOR_CARD_DATA,
      previewUrl: "https://example.com/preview.png",
    };
    render(
      <OperatorCard
        item={itemWithPreview}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const previewImage = screen.getByAltText("Logo Preview");
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute("src", itemWithPreview.previewUrl);
  });

  it("does not display logo preview image when previewUrl is absent", () => {
    render(
      <OperatorCard
        item={MOCK_OPERATOR_CARD_DATA}
        onRespondClick={onRespondClick}
        searchType="messages"
      />
    );
    const previewImage = screen.queryByAltText("Logo Preview");
    expect(previewImage).not.toBeInTheDocument();
  });
});
