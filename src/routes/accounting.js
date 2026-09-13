import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get financial overview & double-entry metrics
router.get("/overview", (req, res) => {
  const f = store.financials;
  res.json({
    success: true,
    financials: {
      ...f,
      targetMarginPct: store.adminConfig.targetClinicMarginPct,
      currency: store.adminConfig.currency
    }
  });
});

// Get all invoices with payment status and staff collection logs
router.get("/invoices", (req, res) => {
  res.json({
    success: true,
    invoices: store.financials.invoices
  });
});

// Create new procedure invoice with automated double-entry ledger allocation
router.post("/invoices", (req, res) => {
  const { patientName, procedureName, doctorName, totalAmount, patientCoPayAmount, insuranceClaimAmount, payor, collectedBy, paymentMethod } = req.body;

  const newInvoice = {
    id: `INV-${Date.now().toString().slice(-4)}`,
    patientName,
    procedureName,
    doctorName,
    totalAmount: Number(totalAmount),
    patientCoPayAmount: Number(patientCoPayAmount || 0),
    insuranceClaimAmount: Number(insuranceClaimAmount || 0),
    payor: payor || "Direct Self-Pay",
    status: patientCoPayAmount > 0 ? "Co-Pay Collected" : "Pending Verification",
    collectedBy: collectedBy || "Front Desk & Nursing Team",
    paymentMethod: paymentMethod || "Credit Card",
    createdAt: new Date().toISOString()
  };

  store.financials.invoices.unshift(newInvoice);

  // Update revenue & cash collection totals
  store.financials.monthToDateRevenue += newInvoice.totalAmount;
  if (paymentMethod === "Cash") {
    store.financials.cashCollectedToday += newInvoice.patientCoPayAmount;
  } else {
    store.financials.cardCollectedToday += newInvoice.patientCoPayAmount;
  }

  // Double-entry ledger audit
  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: "Automated Double-Entry Engine",
    category: "ACCOUNTING_POSTING",
    action: `Created Invoice #${newInvoice.id} ($${newInvoice.totalAmount}). DR Accounts Receivable / CR Service Revenue. Co-pay $${newInvoice.patientCoPayAmount} logged.`,
    severity: "INFO"
  });

  res.json({ success: true, invoice: newInvoice });
});

// Tax Settlement Engine: Calculate and auto-file quarterly tax liability
router.post("/tax-settlement/execute", (req, res) => {
  const currentTax = store.financials.taxSettlement;
  const settlementHash = `TAX-VOUCHER-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const settlementReceipt = {
    receiptId: settlementHash,
    settlementTimestamp: new Date().toISOString(),
    period: store.financials.period,
    grossTaxableRevenue: currentTax.taxableGrossRevenueMTD,
    vatRateAppliedPct: currentTax.vatRatePct,
    vatAmountSettled: currentTax.netVatLiabilityDue,
    withholdingTaxSettled: currentTax.withholdingTaxWithheldMTD,
    corporateTaxAccrued: currentTax.quarterlyEstimatedCorporateTax,
    totalSettledPayment: currentTax.totalPendingSettlement,
    filingStatus: "Electronically Certified & Cleared",
    clearingAgent: "Ministry of Finance & Tax Authority Direct Gateway"
  };

  // Reset or mark settled
  store.financials.taxSettlement.status = "Settled & Cleared";
  store.financials.taxSettlement.lastSettlementDate = new Date().toISOString().split("T")[0];
  store.financials.taxSettlement.complianceVerificationHash = settlementHash;
  store.financials.taxSettlement.totalPendingSettlement = 0;

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Chief Financial Officer",
    category: "TAX_SETTLEMENT_EXECUTED",
    action: `Quarterly Tax Settlement executed for period ${settlementReceipt.period}. Total $${settlementReceipt.totalSettledPayment} cleared. Certificate: ${settlementHash}`,
    severity: "INFO"
  });

  res.json({
    success: true,
    message: "Tax settlement executed and certified successfully",
    receipt: settlementReceipt,
    currentTaxState: store.financials.taxSettlement
  });
});

export default router;
