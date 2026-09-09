import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tenantRoutes from "./routes/tenant.routes";
import { errorHandler } from "./middlewares/errorHandler";

// Load Dotenv configuration
dotenv.config();

// Creating Express and configuring PORT
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow clients to make requests
app.use(express.json()); // Allow express to parse JSON

// Basic Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Hostee server is running successfully",
    timestamp: new Date().toISOString(),
  });
});

// Module Routes
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
