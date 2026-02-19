import { describe, expect, it } from "vitest";

describe("Admin Auth - Environment Variables", () => {
  it("should have ADMIN_USERNAME set", () => {
    const username = process.env.ADMIN_USERNAME;
    expect(username).toBeDefined();
    expect(typeof username).toBe("string");
    expect(username!.length).toBeGreaterThan(0);
  });

  it("should have ADMIN_PASSWORD set", () => {
    const password = process.env.ADMIN_PASSWORD;
    expect(password).toBeDefined();
    expect(typeof password).toBe("string");
    expect(password!.length).toBeGreaterThan(0);
  });

  it("should have ADMIN_USERNAME equal to 'admin'", () => {
    expect(process.env.ADMIN_USERNAME).toBe("admin");
  });

  it("should have ADMIN_PASSWORD equal to 'admin123'", () => {
    expect(process.env.ADMIN_PASSWORD).toBe("admin123");
  });
});

describe("Admin Auth - ADMIN_COOKIE_NAME constant", () => {
  it("should export ADMIN_COOKIE_NAME from shared/const", async () => {
    const { ADMIN_COOKIE_NAME } = await import("../shared/const");
    expect(ADMIN_COOKIE_NAME).toBe("admin_session");
  });
});

describe("Admin Auth - ENV config", () => {
  it("should expose adminUsername and adminPassword in ENV", async () => {
    const { ENV } = await import("./_core/env");
    expect(ENV.adminUsername).toBe("admin");
    expect(ENV.adminPassword).toBe("admin123");
  });
});
