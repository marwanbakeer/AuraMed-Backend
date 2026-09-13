import express from "express";
import { store } from "../data/store.js";

const router = express.Router();

// Get patient personal portal data (profile, upcoming appointments, medical records, prescriptions)
router.get("/my-portal", (req, res) => {
  const patientId = req.query.patientId || "pat-101";
  const patient = store.patients.find((p) => p.id === patientId) || store.patients[0];

  const myAppointments = store.appointments.filter((a) => a.patientId === patient.id);
  const myClaims = store.insuranceClaims.filter((c) => c.patientId === patient.id);

  res.json({
    success: true,
    patient,
    appointments: myAppointments,
    claims: myClaims
  });
});

// Patient Self-Service Appointment Booking across multiple doctors
router.post("/book-appointment", (req, res) => {
  const {
    patientId = "pat-101",
    doctorId,
    preferredDate,
    preferredTime,
    reason,
    insuranceCovered = true
  } = req.body;

  const patient = store.patients.find((p) => p.id === patientId) || store.patients[0];
  const doctor = store.doctors.find((d) => d.id === doctorId) || store.doctors[0];

  const estimatedCoPay = insuranceCovered ? Math.round(doctor.consultationFee * 0.2) : doctor.consultationFee;

  const newAppointment = {
    id: `apt-p-${Date.now().toString().slice(-5)}`,
    patientId: patient.id,
    patientName: patient.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    time: preferredTime || "10:30 AM",
    date: preferredDate || new Date().toISOString().split("T")[0],
    type: reason || "Self-Booked Clinical Consultation",
    triage: "Standard",
    status: "scheduled",
    room: doctor.currentRoom,
    insuranceConfirmed: insuranceCovered,
    coPayDue: estimatedCoPay
  };

  store.appointments.push(newAppointment);

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: `Patient Portal (${patient.name})`,
    category: "PATIENT_SELF_BOOKING",
    action: `Patient booked appointment with ${doctor.name} (${doctor.specialty}) for ${newAppointment.date} at ${newAppointment.time}. Estimated Co-Pay: $${estimatedCoPay}.`,
    severity: "INFO"
  });

  res.json({
    success: true,
    message: "Appointment booked successfully",
    appointment: newAppointment
  });
});

// Transparent Procedure Cost Estimator for Patients
router.get("/cost-estimator", (req, res) => {
  const { procedureId, payor = "Allianz Global Health" } = req.query;

  const proc = store.procedures.find((p) => p.id === procedureId) || store.procedures[0];
  const totalMaterials = proc.materialItems.reduce((acc, m) => acc + m.currentCost, 0);
  const totalProcedureFee = proc.currentCalculatedFee;

  // Payor coverage matrix
  const coverageRatios = {
    "Allianz Global Health": 0.8,
    "Bupa Worldwide": 0.85,
    "Cigna International Health": 0.75,
    "BlueCross Global Shield": 0.9,
    "Self-Pay": 0.0
  };

  const coverageRatio = coverageRatios[payor] !== undefined ? coverageRatios[payor] : 0.8;
  const insurancePays = Math.round(totalProcedureFee * coverageRatio);
  const patientOutOfPocket = totalProcedureFee - insurancePays;

  res.json({
    success: true,
    procedure: {
      id: proc.id,
      name: proc.name,
      specialty: proc.specialty
    },
    breakdown: {
      baseDoctorFee: proc.baseDoctorFee,
      materialsCostShare: totalMaterials,
      clinicOverheadAndFacilityFee: Math.max(0, totalProcedureFee - proc.baseDoctorFee - totalMaterials),
      totalFullFee: totalProcedureFee,
      insurancePayor: payor,
      coveragePercentage: Math.round(coverageRatio * 100),
      insuranceCoveredAmount: insurancePays,
      patientFinalOutOfPocketCoPay: patientOutOfPocket
    },
    transparencyGuarantee: "Guaranteed locked price: No hidden facility charges or surprise material surcharges."
  });
});

// Submit Patient Feedback, Symptom Report, or Complaint
router.post("/submit-feedback", (req, res) => {
  const {
    patientId = "pat-101",
    doctorRating,
    nurseId,
    nurseAttitudeRating,
    nursePunctualityRating,
    feedbackText,
    category = "Experience Feedback"
  } = req.body;

  const patient = store.patients.find((p) => p.id === patientId) || store.patients[0];

  // If there is nurse feedback, update nurse record
  if (nurseId) {
    const nurse = store.nursingStaff.find((n) => n.id === nurseId);
    if (nurse) {
      if (nurseAttitudeRating) {
        nurse.bedsideAttitudeScore = Number(((nurse.bedsideAttitudeScore * 0.85) + (Number(nurseAttitudeRating) * 0.15)).toFixed(2));
      }
      if (feedbackText) {
        nurse.patientFeedbackHighlights = `"${feedbackText}" - Patient ${patient.name}`;
      }
    }
  }

  // If low score or negative complaint, log as complaint
  const isComplaint = (nurseAttitudeRating && nurseAttitudeRating <= 3) || (doctorRating && doctorRating <= 3);

  if (isComplaint || category === "Complaint") {
    patient.complaintsHistory.push({
      id: `cmp-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      category: category || "Patient Experience",
      text: feedbackText || "Discomfort or delay reported by patient",
      resolved: false,
      resolutionNote: null
    });
    patient.sentimentScore = Math.max(-1.0, Number((patient.sentimentScore - 0.25).toFixed(2)));
  } else {
    patient.sentimentScore = Math.min(1.0, Number((patient.sentimentScore + 0.15).toFixed(2)));
  }

  store.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: `Patient Portal (${patient.name})`,
    category: isComplaint ? "PATIENT_COMPLAINT_LOGGED" : "PATIENT_FEEDBACK",
    action: `Received feedback: "${feedbackText}". Nurse attitude rating: ${nurseAttitudeRating || "N/A"}, Doctor: ${doctorRating || "N/A"}.`,
    severity: isComplaint ? "WARNING" : "INFO"
  });

  res.json({
    success: true,
    message: isComplaint
      ? "Your feedback has been routed directly to Clinical Quality & Nursing Management for swift resolution."
      : "Thank you for your valuable feedback! It has been recorded.",
    sentimentScore: patient.sentimentScore
  });
});

export default router;
