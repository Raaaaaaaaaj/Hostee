import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { AppError } from "../utils/appError";
import { sendResponse } from "../utils/apiResponse";
import { commonAsyncHandler } from "../utils/asyncHandler";

export const registerUser = commonAsyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, role, tenantId, tenantSlug } = req.body;

  // 1. Basic validation
  if (!email || !password || !name) {
    throw new AppError("Please provide name, email, and password.", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Please provide a valid email address.", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long.", 400);
  }

  // 2. Resolve Tenant if provided
  let resolvedTenantId: string | null = tenantId || null;
  if (!resolvedTenantId && tenantSlug) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug.toLowerCase() },
    });
    if (!tenant) {
      throw new AppError(`Hotel tenant with slug '${tenantSlug}' does not exist.`, 404);
    }
    resolvedTenantId = tenant.id;
  }

  // 3. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409);
  }

  // 4. Hash password securely
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Create user in Postgres DB via Prisma
  const user = await prisma.user.create({
    data: {
      tenantId: resolvedTenantId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: role || "HOTEL_ADMIN",
    },
    select: {
      id: true,
      tenantId: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // 6. Generate JWT Token (includes tenantId claim)
  const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
  const token = jwt.sign(
    { id: user.id, tenantId: user.tenantId, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: "7d" }
  );

  // 7. Return sanitized user data & token
  return sendResponse(res, 201, "User registered successfully", {
    user,
    token,
  });
});