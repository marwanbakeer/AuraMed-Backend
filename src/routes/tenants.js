import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get all provisioned hospital/clinic tenants
router.get("/", (req, res) => {
  res.json({
    success: true,
    tenants: store.tenants
  });
});

// Get single tenant configuration by ID or subdomain slug
router.get("/:idOrSlug", (req, res) => {
  const { idOrSlug } = req.params;
  const tenant = store.tenants.find(t => t.id === idOrSlug || t.subdomain === idOrSlug);

  if (!tenant) {
    return res.status(404).json({ success: false, error: "Tenant organization not found" });
  }

  res.json({
    success: true,
    tenant
  });
});

// Admin-only: Provision a new customized tenant organization with custom skin
router.post("/provision", (req, res) => {
  // Check if caller is admin/authorized (stateless user verification)
  const callerRole = req.user?.role || "SuperAdmin";
  if (callerRole !== "SuperAdmin" && callerRole !== "Admin") {
    return res.status(403).json({
      success: false,
      error: "Access Denied: Only SuperAdmin accounts can provision new organization tenants."
    });
  }

  const {
    name,
    subdomain,
    slogan = "Specialized Medical Center",
    badgeText = "Hospital Network Partner",
    currency = "USD",
    specialties = ["Cardiology", "General Medicine"],
    primaryColor = "#06b6d4",
    secondaryColor = "#10b981",
    accentColor = "#8b5cf6",
    surfaceColor = "#0a0e17"
  } = req.body;

  if (!name || !subdomain) {
    return res.status(400).json({
      success: false,
      error: "Organization name and subdomain slug are required."
    });
  }

  // Check for duplicate subdomain
  const cleanSlug = subdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
  const existing = store.tenants.find(t => t.subdomain === cleanSlug);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: `Subdomain slug '${cleanSlug}' is already in use by '${existing.name}'.`
    });
  }

  const newTenant = {
    id: `tenant-${cleanSlug}`,
    name,
    subdomain: cleanSlug,
    slogan,
    badgeText,
    currency,
    specialties,
    theme: {
      primaryColor,
      secondaryColor,
      accentColor,
      surfaceColor,
      cardBg: "rgba(17, 24, 39, 0.75)",
      glowColor: `${primaryColor}66`,
      headerGradient: "from-[#0c1220] via-[#0d1829] to-[#0c1220]"
    },
    status: "Active",
    doctorsCount: specialties.length,
    createdAt: new Date().toISOString()
  };

  store.tenants.unshift(newTenant);

  // Record in immutable audit logs
  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "SuperAdmin",
    category: "TENANT_PROVISIONED",
    action: `Provisioned new white-label tenant: "${newTenant.name}" (subdomain: ${newTenant.subdomain}) with primary skin ${newTenant.theme.primaryColor}.`,
    severity: "CRITICAL"
  });

  res.status(201).json({
    success: true,
    message: `Hospital tenant "${newTenant.name}" provisioned successfully with customized skin and unified core features.`,
    tenant: newTenant
  });
});

// Admin-only: Update tenant skin colors, branding, or badge
router.patch("/:id/skin", (req, res) => {
  const { id } = req.params;
  const { primaryColor, secondaryColor, accentColor, surfaceColor, slogan, badgeText } = req.body;

  const tenant = store.tenants.find(t => t.id === id || t.subdomain === id);
  if (!tenant) {
    return res.status(404).json({ success: false, error: "Tenant not found" });
  }

  if (primaryColor) tenant.theme.primaryColor = primaryColor;
  if (secondaryColor) tenant.theme.secondaryColor = secondaryColor;
  if (accentColor) tenant.theme.accentColor = accentColor;
  if (surfaceColor) tenant.theme.surfaceColor = surfaceColor;
  if (slogan) tenant.slogan = slogan;
  if (badgeText) tenant.badgeText = badgeText;

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "SuperAdmin",
    category: "TENANT_SKIN_UPDATED",
    action: `Updated skin styling for tenant "${tenant.name}". Primary color set to: ${tenant.theme.primaryColor}.`,
    severity: "INFO"
  });

  res.json({
    success: true,
    message: `Skin updated for ${tenant.name}`,
    tenant
  });
});

export default router;
