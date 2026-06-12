import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getAllPhones, getPhoneById, createPhone, updatePhone, deletePhone,
  getAllPackages, getPackageById, createPackage, updatePackage, deletePackage,
  getAllAccessories, getAccessoryById, createAccessory, updateAccessory, deleteAccessory,
  getAllSuperbox, getSuperboxById, createSuperbox, updateSuperbox, deleteSuperbox,
} from "./db";

// ============ VALIDATION SCHEMAS ============

const phoneInput = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().int().positive(),
  oldPrice: z.number().int().positive().nullable().optional(),
  image: z.string().min(1),
  storage: z.string().min(1),
  ram: z.string().min(1),
  screen: z.string().min(1),
  camera: z.string().min(1),
  battery: z.string().min(1),
  color: z.string().min(1),
  badge: z.string().nullable().optional(),
  installment: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const featuresJson = z.string().refine(value => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every(item => typeof item === "string");
  } catch {
    return false;
  }
}, { message: 'Özellikler geçerli bir JSON dizi olmalıdır, örn: ["BiP ücretsiz"]' });

const packageInput = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(["faturali", "faturasiz", "genc"]),
  internet: z.string().min(1),
  minutes: z.string().min(1),
  sms: z.string().min(1),
  price: z.number().int().positive(),
  popular: z.boolean().optional(),
  features: featuresJson.nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const accessoryInput = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().int().positive(),
  image: z.string().min(1),
  brand: z.string().min(1),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

function isDuplicateEntryError(error: unknown): boolean {
  return error instanceof Error && /ER_DUP_ENTRY|Duplicate entry/i.test(error.message);
}

function rethrowFriendly(error: unknown, entityLabel: string): never {
  if (isDuplicateEntryError(error)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: `Bu slug ile kayıtlı bir ${entityLabel} zaten var. Lütfen farklı bir slug kullanın.`,
    });
  }
  throw error;
}

const superboxInput = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  speed: z.string().min(1),
  quota: z.string().min(1),
  commitment: z.string().min(1),
  price: z.number().int().positive(),
  bonus: z.string().nullable().optional(),
  bonusDetail: z.string().nullable().optional(),
  isOnlineExclusive: z.boolean().optional(),
  popular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ PUBLIC PHONE ROUTES ============
  phones: router({
    list: publicProcedure.query(async () => {
      return getAllPhones(true);
    }),
    listAll: adminProcedure.query(async () => {
      return getAllPhones(false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getPhoneById(input.id);
    }),
    create: adminProcedure.input(phoneInput).mutation(async ({ input }) => {
      const id = await createPhone(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({ id: z.number(), data: phoneInput.partial() })).mutation(async ({ input }) => {
      await updatePhone(input.id, input.data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deletePhone(input.id);
      return { success: true };
    }),
  }),

  // ============ PUBLIC PACKAGE ROUTES ============
  packages: router({
    list: publicProcedure.query(async () => {
      return getAllPackages(true);
    }),
    listAll: adminProcedure.query(async () => {
      return getAllPackages(false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getPackageById(input.id);
    }),
    create: adminProcedure.input(packageInput).mutation(async ({ input }) => {
      try {
        const id = await createPackage(input);
        return { id };
      } catch (error) {
        rethrowFriendly(error, "paket");
      }
    }),
    update: adminProcedure.input(z.object({ id: z.number(), data: packageInput.partial() })).mutation(async ({ input }) => {
      try {
        await updatePackage(input.id, input.data);
        return { success: true };
      } catch (error) {
        rethrowFriendly(error, "paket");
      }
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deletePackage(input.id);
      return { success: true };
    }),
  }),

  // ============ PUBLIC ACCESSORY ROUTES ============
  accessories: router({
    list: publicProcedure.query(async () => {
      return getAllAccessories(true);
    }),
    listAll: adminProcedure.query(async () => {
      return getAllAccessories(false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getAccessoryById(input.id);
    }),
    create: adminProcedure.input(accessoryInput).mutation(async ({ input }) => {
      const id = await createAccessory(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({ id: z.number(), data: accessoryInput.partial() })).mutation(async ({ input }) => {
      await updateAccessory(input.id, input.data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteAccessory(input.id);
      return { success: true };
    }),
  }),

  // ============ SUPERBOX ROUTES ============
  superbox: router({
    list: publicProcedure.query(async () => {
      return getAllSuperbox(true);
    }),
    listAll: adminProcedure.query(async () => {
      return getAllSuperbox(false);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getSuperboxById(input.id);
    }),
    create: adminProcedure.input(superboxInput).mutation(async ({ input }) => {
      const id = await createSuperbox(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({ id: z.number(), data: superboxInput.partial() })).mutation(async ({ input }) => {
      await updateSuperbox(input.id, input.data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteSuperbox(input.id);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
