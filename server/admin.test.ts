import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user-123",
    email: "admin@goksoylar.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "normal-user-456",
    email: "user@example.com",
    name: "Normal User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAnonymousContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Public API endpoints", () => {
  it("phones.list is accessible without auth", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.phones.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("packages.list is accessible without auth", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.packages.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("accessories.list is accessible without auth", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.accessories.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Admin-only endpoints - access control", () => {
  it("phones.listAll rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.phones.listAll()).rejects.toThrow();
  });

  it("phones.listAll rejects anonymous users", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.phones.listAll()).rejects.toThrow();
  });

  it("packages.listAll rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.packages.listAll()).rejects.toThrow();
  });

  it("accessories.listAll rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.accessories.listAll()).rejects.toThrow();
  });

  it("phones.create rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.phones.create({
        slug: "test-phone",
        name: "Test Phone",
        brand: "Test",
        price: 1000,
        image: "https://example.com/img.jpg",
        storage: "128 GB",
        ram: "8 GB",
        screen: "6.1 inç",
        camera: "48 MP",
        battery: "4000 mAh",
        color: "Siyah",
      })
    ).rejects.toThrow();
  });

  it("packages.create rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.packages.create({
        slug: "test-pkg",
        name: "Test Paket",
        category: "faturali",
        internet: "10 GB",
        minutes: "1000 dk",
        sms: "250 SMS",
        price: 500,
      })
    ).rejects.toThrow();
  });

  it("accessories.create rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.accessories.create({
        slug: "test-acc",
        name: "Test Aksesuar",
        category: "Kulaklık",
        price: 500,
        image: "https://example.com/img.jpg",
        brand: "Test",
      })
    ).rejects.toThrow();
  });

  it("phones.delete rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.phones.delete({ id: 1 })).rejects.toThrow();
  });

  it("packages.delete rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.packages.delete({ id: 1 })).rejects.toThrow();
  });

  it("accessories.delete rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.accessories.delete({ id: 1 })).rejects.toThrow();
  });
});

describe("Admin endpoints - admin access", () => {
  it("phones.listAll is accessible by admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.phones.listAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("packages.listAll is accessible by admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.packages.listAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("accessories.listAll is accessible by admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.accessories.listAll();
    expect(Array.isArray(result)).toBe(true);
  });
});
