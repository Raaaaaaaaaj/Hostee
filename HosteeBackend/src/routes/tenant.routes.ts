import { Router } from "express";
import {
  createTenant,
  getTenants,
  getTenantBySlug,
  updateTenant,
  deleteTenant,
} from "../controllers/tenant.controller";

const router = Router();

// POST /api/tenants - Create a new hotel tenant (e.g. hotel1)
router.post("/", createTenant);

// GET /api/tenants - List all hotel tenants
router.get("/", getTenants);

// GET /api/tenants/:slug - Get hotel details and users by slug (e.g. /api/tenants/hotel1)
router.get("/:slug", getTenantBySlug);

// PUT /api/tenants/:id - Update hotel tenant details
router.put("/:id", updateTenant);

// DELETE /api/tenants/:id - Delete hotel tenant
router.delete("/:id", deleteTenant);

export default router;
