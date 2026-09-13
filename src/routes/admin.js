import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get admin system telemetry, tuning parameters, and audit logs
router.get("/system-status", (req, res) => {
  res.json({
    success: true,
    config: store.adminConfig,
    metrics: {
      activeDoctors: store.doctors.length,
      activePatients: store.patients.length,
      dailyAppointments: store.appointments.length,
      machinesMonitored: store.machines.length,
      activeCampaigns: store.marketing.activeCampaigns.length,
      unresolvedClaims: store.insuranceClaims.filter((c) => c.status !== "Settled in Full").length,
      nursingStaffCount: store.nursingStaff.length,
      activeSessions: store.adminConfig.activeSessionsCount,
      averageLatencyMs: store.adminConfig.averageLatencyMs,
      cacheHitRatioPct: store.adminConfig.cacheHitRatioPct
    },
    auditLogs: store.auditLogs.slice(0, 50)
  });
});

// Tune platform algorithm parameters (elasticity, margin, tax, commission)
router.post("/tune-parameters", (req, res) => {
  const {
    dynamicPricingElasticity,
    targetClinicMarginPct,
    defaultTaxVatPct,
    defaultTaxWithholdingPct,
    doctorCommissionDefaultPct
  } = req.body;

  if (dynamicPricingElasticity !== undefined) {
    store.adminConfig.dynamicPricingElasticity = Number(dynamicPricingElasticity);
  }
  if (targetClinicMarginPct !== undefined) {
    store.adminConfig.targetClinicMarginPct = Number(targetClinicMarginPct);
  }
  if (defaultTaxVatPct !== undefined) {
    store.adminConfig.defaultTaxVatPct = Number(defaultTaxVatPct);
    store.financials.taxSettlement.vatRatePct = Number(defaultTaxVatPct);
  }
  if (defaultTaxWithholdingPct !== undefined) {
    store.adminConfig.defaultTaxWithholdingPct = Number(defaultTaxWithholdingPct);
    store.financials.taxSettlement.withholdingTaxRatePct = Number(defaultTaxWithholdingPct);
  }
  if (doctorCommissionDefaultPct !== undefined) {
    store.adminConfig.doctorCommissionDefaultPct = Number(doctorCommissionDefaultPct);
  }

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "SuperAdmin",
    category: "PLATFORM_TUNING",
    action: `Updated platform parameters: Elasticity=${store.adminConfig.dynamicPricingElasticity}, Margin=${store.adminConfig.targetClinicMarginPct}%, VAT=${store.adminConfig.defaultTaxVatPct}%, Withholding=${store.adminConfig.defaultTaxWithholdingPct}%.`,
    severity: "WARNING"
  });

  res.json({
    success: true,
    message: "Platform parameters successfully tuned and propagated to all services",
    config: store.adminConfig
  });
});

// Data Rectification Engine: manual override tool for disputed records
router.post("/rectify-record", (req, res) => {
  const { recordType, recordId, field, newValue, reason } = req.body;

  let rectified = false;

  if (recordType === "appointment") {
    const apt = store.appointments.find((a) => a.id === recordId);
    if (apt && apt[field] !== undefined) {
      apt[field] = newValue;
      rectified = true;
    }
  } else if (recordType === "claim") {
    const claim = store.insuranceClaims.find((c) => c.id === recordId);
    if (claim && claim[field] !== undefined) {
      claim[field] = newValue;
      rectified = true;
    }
  } else if (recordType === "invoice") {
    const inv = store.financials.invoices.find((i) => i.id === recordId);
    if (inv && inv[field] !== undefined) {
      inv[field] = newValue;
      rectified = true;
    }
  } else if (recordType === "procedure") {
    const proc = store.procedures.find((p) => p.id === recordId);
    if (proc && proc[field] !== undefined) {
      proc[field] = newValue;
      rectified = true;
    }
  }

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "SuperAdmin Governance",
    category: "DATA_RECTIFICATION",
    action: `Rectified ${recordType} #${recordId} [${field} -> ${newValue}]. Justification: "${reason || "Administrative correction"}".`,
    severity: "CRITICAL"
  });

  res.json({
    success: rectified,
    message: rectified ? "Record successfully rectified" : "Target record or field not found",
    recordType,
    recordId,
    field,
    newValue
  });
});

export default router;
