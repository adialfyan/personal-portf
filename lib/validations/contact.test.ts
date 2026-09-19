import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Project inquiry",
  message: "Hello, I would like to discuss a project with you.",
};

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = contactSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("defaults optional fields", () => {
    const parsed = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello, I would like to discuss a project with you.",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.subject).toBe("");
      expect(parsed.data.website).toBe("");
      expect(parsed.data.turnstileToken).toBe("");
    }
  });

  it("rejects an invalid email", () => {
    const parsed = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(parsed.success).toBe(false);
  });

  it("rejects a too-short message", () => {
    const parsed = contactSchema.safeParse({ ...valid, message: "Hi" });
    expect(parsed.success).toBe(false);
  });

  it("rejects a too-short name", () => {
    const parsed = contactSchema.safeParse({ ...valid, name: "J" });
    expect(parsed.success).toBe(false);
  });

  it("accepts a filled honeypot at schema level (route drops it silently)", () => {
    const parsed = contactSchema.safeParse({ ...valid, website: "" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.website).toBe("");
    }
  });

  it("accepts a Turnstile token when provided", () => {
    const parsed = contactSchema.safeParse({
      ...valid,
      turnstileToken: "test-token",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.turnstileToken).toBe("test-token");
    }
  });
});
