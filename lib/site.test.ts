import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "./site";

const KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_URL", "PORT"] as const;

afterEach(() => {
  for (const key of KEYS) delete process.env[key];
});

describe("getSiteUrl", () => {
  it("prefers the explicit public site URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.dev";
    expect(getSiteUrl()).toBe("https://example.dev");
  });

  it("strips trailing slashes from the explicit URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.dev///";
    expect(getSiteUrl()).toBe("https://example.dev");
  });

  it("falls back to the Vercel deployment URL", () => {
    process.env.VERCEL_URL = "my-app.vercel.app";
    expect(getSiteUrl()).toBe("https://my-app.vercel.app");
  });

  it("falls back to localhost with the configured port", () => {
    process.env.PORT = "4000";
    expect(getSiteUrl()).toBe("http://localhost:4000");
  });

  it("falls back to localhost:3000 by default", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("never returns a placeholder domain", () => {
    expect(getSiteUrl()).not.toContain("example.com");
  });
});
