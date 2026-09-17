const mongoose = require("mongoose");
const Keys = require("../../models/keys");
const { KeyTypes } = require("../../utils/constants");

describe("Keys Model", () => {
  it("should generate publishable_key following pk_<random_identifier> format for PUBLISHABLE key type", () => {
    const keyDoc = new Keys({
      key_type: KeyTypes.PUBLISHABLE,
      key_description: "Frontend Test Key",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    expect(keyDoc.publishable_key).toBeDefined();
    expect(keyDoc.publishable_key).toMatch(/^pk_[a-f0-9]{32}$/);
    expect(keyDoc.publishable_key.startsWith("pk_live_")).toBe(false);
    expect(keyDoc.publishable_key.startsWith("pk_")).toBe(true);
    expect(keyDoc.api_key).toBeUndefined();
  });

  it("should generate api_key and undefined publishable_key for SECRET key type", () => {
    const keyDoc = new Keys({
      key_type: KeyTypes.SECRET,
      key_description: "Backend Secret Key",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    expect(keyDoc.api_key).toBeDefined();
    expect(keyDoc.api_key).toMatch(/^[A-F0-9]{32}$/);
    expect(keyDoc.publishable_key).toBeUndefined();
  });

  it("should include publishable_key in data() serialization for PUBLISHABLE key", () => {
    const keyDoc = new Keys({
      key_type: KeyTypes.PUBLISHABLE,
      key_description: "Frontend Test Key",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const data = keyDoc.data();
    expect(data.publishable_key).toBe(keyDoc.publishable_key);
    expect(data.publishable_key).toMatch(/^pk_[a-f0-9]{32}$/);
    expect(data.key_type).toBe(KeyTypes.PUBLISHABLE);
  });
});
