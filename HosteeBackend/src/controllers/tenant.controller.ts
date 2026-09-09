import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { AppError } from "../utils/appError";
import { sendResponse } from "../utils/apiResponse";
import { commonAsyncHandler } from "../utils/asyncHandler";

// 1. Create a new Hotel Tenant & optional initial Hotel Admin
export const createTenant = commonAsyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    slug,
    customDomain,
    subscriptionTier,
    adminName,
    adminEmail,
    adminPassword,
  } = req.body;

  if (!name || !slug) {
    throw new AppError("Hotel name and slug (e.g. 'hotel1') are required.", 400);
  }

  // Sanitize slug (lowercase, hyphenated)
  const formattedSlug = (slug as string).toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

  // Check if tenant slug already exists
  const existingTenant = await prisma.tenant.findUnique({
    where: { slug: formattedSlug },
  });

  if (existingTenant) {
    throw new AppError(`A hotel tenant with slug '${formattedSlug}' already exists.`, 409);
  }

  if (customDomain) {
    const existingDomain = await prisma.tenant.findUnique({
      where: { customDomain: customDomain as string },
    });
    if (existingDomain) {
      throw new AppError(`Domain '${customDomain}' is already registered to another hotel.`, 409);
    }
  }

  // If admin details are provided, hash password & create tenant + admin in a single transaction
  let result;
  if (adminEmail && adminPassword && adminName) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      throw new AppError("Please provide a valid admin email address.", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: (adminEmail as string).toLowerCase() },
    });

    if (existingUser) {
      throw new AppError("An admin user with this email already exists.", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name,
          slug: formattedSlug,
          customDomain: customDomain || null,
          subscriptionTier: subscriptionTier || "FREE",
        },
      });

      const adminUser = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: adminName,
          email: (adminEmail as string).toLowerCase(),
          password: hashedPassword,
          role: "HOTEL_ADMIN",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          tenantId: true,
          createdAt: true,
        },
      });

      return { tenant, adminUser };
    });
  } else {
    // Create tenant without initial admin user
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug: formattedSlug,
        customDomain: customDomain || null,
        subscriptionTier: subscriptionTier || "FREE",
      },
    });
    result = { tenant, adminUser: null };
  }

  return sendResponse(res, 201, "Hotel tenant created successfully", result);
});

// 2. Get all registered Hotel Tenants
export const getTenants = commonAsyncHandler(async (req: Request, res: Response) => {
  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: { users: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sendResponse(res, 200, "Hotel tenants fetched successfully", tenants);
});

// 3. Get Tenant details by Slug (e.g., /api/tenants/hotel1)
export const getTenantBySlug = commonAsyncHandler(async (req: Request, res: Response) => {
  const slugParam = req.params.slug as string;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: slugParam.toLowerCase() },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });

  if (!tenant) {
    throw new AppError(`Hotel tenant with slug '${slugParam}' not found.`, 404);
  }

  return sendResponse(res, 200, "Hotel tenant details fetched successfully", tenant);
});

// 4. Update Hotel Tenant
export const updateTenant = commonAsyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.params.id as string;
  const { name, slug, customDomain, subscriptionTier, status } = req.body;

  const existingTenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!existingTenant) {
    throw new AppError("Hotel tenant not found.", 404);
  }

  let formattedSlug = existingTenant.slug;
  if (slug && slug !== existingTenant.slug) {
    formattedSlug = (slug as string).toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    const slugExists = await prisma.tenant.findFirst({
      where: { slug: formattedSlug, NOT: { id: tenantId } },
    });
    if (slugExists) {
      throw new AppError(`Slug '${formattedSlug}' is already taken by another hotel.`, 409);
    }
  }

  if (customDomain && customDomain !== existingTenant.customDomain) {
    const domainExists = await prisma.tenant.findFirst({
      where: { customDomain: customDomain as string, NOT: { id: tenantId } },
    });
    if (domainExists) {
      throw new AppError(`Custom domain '${customDomain}' is already used by another hotel.`, 409);
    }
  }

  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      name: name || existingTenant.name,
      slug: formattedSlug,
      customDomain: customDomain !== undefined ? customDomain : existingTenant.customDomain,
      subscriptionTier: subscriptionTier || existingTenant.subscriptionTier,
      status: status || existingTenant.status,
    },
    include: {
      _count: { select: { users: true } },
    },
  });

  return sendResponse(res, 200, "Hotel tenant updated successfully", updatedTenant);
});

// 5. Delete Hotel Tenant
export const deleteTenant = commonAsyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.params.id as string;

  const existingTenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!existingTenant) {
    throw new AppError("Hotel tenant not found.", 404);
  }

  await prisma.tenant.delete({
    where: { id: tenantId },
  });

  return sendResponse(res, 200, `Hotel tenant '${existingTenant.name}' deleted successfully.`);
});
