import express from "express";
import jwt from "jsonwebtoken";
import { store } from "../data/store.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "auramed-secret-key-99482";

// Available personas for stateless quick-switching
export const PERSONAS = {
  doctor: {
    id: "doc-1",
    name: "Dr. Elena Rostova",
    role: "Doctor",
    tenantId: "tenant-auramed-main",
    title: "Chief of Cardiology & Vascular Intervention",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    permissions: ["clinical:read", "clinical:write", "referrals:dispatch", "prescriptions:write"]
  },
  tenantAdmin: {
    id: "usr-tenant-st-jude",
    name: "Dr. Arthur Campbell",
    role: "TenantSuperAdmin",
    tenantId: "tenant-st-jude-cardio",
    title: "St. Jude Hospital Tenant SuperAdmin",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
    permissions: ["tenant:manage", "users:authorize", "invites:create", "skin:update"]
  },
  cfo: {
    id: "user-cfo",
    name: "Jonathan Vance, CPA",
    role: "CFO",
    tenantId: "tenant-auramed-main",
    title: "Chief Financial & Operations Officer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    permissions: ["finance:read", "finance:write", "tax:settle", "ledger:audit"]
  },
  supply: {
    id: "user-supply",
    name: "Elena Vasquez",
    role: "SupplyDirector",
    tenantId: "tenant-auramed-main",
    title: "Director of Global Procurement & Supply Chain",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    permissions: ["supply:read", "supply:write", "pricing:recalculate", "orders:create"]
  },
  biomedical: {
    id: "user-biomed",
    name: "Ing. Marcus Thorne",
    role: "BiomedicalEngineer",
    tenantId: "tenant-auramed-main",
    title: "Lead Biomedical Systems & Asset Reliability Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    permissions: ["equipment:read", "equipment:service", "capex:model"]
  },
  nurseSupervisor: {
    id: "user-nurse",
    name: "Sarah Jenkins, BSN, RN",
    role: "NurseSupervisor",
    tenantId: "tenant-auramed-main",
    title: "Chief Nursing Officer & Clinical Operations Lead",
    avatar: "https://images.unsplash.com/photo-1594824813686-35a092823a23?auto=format&fit=crop&w=300&q=80",
    permissions: ["nursing:read", "nursing:schedule", "attitude:score", "collections:audit"]
  },
  marketing: {
    id: "user-mktg",
    name: "Aria Sterling",
    role: "GrowthLead",
    tenantId: "tenant-auramed-main",
    title: "Head of Patient Acquisition & Growth Strategy",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    permissions: ["growth:read", "campaigns:create", "demand:forecast"]
  },
  insurance: {
    id: "user-ins",
    name: "David Kim",
    role: "InsuranceCoordinator",
    tenantId: "tenant-auramed-main",
    title: "Director of Payor Relations & Pre-Authorization",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    permissions: ["insurance:read", "claims:adjudicate", "preauth:verify"]
  },
  patient: {
    id: "pat-101",
    name: "Maria Hernandez-Cruz",
    role: "Patient",
    tenantId: "tenant-auramed-main",
    title: "Verified Patient - Preferred Lang: Español",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    permissions: ["patient:portal", "appointments:book", "records:read", "feedback:submit"]
  },
  admin: {
    id: "user-admin",
    name: "System Administrator",
    role: "SuperAdmin",
    tenantId: "all",
    title: "Enterprise Platform Governor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    permissions: ["*"]
  }
};

// Helper: Issue stateless JWT
function generateStatelessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || "tenant-auramed-main",
      status: user.status || "Active",
      permissions: user.permissions || [],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24h
    },
    JWT_SECRET
  );
}

// 1. Issue stateless JWT for any persona (Quick Role Switcher)
router.post("/session", (req, res) => {
  const { personaKey = "doctor" } = req.body;
  const user = PERSONAS[personaKey] || PERSONAS.doctor;
  const token = generateStatelessToken(user);

  return res.json({
    success: true,
    token,
    user,
    allPersonas: Object.keys(PERSONAS).map((key) => ({
      key,
      role: PERSONAS[key].role,
      name: PERSONAS[key].name,
      title: PERSONAS[key].title,
      tenantId: PERSONAS[key].tenantId
    }))
  });
});

