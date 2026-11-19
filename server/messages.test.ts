import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicCtx(ip = "1.2.3.4"): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { "x-forwarded-for": ip } } as unknown as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

const valid = {
  name: "Ali Veli",
  phone: "0532 123 45 67",
  email: "",
  subject: "telefon",
  message: "iPhone 16 fiyatı nedir?",
};

describe("İletişim mesajları", () => {
  it("geçersiz telefonu reddeder", async () => {
    const caller = appRouter.createCaller(publicCtx());
    await expect(caller.messages.create({ ...valid, phone: "abc" })).rejects.toThrow();
  });

  it("geçersiz e-postayı reddeder", async () => {
    const caller = appRouter.createCaller(publicCtx());
    await expect(caller.messages.create({ ...valid, email: "x@" })).rejects.toThrow();
  });

  it("honeypot dolu ise kaydetmeden başarılı döner", async () => {
    const caller = appRouter.createCaller(publicCtx());
    expect(await caller.messages.create({ ...valid, website: "spam.com" })).toEqual({ success: true });
  });

  it("mesaj listesi sadece admin'e açık", async () => {
    const caller = appRouter.createCaller(publicCtx());
    await expect(caller.messages.list()).rejects.toThrow();
    await expect(caller.messages.unreadCount()).rejects.toThrow();
    await expect(caller.messages.delete({ id: 1 })).rejects.toThrow();
  });

  it("aynı IP'den çok fazla mesajı engeller", async () => {
    const caller = appRouter.createCaller(publicCtx("9.9.9.9"));
    const codes: string[] = [];
    for (let i = 0; i < 6; i++) {
      try {
        await caller.messages.create(valid);
        codes.push("ok");
      } catch (e: any) {
        codes.push(e.code);
      }
    }
    // DB yokken ilk 5'i kayıt hatası verir, 6.'sı hız limitine takılır
    expect(codes[5]).toBe("TOO_MANY_REQUESTS");
    expect(codes.slice(0, 5)).not.toContain("TOO_MANY_REQUESTS");
  });
});
