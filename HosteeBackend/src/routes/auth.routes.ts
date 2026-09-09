import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/register - Register a new user
router.post("/register", registerUser);

export default router;
