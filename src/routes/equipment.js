import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get all biomedical machines, service statuses and maintenance alerts
router.get("/machines", (req, res) => {
  res.json({
    success: true,
    machines: store.machines
  });
});

// Log or complete machine servicing & calibration
router.post("/machines/:id/service", (req, res) => {
  const { id } = req.params;
  const { technicianNotes, serviceCompany, recalibrationCompleted } = req.body;

  const machine = store.machines.find((m) => m.id === id);
  if (!machine) {
    return res.status(404).json({ success: false, error: "Machine asset not found" });
  }

  machine.status = "Optimal";
  machine.healthScore = Math.min(100, machine.healthScore + 18);
  machine.downtimeRiskPct = Math.max(1.5, machine.downtimeRiskPct - 14);
  machine.lastServiceDate = new Date().toISOString().split("T")[0];
  
  // Set next service date 90 days out
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 90);
  machine.nextServiceDate = nextDate.toISOString().split("T")[0];

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Biomedical Systems Engineer",
    category: "EQUIPMENT_MAINTENANCE",
    action: `Preventative Maintenance & Calibration certified for ${machine.name} (${machine.serialNumber}). Status restored to Optimal. Downtime risk dropped to ${machine.downtimeRiskPct}%.`,
    severity: "INFO"
  });

  res.json({
    success: true,
    message: "Machine maintenance and calibration certified successfully",
    machine
  });
});

// CapEx Modernization Opportunities: list pipeline
router.get("/modernization-pipeline", (req, res) => {
  res.json({
    success: true,
    opportunities: store.modernizationOpportunities
  });
});

// Interactive CapEx ROI Modeler for Purchasing Modern Medical Equipment
router.post("/model-capex-roi", (req, res) => {
  const {
    productName = "New Medical Diagnostic System",
    purchaseCost = 500000,
    estimatedWeeklyPatients = 25,
    averageProcedureCharge = 800,
    monthlyOperatingCost = 6000,
    expectedLifespanYears = 7
  } = req.body;

  const cost = Number(purchaseCost);
  const weeklyPatients = Number(estimatedWeeklyPatients);
  const procedureFee = Number(averageProcedureCharge);
  const operatingCost = Number(monthlyOperatingCost);
  const lifespanYears = Number(expectedLifespanYears);

  const monthlyProcedures = weeklyPatients * 4.33;
  const monthlyGrossRevenue = Math.round(monthlyProcedures * procedureFee);
  const monthlyNetOperatingIncome = Math.round(monthlyGrossRevenue - operatingCost);
  const annualNetIncome = monthlyNetOperatingIncome * 12;

  const paybackPeriodMonths = monthlyNetOperatingIncome > 0
    ? Number((cost / monthlyNetOperatingIncome).toFixed(1))
    : 999;

  const yearOneRoiPct = monthlyNetOperatingIncome > 0
    ? Number(((annualNetIncome / cost) * 100).toFixed(1))
    : 0;

  const totalLifespanNetGain = Math.round((monthlyNetOperatingIncome * 12 * lifespanYears) - cost);

  const simulation = {
    productName,
    purchaseCost: cost,
    monthlyGrossRevenue,
    monthlyNetOperatingIncome,
    annualNetIncome,
    paybackPeriodMonths,
    yearOneRoiPct,
    totalLifespanNetGain,
    recommendation: paybackPeriodMonths <= 12
      ? "Strong Buy - High Margin Acceleration"
      : paybackPeriodMonths <= 24
      ? "Viable Investment - Steady Patient Experience Uplift"
      : "High Risk - Requires Increased Patient Booking Density"
  };

  res.json({ success: true, simulation });
});

// Add new CapEx opportunity to pipeline
router.post("/modernization-pipeline", (req, res) => {
  const {
    productName,
    manufacturer,
    purchaseCost,
    expectedLifespanYears,
    estimatedWeeklyPatients,
    averageProcedureCharge,
    monthlyOperatingCost,
    patientExperienceUplift
  } = req.body;

  const cost = Number(purchaseCost);
  const monthlyNet = (Number(estimatedWeeklyPatients) * 4.33 * Number(averageProcedureCharge)) - Number(monthlyOperatingCost);
  const paybackMonths = monthlyNet > 0 ? Number((cost / monthlyNet).toFixed(1)) : 12;

  const newOpp = {
    id: `capex-${Date.now().toString().slice(-4)}`,
    productName,
    manufacturer: manufacturer || "Global MedTech OEM",
    purchaseCost: cost,
    expectedLifespanYears: Number(expectedLifespanYears || 7),
    estimatedWeeklyPatients: Number(estimatedWeeklyPatients || 20),
    averageProcedureCharge: Number(averageProcedureCharge || 500),
    monthlyOperatingCost: Number(monthlyOperatingCost || 4000),
    monthlyRevenueUplift: Math.round(monthlyNet),
    paybackPeriodMonths: paybackMonths,
    patientExperienceUplift: patientExperienceUplift || "Modernizes clinical imaging with ultra-fast acquisition time",
    status: "Proposed & Under Review"
  };

  store.modernizationOpportunities.push(newOpp);

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Biomedical & Clinical Director",
    category: "CAPEX_PROPOSAL",
    action: `Submitted CapEx acquisition proposal for "${newOpp.productName}" ($${newOpp.purchaseCost}). Payback: ${newOpp.paybackPeriodMonths} mos.`,
    severity: "INFO"
  });

  res.json({ success: true, opportunity: newOpp });
});

export default router;
