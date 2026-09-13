import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get all insurance claims and adjudication statuses
router.get("/claims", (req, res) => {
  res.json({
    success: true,
    claims: store.insuranceClaims
  });
});

// Real-time Eligibility & Co-Pay Split Calculator
router.post("/verify-eligibility", (req, res) => {
  const { policyNumber, payorName, procedureFee = 1500 } = req.body;

  // Mock eligibility verification database
  const payorRules = {
    "Allianz Global Health": { coveragePct: 80, preAuthRequired: true, turnaroundDays: 2 },
    "Bupa Worldwide": { coveragePct: 85, preAuthRequired: true, turnaroundDays: 1 },
    "Cigna International Health": { coveragePct: 75, preAuthRequired: true, turnaroundDays: 3 },
    "BlueCross Global Shield": { coveragePct: 90, preAuthRequired: false, turnaroundDays: 1 }
  };

  const rule = payorRules[payorName] || { coveragePct: 70, preAuthRequired: true, turnaroundDays: 3 };
  const total = Number(procedureFee);
  const coveredAmount = Number(((total * rule.coveragePct) / 100).toFixed(2));
  const patientCoPay = Number((total - coveredAmount).toFixed(2));

  res.json({
    success: true,
    eligible: true,
    payorName,
    policyNumber,
    coverageRatioPct: rule.coveragePct,
    procedureFee: total,
    insuranceCoveredAmount: coveredAmount,
    patientCoPayDue: patientCoPay,
    preAuthRequired: rule.preAuthRequired,
    status: "Active & Verified in Payer Gateway"
  });
});

// Submit a new health insurance claim
router.post("/claims", (req, res) => {
  const { patientName, patientId, payor, procedure, totalBilled, coverageRatioPct = 80 } = req.body;

  const billed = Number(totalBilled);
  const ratio = Number(coverageRatioPct);
  const payorAmt = Number(((billed * ratio) / 100).toFixed(2));
  const copayAmt = Number((billed - payorAmt).toFixed(2));

  const newClaim = {
    id: `CLM-${Date.now().toString().slice(-5)}`,
    patientId: patientId || "pat-custom",
    patientName,
    payor,
    procedure,
    totalBilled: billed,
    preAuthNumber: `PA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    coverageRatioPct: ratio,
    approvedPayorAmount: payorAmt,
    patientCoPayAmount: copayAmt,
    status: "Pre-Auth Approved",
    submittedAt: new Date().toISOString(),
    estimatedPayoutDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    disputeNotes: null
  };

  store.insuranceClaims.unshift(newClaim);

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Insurance Coordinator",
    category: "INSURANCE_CLAIM_SUBMITTED",
    action: `Submitted claim #${newClaim.id} for ${newClaim.patientName} to ${newClaim.payor}. Total: $${newClaim.totalBilled} (Co-Pay: $${newClaim.patientCoPayAmount}).`,
    severity: "INFO"
  });

  res.json({ success: true, claim: newClaim });
});

// Settle an insurance claim
router.post("/claims/:id/settle", (req, res) => {
  const { id } = req.params;
  const claim = store.insuranceClaims.find((c) => c.id === id);

  if (!claim) {
    return res.status(404).json({ success: false, error: "Claim not found" });
  }

  claim.status = "Settled in Full";
  claim.settledAt = new Date().toISOString();

  // Deduct from accounts receivable
  store.financials.accountsReceivableTotal = Math.max(0, store.financials.accountsReceivableTotal - claim.approvedPayorAmount);

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Insurance Clearinghouse",
    category: "CLAIM_SETTLED",
    action: `Claim #${claim.id} for $${claim.approvedPayorAmount} settled by ${claim.payor}. Remittance cleared.`,
    severity: "INFO"
  });

  res.json({ success: true, claim });
});

export default router;
