import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get growth and marketing dashboard metrics
router.get("/metrics", (req, res) => {
  const m = store.marketing;
  res.json({
    success: true,
    marketing: m
  });
});

// Launch a new targeted patient acquisition campaign
router.post("/campaigns", (req, res) => {
  const { name, channel, budget, targetSpecialty } = req.body;

  const cost = Number(budget || 5000);
  const newCampaign = {
    id: `cmp-${Date.now().toString().slice(-4)}`,
    name,
    channel,
    budget: cost,
    spent: Math.round(cost * 0.15),
    impressions: Math.round(cost * 12),
    clicks: Math.round(cost * 0.35),
    inquiries: Math.round(cost * 0.03),
    bookedAppointments: Math.round(cost * 0.008),
    cac: 92.5,
    revenueGenerated: Math.round(cost * 3.4),
    status: "Active - Newly Launched",
    targetSpecialty: targetSpecialty || "Cardiology"
  };

  store.marketing.activeCampaigns.unshift(newCampaign);
  store.marketing.monthlyBudget += cost;

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: req.user?.name || "Growth & Marketing Lead",
    category: "MARKETING_CAMPAIGN",
    action: `Launched marketing campaign "${newCampaign.name}" for ${newCampaign.targetSpecialty} with budget $${newCampaign.budget}.`,
    severity: "INFO"
  });

  res.json({ success: true, campaign: newCampaign });
});

export default router;
