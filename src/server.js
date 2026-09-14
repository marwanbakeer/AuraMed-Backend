import express from "express";
import cors from "cors";
import authRoutes, { requireAuth } from "./routes/auth.js";
import clinicalRoutes from "./routes/clinical.js";
import accountingRoutes from "./routes/accounting.js";
import supplyChainRoutes from "./routes/supplyChain.js";
import equipmentRoutes from "./routes/equipment.js";
import nursingRoutes from "./routes/nursing.js";
import growthRoutes from "./routes/growth.js";
import insuranceRoutes from "./routes/insurance.js";
import patientPortalRoutes from "./routes/patientPortal.js";
import adminRoutes from "./routes/admin.js";
import tenantRoutes from "./routes/tenants.js";

const app = express();
const PORT = process.env.PORT || 5000;

// High-performance middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request latency tracking for telemetry
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 50) {
      console.log(`[LATENCY ALERT] ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "AuraMed Enterprise OS Core",
    version: "2.4.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Mount stateless API routes
app.use("/api/auth", authRoutes);
app.use("/api/clinical", requireAuth, clinicalRoutes);
app.use("/api/accounting", requireAuth, accountingRoutes);
app.use("/api/supply-chain", requireAuth, supplyChainRoutes);
app.use("/api/equipment", requireAuth, equipmentRoutes);
app.use("/api/nursing", requireAuth, nursingRoutes);
app.use("/api/growth", requireAuth, growthRoutes);
app.use("/api/insurance", requireAuth, insuranceRoutes);
app.use("/api/patient-portal", patientPortalRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/admin", requireAuth, adminRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Resource not found",
    path: req.path
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
    details: err.message
  });
});

import { fileURLToPath } from "url";

const isDirectRun = process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  AURAMED ENTERPRISE OS - HIGH-THROUGHPUT CORE READY   `);
    console.log(`  Listening on http://localhost:${PORT}                `);
    console.log(`  Mode: Stateless High-Throughput Cluster              `);
    console.log(`=======================================================`);
  });
}

export default app;
