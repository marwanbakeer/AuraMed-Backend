import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "auramed-secret-key-99482";

// Available personas for stateless quick-switching
const PERSONAS = {
  doctor: {
    id: "doc-1",
    name: "Dr. Elena Rostova",
    role: "Doctor",
    title: "Chief of Cardiology & Vascular Intervention",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    permissions: ["clinical:read", "clinical:write", "referrals:dispatch", "prescriptions:write"]
  },
  cfo: {
    id: "user-cfo",
    name: "Jonathan Vance, CPA",
    role: "CFO",
    title: "Chief Financial & Operations Officer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    permissions: ["finance:read", "finance:write", "tax:settle", "ledger:audit"]
  },
  supply: {
    id: "user-supply",
    name: "Elena Vasquez",
    role: "SupplyDirector",
    title: "Director of Global Procurement & Supply Chain",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    permissions: ["supply:read", "supply:write", "pricing:recalculate", "orders:create"]
  },
  biomedical: {
    id: "user-biomed",
    name: "Ing. Marcus Thorne",
    role: "BiomedicalEngineer",
    title: "Lead Biomedical Systems & Asset Reliability Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    permissions: ["equipment:read", "equipment:service", "capex:model"]
  },
  nurseSupervisor: {
    id: "user-nurse",
    name: "Sarah Jenkins, BSN, RN",
    role: "NurseSupervisor",
    title: "Chief Nursing Officer & Clinical Operations Lead",
    avatar: "https://images.unsplash.com/photo-1594824813686-35a092823a23?auto=format&fit=crop&w=300&q=80",
    permissions: ["nursing:read", "nursing:schedule", "attitude:score", "collections:audit"]
  },
  marketing: {
    id: "user-mktg",
    name: "Aria Sterling",
    role: "GrowthLead",
    title: "Head of Patient Acquisition & Growth Strategy",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    permissions: ["growth:read", "campaigns:create", "demand:forecast"]
  },
  insurance: {
    id: "user-ins",
    name: "David Kim",
    role: "InsuranceCoordinator",
    title: "Director of Payor Relations & Pre-Authorization",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    permissions: ["insurance:read", "claims:adjudicate", "preauth:verify"]
  },
  patient: {
    id: "pat-101",
    name: "Maria Hernandez-Cruz",
    role: "Patient",
    title: "Verified Patient - Preferred Lang: Español",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    permissions: ["patient:portal", "appointments:book", "records:read", "feedback:submit"]
  },
  admin: {
    id: "user-admin",
    name: "System Administrator",
    role: "SuperAdmin",
    title: "Enterprise Platform Governor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    permissions: ["*"]
  }
};

// Issue stateless JWT for any persona
router.post("/session", (req, res) => {
  const { personaKey = "doctor" } = req.body;
  const user = PERSONAS[personaKey] || PERSONAS.doctor;

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24h stateless token
    },
    JWT_SECRET
  );

  return res.json({
    success: true,
    token,
    user,
    allPersonas: Object.keys(PERSONAS).map((key) => ({
      key,
      role: PERSONAS[key].role,
      name: PERSONAS[key].name,
      title: PERSONAS[key].title
    }))
  });
});

// Stateless session validation middleware
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For seamless demo usability, allow request with default doctor context if no token
    req.user = PERSONAS.doctor;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // If token expired or invalid, fallback gracefully to anonymous role
    req.user = { role: "Guest", name: "Guest User" };
    next();
  }
}

export default router;
