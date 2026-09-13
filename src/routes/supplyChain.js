import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get dynamic procedures with linked materials and pricing calculations
router.get("/procedures", (req, res) => {
  const marginPct = store.adminConfig.targetClinicMarginPct;
  const elasticity = store.adminConfig.dynamicPricingElasticity;

  const procedures = store.procedures.map((proc) => {
    const totalCurrentMaterialCost = proc.materialItems.reduce((acc, m) => acc + m.currentCost, 0);
    const totalBaseMaterialCost = proc.materialItems.reduce((acc, m) => acc + m.baseCost, 0);
    const costChangePct = Number((((totalCurrentMaterialCost - totalBaseMaterialCost) / totalBaseMaterialCost) * 100).toFixed(1));

    // Calculate dynamic fee with margin protection
    const computedFee = Math.round(
      proc.baseDoctorFee + (totalCurrentMaterialCost * (1 + marginPct / 100) * (elasticity > 1 ? 1.05 : 1))
    );

    return {
      ...proc,
      totalCurrentMaterialCost,
      totalBaseMaterialCost,
      marketCostChangePct: costChangePct,
      currentCalculatedFee: proc.doctorOverride || computedFee,
      dynamicAlgorithmActive: !proc.doctorOverride
    };
  });

  res.json({ success: true, procedures });
});

// Update material price (simulates supplier market volatility)
router.post("/materials/:id/update-cost", (req, res) => {
  const { id } = req.params;
  const { newCost, reason = "Global Supplier Index Adjustment" } = req.body;

  let targetItem = null;
  let affectedProcedure = null;

  store.procedures.forEach((proc) => {
    const item = proc.materialItems.find((m) => m.itemId === id);
    if (item) {
      targetItem = item;
      affectedProcedure = proc;
      item.currentCost = Number(newCost);
    }
  });

  if (!targetItem) {
    return res.status(404).json({ success: false, error: "Material item not found" });
  }

  // Recalculate procedure pricing
  const totalCurrentMaterialCost = affectedProcedure.materialItems.reduce((acc, m) => acc + m.currentCost, 0);
  const marginPct = store.adminConfig.targetClinicMarginPct;
  const newCalculatedFee = Math.round(affectedProcedure.baseDoctorFee + (totalCurrentMaterialCost * (1 + marginPct / 100) * 1.05));
  affectedProcedure.currentCalculatedFee = newCalculatedFee;

  // Log in platform audit log
  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Procurement Director",
    category: "DYNAMIC_PRICING_RECALC",
    action: `Material "${targetItem.name}" cost updated to $${newCost}. Procedure "${affectedProcedure.name}" dynamically adapted to $${newCalculatedFee} to protect ${marginPct}% margin. Reason: ${reason}`,
    severity: "INFO"
  });

  res.json({
    success: true,
    message: "Material price updated and procedure fee dynamically adapted",
    item: targetItem,
    procedure: affectedProcedure
  });
});

// Set doctor override on a procedure's fee
router.post("/procedures/:id/override", (req, res) => {
  const { id } = req.params;
  const { overrideFee } = req.body;

  const proc = store.procedures.find((p) => p.id === id);
  if (!proc) {
    return res.status(404).json({ success: false, error: "Procedure not found" });
  }

  proc.doctorOverride = overrideFee ? Number(overrideFee) : null;

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Doctor / Admin",
    category: "FEE_OVERRIDE",
    action: `Procedure "${proc.name}" fee override set to: ${overrideFee ? `$${overrideFee}` : "Dynamic Auto-Calculate"}`,
    severity: "INFO"
  });

  res.json({ success: true, procedure: proc });
});

// Get suppliers marketplace
router.get("/suppliers", (req, res) => {
  res.json({ success: true, suppliers: store.suppliers });
});

// Place purchase order with supplier
router.post("/purchase-orders", (req, res) => {
  const { supplierId, items, totalEstimatedCost, notes } = req.body;

  const supplier = store.suppliers.find((s) => s.id === supplierId);
  if (!supplier) {
    return res.status(404).json({ success: false, error: "Supplier not found" });
  }

  supplier.ordersThisMonth += 1;
  supplier.totalSpendYTD += Number(totalEstimatedCost || 5000);

  const po = {
    poNumber: `PO-${Date.now().toString().slice(-6)}`,
    supplierName: supplier.name,
    estimatedDeliveryDays: supplier.deliverySlaDays,
    totalEstimatedCost: Number(totalEstimatedCost || 5000),
    status: "Confirmed with Supplier",
    orderDate: new Date().toISOString()
  };

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Procurement Director",
    category: "PURCHASE_ORDER",
    action: `Created Purchase Order #${po.poNumber} with ${supplier.name} for $${po.totalEstimatedCost}. Delivery SLA: ${po.estimatedDeliveryDays} days.`,
    severity: "INFO"
  });

  res.json({ success: true, purchaseOrder: po });
});

export default router;
