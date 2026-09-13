import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get nursing and clinical staff roster with performance & attitude metrics
router.get("/staff", (req, res) => {
  res.json({
    success: true,
    nursingStaff: store.nursingStaff
  });
});

// Update or check off a clinical nursing task
router.post("/staff/:id/tasks/:taskIndex/toggle", (req, res) => {
  const { id, taskIndex } = req.params;
  const nurse = store.nursingStaff.find((n) => n.id === id);

  if (!nurse || !nurse.activeTasks[taskIndex]) {
    return res.status(404).json({ success: false, error: "Task or staff member not found" });
  }

  nurse.activeTasks[taskIndex].done = !nurse.activeTasks[taskIndex].done;

  // Recalculate tasks completed percentage
  const doneCount = nurse.activeTasks.filter((t) => t.done).length;
  nurse.tasksCompletedPct = Math.round((doneCount / nurse.activeTasks.length) * 100);

  res.json({
    success: true,
    nurse
  });
});

// Submit patient/supervisor feedback on nurse attitude, empathy & punctuality
router.post("/staff/:id/attitude-rating", (req, res) => {
  const { id } = req.params;
  const { attitudeRating, empathyRating, punctualityConfirmed = true, reviewComment } = req.body;

  const nurse = store.nursingStaff.find((n) => n.id === id);
  if (!nurse) {
    return res.status(404).json({ success: false, error: "Nurse not found" });
  }

  if (attitudeRating) {
    // Weighted moving average
    nurse.bedsideAttitudeScore = Number(((nurse.bedsideAttitudeScore * 0.85) + (Number(attitudeRating) * 0.15)).toFixed(2));
  }
  if (empathyRating) {
    nurse.empathyRating = Number(((nurse.empathyRating * 0.85) + (Number(empathyRating) * 0.15)).toFixed(2));
  }
  if (punctualityConfirmed) {
    nurse.onTimeArrivalsThisMonth += 1;
    nurse.punctualityScorePct = Math.min(100, Number((nurse.punctualityScorePct + 0.2).toFixed(1)));
  }

  if (reviewComment) {
    nurse.patientFeedbackHighlights = reviewComment;
  }

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Attending Doctor / Patient",
    category: "STAFF_ATTITUDE_EVAL",
    action: `Submitted attitude score (${nurse.bedsideAttitudeScore}/5) for ${nurse.name}. Punctuality: ${nurse.punctualityScorePct}%.`,
    severity: "INFO"
  });

  res.json({
    success: true,
    message: "Staff performance and attitude rating updated",
    nurse
  });
});

// Cash collection reconciliation check
router.post("/staff/:id/reconcile-collection", (req, res) => {
  const { id } = req.params;
  const { verifiedCashAmount, cashierSupervisor } = req.body;

  const nurse = store.nursingStaff.find((n) => n.id === id);
  if (!nurse) {
    return res.status(404).json({ success: false, error: "Nurse not found" });
  }

  const discrepancy = Number(verifiedCashAmount) - nurse.moneyCollectedToday;
  if (discrepancy === 0) {
    nurse.cashHandlingFidelityPct = 100.0;
  } else {
    nurse.reconciliationDiscrepancies += 1;
    nurse.cashHandlingFidelityPct = Number((100 - (Math.abs(discrepancy) / (nurse.moneyCollectedToday || 1)) * 10).toFixed(1));
  }

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: cashierSupervisor || req.user?.name || "Front Desk Lead",
    category: "CASH_RECONCILIATION",
    action: `Shift cash audit completed for ${nurse.name}. Collected: $${nurse.moneyCollectedToday}, Verified: $${verifiedCashAmount}. Discrepancy: $${discrepancy}.`,
    severity: discrepancy === 0 ? "INFO" : "WARNING"
  });

  res.json({
    success: true,
    discrepancy,
    verified: discrepancy === 0,
    nurse
  });
});

export default router;
