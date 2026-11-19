import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { istanbulDay } from "./db";
import type { TrpcContext } from "./_core/context";

function ctxWithUA(ua: string): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { "user-agent": ua } } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("Ziyaretçi sayacı", () => {
  it("bot ziyaretlerini saymaz", async () => {
    const caller = appRouter.createCaller(ctxWithUA("Mozilla/5.0 (compatible; Googlebot/2.1)"));
    expect(await caller.stats.track({ newVisitor: true })).toEqual({ counted: false });
  });

  it("user-agent yoksa saymaz", async () => {
    const caller = appRouter.createCaller(ctxWithUA(""));
    expect(await caller.stats.track({ newVisitor: true })).toEqual({ counted: false });
  });

  it("veritabanı yokken özet sıfır döner", async () => {
    const caller = appRouter.createCaller(ctxWithUA("Mozilla/5.0"));
    expect(await caller.stats.summary()).toEqual({
      todayVisitors: 0, todayViews: 0, totalVisitors: 0, totalViews: 0,
    });
  });

  it("son günler listesi sadece admin'e açık", async () => {
    const caller = appRouter.createCaller(ctxWithUA("Mozilla/5.0"));
    await expect(caller.stats.recent({ days: 30 })).rejects.toThrow();
  });

  it("Türkiye saatine göre gün hesaplar", () => {
    // 21:30 UTC = ertesi gün 00:30 İstanbul (UTC+3)
    expect(istanbulDay(new Date("2026-11-19T21:30:00Z"))).toBe("2026-11-20");
    expect(istanbulDay(new Date("2026-11-19T20:30:00Z"))).toBe("2026-11-19");
  });
});