// 2. Google and Facebook Social Sign-In & Registration
router.post("/social-login", (req, res) => {
  const { 
    provider = "google", // 'google' or 'facebook'
    socialToken = "mock-oauth-token-xyz", 
    email, 
    name, 
    tenantId = "tenant-auramed-main",
    role = "Patient"
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: "Email and Name are required from OAuth provider." });
  }

  let existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!existingUser) {
    // Determine initial authorization status:
    // Patients are auto-activated; clinical staff accounts require admin authorization
    const isClinicalStaff = ["Doctor", "Nurse", "CFO", "TenantSuperAdmin"].includes(role);
    const initialStatus = isClinicalStaff ? "Pending Authorization" : "Active";

    existingUser = {
      id: `usr-soc-${Date.now().toString().slice(-5)}`,
      name,
      email: email.toLowerCase(),
      authProvider: provider, // 'google' or 'facebook'
      role,
      tenantId,
      status: initialStatus,
      createdAt: new Date().toISOString()
    };

    store.users.unshift(existingUser);

    store.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${provider.toUpperCase()} OAuth Gateway`,
      category: "USER_REGISTERED_OAUTH",
      action: `User "${name}" signed in via ${provider.toUpperCase()}. Role: ${role}, Tenant: ${tenantId}, Status: ${initialStatus}.`,
      severity: isClinicalStaff ? "WARNING" : "INFO"
    });
  }

  const token = generateStatelessToken(existingUser);

  res.json({
    success: true,
    message: `Authenticated successfully via ${provider.toUpperCase()}`,
    token,
    user: existingUser,
    requiresAdminApproval: existingUser.status === "Pending Authorization"
  });
});

// 3. Native Platform User Registration
router.post("/register", (req, res) => {
  const {
    name,
    email,
    password,
    role = "Patient",
    tenantId = "tenant-auramed-main",
    specialty,
    invitationToken
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Name and email are required." });
  }

  // Check if email already registered
  const duplicate = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (duplicate) {
    return res.status(409).json({ success: false, error: "An account with this email already exists." });
  }

  let initialStatus = "Pending Authorization";
  let assignedRole = role;
  let assignedTenant = tenantId;

  // Check if registering through a verified invitation token
  if (invitationToken) {
    const invite = store.invitations.find(i => i.token === invitationToken && i.status === "Pending");
    if (invite) {
      initialStatus = "Active"; // Auto-approved via invitation!
      assignedRole = invite.role;
      assignedTenant = invite.tenantId;
      invite.status = "Accepted";
      invite.acceptedBy = email;
    }
  } else if (role === "Patient") {
    initialStatus = "Active";
  }

  const newUser = {
    id: `usr-reg-${Date.now().toString().slice(-5)}`,
    name,
    email: email.toLowerCase(),
    authProvider: "native",
    role: assignedRole,
    tenantId: assignedTenant,
    specialty: specialty || null,
    status: initialStatus,
    createdAt: new Date().toISOString()
  };

  store.users.unshift(newUser);

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: "Platform Registration Gateway",
    category: "USER_REGISTERED_NATIVE",
    action: `New user "${name}" registered for ${assignedTenant}. Role: ${assignedRole}. Status: ${initialStatus}.`,
    severity: initialStatus === "Pending Authorization" ? "WARNING" : "INFO"
  });

  const token = generateStatelessToken(newUser);

  res.status(201).json({
    success: true,
    message: initialStatus === "Active" 
      ? "Account created and authorized successfully!" 
      : "Registration submitted! An administrator will review and authorize your clinical role shortly.",
    token,
    user: newUser,
    requiresAdminApproval: initialStatus === "Pending Authorization"
  });
});

// 4. Native Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find(u => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid email or password." });
  }

  const token = generateStatelessToken(user);

  res.json({
    success: true,
    message: "Logged in successfully.",
    token,
    user,
    requiresAdminApproval: user.status === "Pending Authorization"
  });
});

// 5. Issue Scoped Invitation (Authorized by SuperAdmin or Tenant SuperAdmin for their tenant only)
router.post("/invite", requireAuth, (req, res) => {
  const caller = req.user || PERSONAS.admin;
  const { email, role = "Doctor", tenantId } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Invited email is required." });
  }

  let targetTenantId = tenantId || caller.tenantId || "tenant-auramed-main";

  // Strict Tenant Scoping Enforcement:
  // Tenant SuperAdmin can ONLY invite users to their own hospital tenant!
  if (caller.role === "TenantSuperAdmin") {
    if (tenantId && tenantId !== caller.tenantId) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: As a Tenant SuperAdmin for '${caller.tenantId}', you can only issue invitations within your own hospital tenant.`
      });
    }
    targetTenantId = caller.tenantId;
  }

  const tenant = store.tenants.find(t => t.id === targetTenantId) || store.tenants[0];

  const token = `INV-${tenant.subdomain.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const invitation = {
    id: `inv-${Date.now().toString().slice(-4)}`,
    token,
    tenantId: tenant.id,
    tenantName: tenant.name,
    role,
    invitedEmail: email.toLowerCase(),
    invitedBy: `${caller.name} (${caller.role})`,
    status: "Pending",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString() // 14 days
  };

  store.invitations.unshift(invitation);

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: caller.name,
    category: "INVITATION_ISSUED",
    action: `Issued invitation ${invitation.token} to ${email} for role ${role} in ${tenant.name}.`,
    severity: "INFO"
  });

  res.status(201).json({
    success: true,
    message: `Invitation generated for ${email}. Role: ${role}, Tenant: ${tenant.name}`,
    invitation
  });
});

// 6. Get Invitations (Scoped by caller's tenant unless SuperAdmin)
router.get("/invitations", requireAuth, (req, res) => {
  const caller = req.user || PERSONAS.admin;
  let list = store.invitations;

  if (caller.role === "TenantSuperAdmin") {
    list = list.filter(i => i.tenantId === caller.tenantId);
  }

  res.json({ success: true, invitations: list });
});

// 7. Get Users (Scoped by caller's tenant unless SuperAdmin)
router.get("/users", requireAuth, (req, res) => {
  const caller = req.user || PERSONAS.admin;
  let list = store.users;

  if (caller.role === "TenantSuperAdmin") {
    list = list.filter(u => u.tenantId === caller.tenantId);
  }

  res.json({ success: true, users: list });
});

// 8. Authorize / Approve Pending User (Tenant SuperAdmin can ONLY authorize users within their tenant)
router.patch("/users/:id/authorize", requireAuth, (req, res) => {
  const caller = req.user || PERSONAS.admin;
  const { id } = req.params;
  const { status = "Active", role } = req.body;

  const targetUser = store.users.find(u => u.id === id);
  if (!targetUser) {
    return res.status(404).json({ success: false, error: "User not found." });
  }

  // Strict Tenant-Scoped Authorization Enforcement:
  if (caller.role === "TenantSuperAdmin") {
    if (targetUser.tenantId !== caller.tenantId) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: You are Tenant SuperAdmin for '${caller.tenantId}' and cannot authorize users from other hospital organizations.`
      });
    }
  }

  targetUser.status = status;
  if (role) targetUser.role = role;

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: caller.name,
    category: "USER_AUTHORIZATION_GRANTED",
    action: `Granted status "${status}" (Role: ${targetUser.role}) to ${targetUser.name} (${targetUser.email}) for tenant ${targetUser.tenantId}.`,
    severity: "CRITICAL"
  });

  res.json({
    success: true,
    message: `User ${targetUser.name} has been authorized successfully.`,
    user: targetUser
  });
});

// Stateless session validation middleware
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = PERSONAS.doctor;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { role: "Guest", name: "Guest User" };
    next();
  }
}

export default router;
