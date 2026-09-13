// High-throughput in-memory data store with atomic state management
// Seeded with rich clinical, financial, supply chain, nursing, and insurance data

export const store = {
  // Multi-Tenant White-Label Organizations Registry
  tenants: [
    {
      id: "tenant-auramed-main",
      name: "AuraMed International Medical Center",
      subdomain: "main",
      slogan: "Autonomous Unified Healthcare Ecosystem",
      badgeText: "AuraMed Standard",
      currency: "USD",
      specialties: ["Cardiology", "Orthopedics", "Dermatology", "Neurology"],
      theme: {
        primaryColor: "#06b6d4", // Electric Cyan
        secondaryColor: "#10b981", // Emerald Green
        accentColor: "#8b5cf6", // Violet
        surfaceColor: "#0a0e17",
        cardBg: "rgba(17, 24, 39, 0.75)",
        glowColor: "rgba(6, 182, 212, 0.4)",
        headerGradient: "from-[#0c1220] via-[#0d1829] to-[#0c1220]"
      },
      status: "Active",
      doctorsCount: 4,
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "tenant-st-jude-cardio",
      name: "St. Jude Heart & Vascular Hospital",
      subdomain: "st-jude",
      slogan: "World-Class Cardiovascular Surgery & Interventional Research",
      badgeText: "Cardiac Center of Excellence",
      currency: "USD",
      specialties: ["Cardiology", "Vascular Surgery", "Electrophysiology"],
      theme: {
        primaryColor: "#f43f5e", // Crimson Rose
        secondaryColor: "#f59e0b", // Amber Gold
        accentColor: "#ec4899", // Pink
        surfaceColor: "#170a0e",
        cardBg: "rgba(31, 15, 22, 0.75)",
        glowColor: "rgba(244, 63, 94, 0.4)",
        headerGradient: "from-[#1c0c12] via-[#241018] to-[#1c0c12]"
      },
      status: "Active",
      doctorsCount: 6,
      createdAt: "2026-03-15T10:30:00Z"
    },
    {
      id: "tenant-elysium-derma",
      name: "Elysium Aesthetic & Regenerative Clinic",
      subdomain: "elysium",
      slogan: "Pioneering Photomedicine, Laser Dermatology & Longevity",
      badgeText: "Aesthetic Specialist",
      currency: "EUR",
      specialties: ["Dermatology", "Laser Aesthetics", "Phototherapy"],
      theme: {
        primaryColor: "#d946ef", // Fuchsia
        secondaryColor: "#8b5cf6", // Violet
        accentColor: "#06b6d4", // Cyan
        surfaceColor: "#150920",
        cardBg: "rgba(28, 14, 40, 0.75)",
        glowColor: "rgba(217, 70, 239, 0.4)",
        headerGradient: "from-[#180a24] via-[#230f35] to-[#180a24]"
      },
      status: "Active",
      doctorsCount: 3,
      createdAt: "2026-05-20T14:15:00Z"
    },
    {
      id: "tenant-apex-ortho",
      name: "Apex Sports Medicine & Surgical Pavilion",
      subdomain: "apex",
      slogan: "Advanced Arthroscopic Joint Reconstruction & Sports Rehab",
      badgeText: "Sports Trauma Center",
      currency: "USD",
      specialties: ["Orthopedics", "Sports Medicine", "Physical Therapy"],
      theme: {
        primaryColor: "#3b82f6", // Cobalt Blue
        secondaryColor: "#10b981", // Emerald Green
        accentColor: "#f97316", // Orange
        surfaceColor: "#0b1329",
        cardBg: "rgba(15, 27, 48, 0.75)",
        glowColor: "rgba(59, 130, 246, 0.4)",
        headerGradient: "from-[#0c152a] via-[#111f3d] to-[#0c152a]"
      },
      status: "Active",
      doctorsCount: 5,
      createdAt: "2026-07-01T09:00:00Z"
    }
  ],

  // Platform configuration and tuning parameters
  adminConfig: {
    clinicName: "AuraMed International Medical Center",
    currency: "USD",
    dynamicPricingElasticity: 1.2,
    targetClinicMarginPct: 42,
    defaultTaxVatPct: 14,
    defaultTaxWithholdingPct: 5,
    doctorCommissionDefaultPct: 55,
    systemMode: "Stateless High-Throughput Cluster",
    activeSessionsCount: 428,
    averageLatencyMs: 8.4,
    cacheHitRatioPct: 99.2,
  },

  // Multi-specialty Doctors
  doctors: [
    {
      id: "doc-1",
      name: "Dr. Elena Rostova",
      specialty: "Cardiology & Interventional Vascular",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
      rating: 4.96,
      patientsToday: 14,
      totalPatientsTreated: 3420,
      languages: ["English", "Spanish", "French"],
      consultationFee: 240,
      commissionPct: 60,
      status: "In Clinic",
      currentRoom: "Suite 401 - Cardio Lab",
      bio: "Board-certified Interventional Cardiologist specializing in minimally invasive coronary procedures and cardiovascular rehabilitation.",
    },
    {
      id: "doc-2",
      name: "Dr. Tariq Al-Mansoor",
      specialty: "Orthopedic Surgery & Sports Medicine",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
      rating: 4.92,
      patientsToday: 11,
      totalPatientsTreated: 2890,
      languages: ["English", "Arabic", "French"],
      consultationFee: 220,
      commissionPct: 55,
      status: "In Surgery",
      currentRoom: "OR-2 Sterile Suite",
      bio: "Fellowship-trained Orthopedic Surgeon with expertise in arthroscopic joint reconstruction and regenerative cartilage therapy.",
    },
    {
      id: "doc-3",
      name: "Dr. Mei-Ling Zhou",
      specialty: "Dermatology & Aesthetic Laser",
      avatar: "https://images.unsplash.com/photo-1594824813686-35a092823a23?auto=format&fit=crop&w=300&q=80",
      rating: 4.98,
      patientsToday: 18,
      totalPatientsTreated: 4120,
      languages: ["English", "Mandarin", "Spanish"],
      consultationFee: 200,
      commissionPct: 50,
      status: "In Clinic",
      currentRoom: "Suite 204 - Laser Center",
      bio: "Pioneer in fractional laser resurfacing, photomedicine, and non-surgical aesthetic tissue regeneration.",
    },
    {
      id: "doc-4",
      name: "Dr. Marcus Vance",
      specialty: "Neurology & Cognitive Health",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
      rating: 4.88,
      patientsToday: 9,
      totalPatientsTreated: 1950,
      languages: ["English", "German"],
      consultationFee: 260,
      commissionPct: 55,
      status: "In Clinic",
      currentRoom: "Suite 302 - Neuro Diagnostics",
      bio: "Specializing in neuro-vascular imaging, migraine therapeutics, and early cognitive decline prevention protocols.",
    }
  ],

  // Patients with diverse cultural backgrounds and multi-lingual medical charts
  patients: [
    {
      id: "pat-101",
      name: "Maria Hernandez-Cruz",
      age: 48,
      gender: "Female",
      nativeLanguage: "Spanish",
      preferredLanguage: "Spanish",
      phone: "+1 (555) 349-8821",
      email: "m.hernandez@example.com",
      insuranceProvider: "Allianz Global Health",
      policyNumber: "AZ-9948201-US",
      preAuthStatus: "Approved",
      allergies: ["Penicillin", "Sulfa Drugs"],
      chronicConditions: ["Hypertension", "Early Stage Osteoarthritis"],
      assignedDoctorId: "doc-1",
      lastVisit: "2026-09-02",
      activeComplaint: "Recurrent chest tightness and palpitation after moderate exertion.",
      sentimentScore: 0.35, // -1.0 to 1.0
      complaintsHistory: [
        {
          id: "cmp-1",
          date: "2026-09-10",
          category: "Wait Time",
          text: "Waited 35 minutes past appointment time before ultrasound was performed.",
          resolved: true,
          resolutionNote: "Apologized, fast-tracked radiology review and waived diagnostic co-pay.",
        }
      ],
      clinicalNotes: {
        en: "Patient presents with exertional dyspnea and intermittent palpitations. ECG reveals sinus tachycardia without acute ST elevations. Scheduled for high-resolution Doppler echocardiography and stress test. Co-pay pre-authorized via Allianz.",
        es: "La paciente presenta disnea de esfuerzo y palpitaciones intermitentes. El ECG muestra taquicardia sinusal sin elevaciones agudas del segmento ST. Programada para ecocardiograma Doppler de alta resolución y prueba de esfuerzo. Copago preautorizado mediante Allianz.",
        ar: "تعاني المريضة من ضيق التنفس عند بذل مجهود وخفقان متقطع. يظهر تخطيط القلب تسرع القلب الجيبي. تم تحديد موعد لتخطيط صدى القلب بتقنية دوبلر واختبار الجهد. تمت الموافقة المسبقة على التأمين عبر أليانز.",
        fr: "La patiente présente une dyspnée d'effort et des palpitations intermittentes. L'ECG révèle une tachycardie sinusale. Programmée pour échocardiographie Doppler haute résolution. Co-paiement pré-autorisé.",
        zh: "患者出现劳力性呼吸困难和间歇性心悸。心电图显示窦性心动过速。已安排高分辨率多普勒超声心动图和压力测试。安联保险预授权已批准。"
      },
      prescriptions: [
        { medication: "Metoprolol Succinate ER", dose: "25mg once daily", status: "Active", ref: "RX-8841" },
        { medication: "Rosuvastatin", dose: "10mg at bedtime", status: "Active", ref: "RX-8842" }
      ]
    },
    {
      id: "pat-102",
      name: "Ahmed Al-Fassi",
      age: 54,
      gender: "Male",
      nativeLanguage: "Arabic",
      preferredLanguage: "Arabic",
      phone: "+971 50 821 9904",
      email: "ahmed.alfassi@example.com",
      insuranceProvider: "Bupa Global Worldwide",
      policyNumber: "BP-WORLD-7412",
      preAuthStatus: "Approved",
      allergies: ["None reported"],
      chronicConditions: ["Meniscal tear right knee", "Type 2 Diabetes (controlled)"],
      assignedDoctorId: "doc-2",
      lastVisit: "2026-09-08",
      activeComplaint: "Sharp pain on medial knee rotation after playing paddle tennis.",
      sentimentScore: 0.82,
      complaintsHistory: [],
      clinicalNotes: {
        en: "Evaluation of right knee sports injury. MRI confirms grade 2 medial meniscus tear with minor joint effusion. Recommended minimally invasive arthroscopic repair utilizing bio-absorbable fixation anchors.",
        es: "Evaluación de lesión deportiva en rodilla derecha. La resonancia confirma rotura de menisco medial grado 2. Se recomienda reparación artroscópica mínimamente invasiva.",
        ar: "تقييم إصابة رياضية في الركبة اليمنى. يؤكد التصوير بالرنين المغناطيسي وجود تمزق من الدرجة الثانية في الغضروف الهلالي الإنسي. يوصى بإجراء تنظير المفصل طفيف التوغل باستخدام مثبتات حيوية قابلة للامتصاص.",
        fr: "Évaluation d'une lésion sportive du genou droit. L'IRM confirme une déchirure méniscale médiale de grade 2. Réparation arthroscopique mini-invasive recommandée.",
        zh: "右膝运动损伤评估。核磁共振证实二级内侧半月板撕裂伴微量积液。建议采用可吸收生物锚钉进行微创关节镜修复。"
      },
      prescriptions: [
        { medication: "Celecoxib", dose: "200mg daily post-meals", status: "Active", ref: "RX-9011" },
        { medication: "Topical Ketoprofen Gel", dose: "Apply twice daily to knee", status: "Active", ref: "RX-9012" }
      ]
    },
    {
      id: "pat-103",
      name: "Chen Wei",
      age: 39,
      gender: "Male",
      nativeLanguage: "Mandarin",
      preferredLanguage: "Mandarin",
      phone: "+86 138 0012 9941",
      email: "chen.wei@example.com",
      insuranceProvider: "Cigna International Health",
      policyNumber: "CG-INT-55091",
      preAuthStatus: "Pre-Auth Pending",
      allergies: ["Iodine contrast dye", "Latex"],
      chronicConditions: ["Severe Post-Acne Scars", "Rosacea"],
      assignedDoctorId: "doc-3",
      lastVisit: "2026-09-11",
      activeComplaint: "Requires precise price breakdown for fractional CO2 laser sessions before committing.",
      sentimentScore: 0.45,
      complaintsHistory: [],
      clinicalNotes: {
        en: "Consultation for facial resurfacing. Prescribed 3 sessions of hybrid fractional CO2 and Erbium laser therapy. Pre-treatment micro-infusion with hyaluronic bio-boosters. Supplier laser tip cost factored into dynamic package.",
        es: "Consulta para rejuvenecimiento facial. Se prescribieron 3 sesiones de láser híbrido CO2 fraccionado y Erbio con bioestimuladores de ácido hialurónico.",
        ar: "استشارة لإعادة نضارة بشرة الوجه. تم وصف 3 جلسات ليزر ثاني أكسيد الكربون الجزئي والإربيوم مع معززات حمض الهيالورونيك الحيوية.",
        fr: "Consultation pour resurfaçage cutané. 3 séances de laser fractionné hybride CO2 et Erbium prescrites avec bio-boosters d'acide hyaluronique.",
        zh: "面部皮肤焕肤咨询。处方3次混合点阵CO2和饵激光治疗，并结合透明质酸生物赋能微灌注。激光耗材成本已纳入动态透明报价包。"
      },
      prescriptions: [
        { medication: "Tretinoin Cream 0.05%", dose: "Nightly pea-sized application", status: "Active", ref: "RX-7718" },
        { medication: "Epidermal Growth Factor Barrier Serum", dose: "Twice daily", status: "Active", ref: "RX-7719" }
      ]
    },
    {
      id: "pat-104",
      name: "Sophie Dubois",
      age: 62,
      gender: "Female",
      nativeLanguage: "French",
      preferredLanguage: "French",
      phone: "+33 6 40 19 82 04",
      email: "sophie.dubois@example.fr",
      insuranceProvider: "BlueCross Global Shield",
      policyNumber: "BC-GLOBAL-1092",
      preAuthStatus: "Approved",
      allergies: ["Aspirin"],
      chronicConditions: ["Migraine with aura", "Cervical Spondylosis"],
      assignedDoctorId: "doc-4",
      lastVisit: "2026-09-09",
      activeComplaint: "Throbbing temporal headaches accompanied by photophobia.",
      sentimentScore: 0.76,
      complaintsHistory: [],
      clinicalNotes: {
        en: "Refractory chronic migraine management. Scheduled 3T Brain MRI with specialized neuro-vascular protocol to exclude structural anomalies. Discussed prophylactic CGRP receptor antagonist injection therapy.",
        es: "Manejo de migraña crónica refractaria. Programada RM cerebral 3T con protocolo neurovascular especializado. Se discutió terapia inyectable de anticuerpos CGRP.",
        ar: "علاج الصداع النصفي المزمن المقاوم. تم حجز تصوير بالرنين المغناطيسي للدماغ بقوة 3 تسلا مع بروتوكول الأوعية الدموية العصبية. مناقشة العلاج بحقن مضادات CGRP الوقائية.",
        fr: "Prise en charge de migraines chroniques réfractaires. Programmation d'une IRM cérébrale 3T avec protocole neuro-vasculaire. Discussion sur le traitement prophylactique par anticorps anti-CGRP.",
        zh: "难治性慢性偏头痛管理。已安排3T脑部MRI配合神经血管专业扫描以排除器质性病变。讨论了CGRP受体拮抗剂预防性注射治疗。"
      },
      prescriptions: [
        { medication: "Rimegepant ODT", dose: "75mg sublingual at onset of aura", status: "Active", ref: "RX-6201" },
        { medication: "Magnesium Glycinate", dose: "400mg nightly", status: "Active", ref: "RX-6202" }
      ]
    }
  ],

  // Daily Appointments Queue across doctors
  appointments: [
    {
      id: "apt-101",
      patientId: "pat-101",
      patientName: "Maria Hernandez-Cruz",
      doctorId: "doc-1",
      doctorName: "Dr. Elena Rostova",
      specialty: "Cardiology",
      time: "09:30 AM",
      date: "2026-09-14",
      type: "Cardiac Stress Test & Doppler",
      triage: "High Priority",
      status: "waiting", // 'waiting', 'in_consultation', 'completed', 'cancelled'
      room: "Cardio Lab 401",
      insuranceConfirmed: true,
      coPayDue: 48,
    },
    {
      id: "apt-102",
      patientId: "pat-102",
      patientName: "Ahmed Al-Fassi",
      doctorId: "doc-2",
      doctorName: "Dr. Tariq Al-Mansoor",
      specialty: "Orthopedics",
      time: "10:15 AM",
      date: "2026-09-14",
      type: "Pre-Surgical Knee Arthroscopy Review",
      triage: "Standard",
      status: "waiting",
      room: "Consultation Suite 102",
      insuranceConfirmed: true,
      coPayDue: 85,
    },
    {
      id: "apt-103",
      patientId: "pat-103",
      patientName: "Chen Wei",
      doctorId: "doc-3",
      doctorName: "Dr. Mei-Ling Zhou",
      specialty: "Dermatology",
      time: "11:00 AM",
      date: "2026-09-14",
      type: "Fractional CO2 Laser Resurfacing Session 1",
      triage: "Scheduled Procedure",
      status: "scheduled",
      room: "Laser Suite 204",
      insuranceConfirmed: false,
      coPayDue: 350,
    },
    {
      id: "apt-104",
      patientId: "pat-104",
      patientName: "Sophie Dubois",
      doctorId: "doc-4",
      doctorName: "Dr. Marcus Vance",
      specialty: "Neurology",
      time: "11:45 AM",
      date: "2026-09-14",
      type: "Neuro-Vascular Consultation & 3T MRI Review",
      triage: "Standard",
      status: "scheduled",
      room: "Suite 302",
      insuranceConfirmed: true,
      coPayDue: 60,
    }
  ],

  // Dynamic Pricing Engine & Supplier Catalog
  // Procedures with dynamic material costing links
  procedures: [
    {
      id: "proc-1",
      name: "Percutaneous Coronary Intervention (Stenting)",
      specialty: "Cardiology",
      baseDoctorFee: 1200,
      materialItems: [
        { itemId: "mat-1", name: "Drug-Eluting Cobalt-Chromium Stent", baseCost: 450, currentCost: 520, supplier: "BioVascular Global" },
        { itemId: "mat-2", name: "Angioplasty Balloon Catheter & Guide Wire", baseCost: 180, currentCost: 195, supplier: "MedTech Global" },
        { itemId: "mat-3", name: "Sterile Surgical Pack & Heparin Kit", baseCost: 85, currentCost: 92, supplier: "Precision Instruments" }
      ],
      defaultMarginPct: 40,
      currentCalculatedFee: 2530, // calculated dynamically: doctorFee + (totalMaterials * (1 + margin))
      marketCostChangePct: +11.2,
      doctorOverride: null
    },
    {
      id: "proc-2",
      name: "Arthroscopic Knee Meniscal Repair",
      specialty: "Orthopedics",
      baseDoctorFee: 1400,
      materialItems: [
        { itemId: "mat-4", name: "Bio-Absorbable Meniscal Suture Anchors (Pair)", baseCost: 380, currentCost: 440, supplier: "Precision Instruments" },
        { itemId: "mat-5", name: "High-Flow Arthroscopy Inflow Fluid Cannula", baseCost: 95, currentCost: 98, supplier: "MedTech Global" },
        { itemId: "mat-6", name: "Single-Use Shaver Blade & RF Ablation Wand", baseCost: 210, currentCost: 245, supplier: "EuroHeal Reagents" }
      ],
      defaultMarginPct: 45,
      currentCalculatedFee: 2535,
      marketCostChangePct: +14.6,
      doctorOverride: null
    },
    {
      id: "proc-3",
      name: "Fractional CO2 Deep Dermal Laser Resurfacing",
      specialty: "Dermatology",
      baseDoctorFee: 850,
      materialItems: [
        { itemId: "mat-7", name: "Single-Patient Micro-Fractional Optic Handpiece Tip", baseCost: 190, currentCost: 235, supplier: "EuroHeal Reagents" },
        { itemId: "mat-8", name: "Medical Topical Anesthetic Gel & Bio-Cellulose Cooling Mask", baseCost: 65, currentCost: 72, supplier: "BioPharma Nexus" },
        { itemId: "mat-9", name: "Recombinant Epidermal Growth Factor Infusion Vials", baseCost: 110, currentCost: 130, supplier: "BioPharma Nexus" }
      ],
      defaultMarginPct: 42,
      currentCalculatedFee: 1470,
      marketCostChangePct: +19.4,
      doctorOverride: null
    },
    {
      id: "proc-4",
      name: "3T High-Resolution Brain MRI with Contrast",
      specialty: "Neurology / Radiology",
      baseDoctorFee: 600,
      materialItems: [
        { itemId: "mat-10", name: "Macrocyclic Gadolinium Contrast Agent (15ml)", baseCost: 120, currentCost: 135, supplier: "BioPharma Nexus" },
        { itemId: "mat-11", name: "Single-Use Power Injector Syringe & Line Set", baseCost: 45, currentCost: 48, supplier: "MedTech Global" }
      ],
      defaultMarginPct: 38,
      currentCalculatedFee: 852,
      marketCostChangePct: +10.9,
      doctorOverride: null
    }
  ],

  // Supplier Marketplace & Reliability Index
  suppliers: [
    {
      id: "sup-1",
      name: "BioVascular Global",
      category: "Vascular & Implantable Devices",
      reliabilityRating: 98.4,
      deliverySlaDays: 2,
      priceTrend30d: +8.5,
      contact: "orders@biovascularglobal.com",
      status: "Preferred Partner",
      ordersThisMonth: 12,
      totalSpendYTD: 142800
    },
    {
      id: "sup-2",
      name: "MedTech Global Supply",
      category: "Consumables, Catheters & Syringes",
      reliabilityRating: 99.1,
      deliverySlaDays: 1,
      priceTrend30d: +3.2,
      contact: "dispatch@medtechglobal.com",
      status: "Preferred Partner",
      ordersThisMonth: 28,
      totalSpendYTD: 98400
    },
    {
      id: "sup-3",
      name: "Precision Instruments Corp",
      category: "Orthopedic & Surgical Implants",
      reliabilityRating: 96.7,
      deliverySlaDays: 3,
      priceTrend30d: +12.1,
      contact: "supply@precisioninstruments.com",
      status: "Verified",
      ordersThisMonth: 8,
      totalSpendYTD: 76500
    },
    {
      id: "sup-4",
      name: "EuroHeal Reagents & Lasers",
      category: "Aesthetic Tips, Optics & Specialized Reagents",
      reliabilityRating: 95.8,
      deliverySlaDays: 4,
      priceTrend30d: +16.4,
      contact: "orders@euroheal.eu",
      status: "Verified",
      ordersThisMonth: 14,
      totalSpendYTD: 63200
    }
  ],

  // Medical Machinery, Maintenance & CapEx Modernization Modeler
  machines: [
    {
      id: "mach-1",
      name: "Siemens Magnetom Vida 3T MRI",
      serialNumber: "SM-VIDA-9941-B",
      department: "Diagnostic Imaging",
      status: "Optimal", // 'Optimal', 'Maintenance Due', 'Critical Calibration'
      healthScore: 94,
      downtimeRiskPct: 4.2,
      operatingHours: 4210,
      lastServiceDate: "2026-08-15",
      nextServiceDate: "2026-10-15",
      calibrationCertificateValidUntil: "2027-03-01",
      technicianCompany: "Siemens Healthineers Care",
      monthlyMaintenanceCost: 2800,
      scansCompletedThisMonth: 218,
      revenueGeneratedThisMonth: 185300,
    },
    {
      id: "mach-2",
      name: "GE Revolution Apex CT Scanner",
      serialNumber: "GE-APEX-8821-C",
      department: "Diagnostic Imaging",
      status: "Maintenance Due",
      healthScore: 79,
      downtimeRiskPct: 18.5,
      operatingHours: 5890,
      lastServiceDate: "2026-07-10",
      nextServiceDate: "2026-09-18",
      calibrationCertificateValidUntil: "2026-11-30",
      technicianCompany: "GE Healthcare Direct",
      monthlyMaintenanceCost: 3100,
      scansCompletedThisMonth: 340,
      revenueGeneratedThisMonth: 210800,
    },
    {
      id: "mach-3",
      name: "Lumenis UltraPulse Fractional CO2 Laser",
      serialNumber: "LUM-PULSE-4410",
      department: "Dermatology & Aesthetic Surgery",
      status: "Optimal",
      healthScore: 97,
      downtimeRiskPct: 2.1,
      operatingHours: 1420,
      lastServiceDate: "2026-08-28",
      nextServiceDate: "2026-11-28",
      calibrationCertificateValidUntil: "2027-05-15",
      technicianCompany: "Lumenis Laser Service",
      monthlyMaintenanceCost: 1400,
      scansCompletedThisMonth: 112,
      revenueGeneratedThisMonth: 98200,
    },
    {
      id: "mach-4",
      name: "Philips Epiq Elite Cardiovascular Ultrasound",
      serialNumber: "PH-EPIQ-7731",
      department: "Cardiology",
      status: "Optimal",
      healthScore: 92,
      downtimeRiskPct: 5.0,
      operatingHours: 3110,
      lastServiceDate: "2026-08-01",
      nextServiceDate: "2026-11-01",
      calibrationCertificateValidUntil: "2027-02-15",
      technicianCompany: "Philips MedCare",
      monthlyMaintenanceCost: 950,
      scansCompletedThisMonth: 184,
      revenueGeneratedThisMonth: 74200,
    }
  ],

  // CapEx Modernization Opportunities (Purchasing new modern products)
  modernizationOpportunities: [
    {
      id: "capex-1",
      productName: "AI Dual-Source Spectral Photon-Counting CT",
      manufacturer: "Siemens Healthineers",
      purchaseCost: 850000,
      expectedLifespanYears: 7,
      estimatedWeeklyPatients: 45,
      averageProcedureCharge: 950,
      monthlyOperatingCost: 8200,
      monthlyRevenueUplift: 148500,
      paybackPeriodMonths: 7.2,
      patientExperienceUplift: "+45% reduced radiation dose, zero motion blur, instant 3D vascular rendering",
      status: "Under Financial Review",
    },
    {
      id: "capex-2",
      productName: "Intuitive DaVinci Xi Robotic Surgical Console",
      manufacturer: "Intuitive Surgical",
      purchaseCost: 1450000,
      expectedLifespanYears: 8,
      estimatedWeeklyPatients: 14,
      averageProcedureCharge: 4200,
      monthlyOperatingCost: 14500,
      monthlyRevenueUplift: 212000,
      paybackPeriodMonths: 8.8,
      patientExperienceUplift: "Sub-millimeter precision, 65% faster discharge, minimal scarring",
      status: "Approved in Board"
    },
    {
      id: "capex-3",
      productName: "Ophtho-Neuro Laser Optical Coherence Tomography (OCT)",
      manufacturer: "Zeiss Medical",
      purchaseCost: 220000,
      expectedLifespanYears: 6,
      estimatedWeeklyPatients: 38,
      averageProcedureCharge: 380,
      monthlyOperatingCost: 2400,
      monthlyRevenueUplift: 54000,
      paybackPeriodMonths: 4.8,
      patientExperienceUplift: "Non-invasive cellular level retinal and optic nerve mapping in 90 seconds",
      status: "Pending Financing Terms"
    }
  ],

  // Nursing and Clinical Staff Performance & Attitude Radar
  nursingStaff: [
    {
      id: "nur-1",
      name: "Sarah Jenkins, BSN, RN",
      role: "Lead Clinical Triage & Cardiac Nurse",
      shift: "Day Shift (07:00 - 15:30)",
      punctualityScorePct: 98.4,
      onTimeArrivalsThisMonth: 21,
      lateMinutesTotal: 4,
      bedsideAttitudeScore: 4.95, // 1 to 5 based on patient reviews
      empathyRating: 4.98,
      tasksCompletedPct: 99.2,
      cashHandlingFidelityPct: 100.0,
      moneyCollectedToday: 1840,
      reconciliationDiscrepancies: 0,
      patientFeedbackHighlights: "Exceptionally gentle during blood draw; explained every step in fluent English and conversational Spanish.",
      activeTasks: [
        { task: "Pre-op ECG verification for Maria Hernandez-Cruz", done: true },
        { task: "Sterile tray setup in Suite 401", done: true },
        { task: "Post-treadmill recovery vitals monitoring", done: false }
      ]
    },
    {
      id: "nur-2",
      name: "Carlos Mendez, LPN",
      role: "Surgical Prep & Orthopedic Assistant",
      shift: "Morning Shift (06:30 - 15:00)",
      punctualityScorePct: 94.2,
      onTimeArrivalsThisMonth: 19,
      lateMinutesTotal: 22,
      bedsideAttitudeScore: 4.75,
      empathyRating: 4.80,
      tasksCompletedPct: 95.8,
      cashHandlingFidelityPct: 99.8,
      moneyCollectedToday: 950,
      reconciliationDiscrepancies: 0,
      patientFeedbackHighlights: "Very polite, guided Mr. Al-Fassi with crutch alignment and translated post-op notes into clear guidelines.",
      activeTasks: [
        { task: "Arthroscopy anchor inventory check", done: true },
        { task: "Cryo-compression sleeve preparation for Suite OR-2", done: false }
      ]
    },
    {
      id: "nur-3",
      name: "Fatima Zahra, MSN, APRN",
      role: "Patient Relations & Aesthetic Nurse Specialist",
      shift: "Mid Shift (09:00 - 17:30)",
      punctualityScorePct: 99.1,
      onTimeArrivalsThisMonth: 22,
      lateMinutesTotal: 0,
      bedsideAttitudeScore: 4.98,
      empathyRating: 5.00,
      tasksCompletedPct: 100.0,
      cashHandlingFidelityPct: 100.0,
      moneyCollectedToday: 2450,
      reconciliationDiscrepancies: 0,
      patientFeedbackHighlights: "Comforted Mr. Chen Wei during the laser test patch; provided bilingual aftercare protocol in Chinese & English.",
      activeTasks: [
        { task: "Compound topical anesthetic application for Suite 204", done: true },
        { task: "Cold chain check for EGF growth factor serums", done: true },
        { task: "Patient satisfaction discharge call follow-up", done: false }
      ]
    },
    {
      id: "nur-4",
      name: "Li Na, BSN",
      role: "Neurology Diagnostics & Infusion Nurse",
      shift: "Day Shift (08:00 - 16:30)",
      punctualityScorePct: 96.5,
      onTimeArrivalsThisMonth: 20,
      lateMinutesTotal: 15,
      bedsideAttitudeScore: 4.82,
      empathyRating: 4.85,
      tasksCompletedPct: 97.4,
      cashHandlingFidelityPct: 100.0,
      moneyCollectedToday: 1200,
      reconciliationDiscrepancies: 0,
      patientFeedbackHighlights: "Handled Mrs. Dubois' light sensitivity by dimming suite lighting immediately without being asked.",
      activeTasks: [
        { task: "Neuro-monitoring lead attachment Suite 302", done: true },
        { task: "Hydration line setup for MRI contrast scan", done: false }
      ]
    }
  ],

  // Automated Double-Entry Accounting, Invoices & Tax Settlement
  financials: {
    period: "Q3 2026",
    totalRevenueYTD: 2840900,
    monthToDateRevenue: 348200,
    monthToDateCOGS: 98400,
    monthToDateGrossProfit: 249800,
    grossMarginPct: 71.7,
    monthToDateDoctorCommissions: 139200,
    monthToDateOperatingExpenses: 42100,
    netProfitMTD: 68500,
    accountsReceivableTotal: 94200, // pending insurance
    cashCollectedToday: 6440,
    cardCollectedToday: 18900,
    
    // Tax Settlement Ledger
    taxSettlement: {
      vatRatePct: 14.0,
      withholdingTaxRatePct: 5.0,
      taxableGrossRevenueMTD: 348200,
      vatCollectedMTD: 48748,
      withholdingTaxWithheldMTD: 17410,
      allowableDeductionsCOGS: 98400,
      netVatLiabilityDue: 34972,
      quarterlyEstimatedCorporateTax: 20550,
      totalPendingSettlement: 55522,
      status: "Ready for Auto-Filing",
      lastSettlementDate: "2026-06-30",
      nextDueDate: "2026-09-30",
      complianceVerificationHash: "SHA256-78b1f2e4890c4d119aa903"
    },

    // Invoices Ledger
    invoices: [
      {
        id: "INV-9901",
        patientName: "Maria Hernandez-Cruz",
        procedureName: "Percutaneous Coronary Intervention",
        doctorName: "Dr. Elena Rostova",
        totalAmount: 2530,
        patientCoPayAmount: 506,
        insuranceClaimAmount: 2024,
        payor: "Allianz Global Health",
        status: "Co-Pay Collected, Claim Submitted",
        collectedBy: "Sarah Jenkins, RN",
        paymentMethod: "Visa Card",
        createdAt: "2026-09-13T14:20:00Z"
      },
      {
        id: "INV-9902",
        patientName: "Ahmed Al-Fassi",
        procedureName: "Knee Meniscal Repair Pre-Op Consult",
        doctorName: "Dr. Tariq Al-Mansoor",
        totalAmount: 420,
        patientCoPayAmount: 84,
        insuranceClaimAmount: 336,
        payor: "Bupa Worldwide",
        status: "Settled in Full",
        collectedBy: "Carlos Mendez, LPN",
        paymentMethod: "Apple Pay",
        createdAt: "2026-09-13T15:00:00Z"
      },
      {
        id: "INV-9903",
        patientName: "Chen Wei",
        procedureName: "Fractional CO2 Laser Resurfacing",
        doctorName: "Dr. Mei-Ling Zhou",
        totalAmount: 1470,
        patientCoPayAmount: 1470,
        insuranceClaimAmount: 0,
        payor: "Self-Pay (Aesthetic Protocol)",
        status: "Pending Cash Collection",
        collectedBy: "Fatima Zahra, MSN",
        paymentMethod: "Cash Pending",
        createdAt: "2026-09-13T16:15:00Z"
      }
    ]
  },

  // Growth, Marketing Campaigns & Demand Generation Engine
  marketing: {
    monthlyBudget: 35000,
    totalSpentThisMonth: 18400,
    patientAcquisitionCostAvg: 112, // $112 per new acquired patient
    patientLifetimeValueAvg: 3840,
    roiMultiple: 4.8,
    activeCampaigns: [
      {
        id: "cmp-101",
        name: "Executive Heart Health & Early Calcium Scoring Drive",
        channel: "Google Search & Precision Display",
        budget: 12000,
        spent: 7400,
        impressions: 145000,
        clicks: 4820,
        inquiries: 384,
        bookedAppointments: 92,
        cac: 80.4,
        revenueGenerated: 87400,
        status: "Active - High Performance",
        targetSpecialty: "Cardiology"
      },
      {
        id: "cmp-102",
        name: "Minimally Invasive Sports Joint Arthroscopy Outreach",
        channel: "Instagram & Padel Sports Clubs Partnerships",
        budget: 8500,
        spent: 4200,
        impressions: 89000,
        clicks: 2900,
        inquiries: 198,
        bookedAppointments: 44,
        cac: 95.4,
        revenueGenerated: 46200,
        status: "Active",
        targetSpecialty: "Orthopedics"
      },
      {
        id: "cmp-103",
        name: "Post-Summer Dual-Fractional Laser Revitalization",
        channel: "Luxury Lifestyle Portals & WeChat Healthcare",
        budget: 9500,
        spent: 5100,
        impressions: 112000,
        clicks: 3400,
        inquiries: 245,
        bookedAppointments: 68,
        cac: 75.0,
        revenueGenerated: 74800,
        status: "Active - Scaled",
        targetSpecialty: "Dermatology"
      },
      {
        id: "cmp-104",
        name: "Advanced Migraine & Neuro-Vascular Screenings",
        channel: "Corporate Wellness Partnerships",
        budget: 5000,
        spent: 1700,
        impressions: 42000,
        clicks: 1100,
        inquiries: 74,
        bookedAppointments: 22,
        cac: 77.2,
        revenueGenerated: 21500,
        status: "Active",
        targetSpecialty: "Neurology"
      }
    ],
    // Demand Heatmap for clinic utilization
    hourlyDemandHeatmap: [
      { hour: "08:00", demandPct: 65, capacityPct: 100 },
      { hour: "09:00", demandPct: 95, capacityPct: 100 },
      { hour: "10:00", demandPct: 100, capacityPct: 100 },
      { hour: "11:00", demandPct: 98, capacityPct: 100 },
      { hour: "12:00", demandPct: 75, capacityPct: 80 },
      { hour: "13:00", demandPct: 82, capacityPct: 100 },
      { hour: "14:00", demandPct: 96, capacityPct: 100 },
      { hour: "15:00", demandPct: 92, capacityPct: 100 },
      { hour: "16:00", demandPct: 85, capacityPct: 100 },
      { hour: "17:00", demandPct: 60, capacityPct: 75 },
    ]
  },

  // Health Insurance Gateway & Claims Engine
  insuranceClaims: [
    {
      id: "CLM-88401",
      patientId: "pat-101",
      patientName: "Maria Hernandez-Cruz",
      payor: "Allianz Global Health",
      procedure: "Percutaneous Coronary Intervention",
      totalBilled: 2530,
      preAuthNumber: "PA-AZ-99823",
      coverageRatioPct: 80,
      approvedPayorAmount: 2024,
      patientCoPayAmount: 506,
      status: "Pre-Auth Approved", // 'Draft', 'Submitted', 'Pre-Auth Approved', 'Settled', 'Under Dispute'
      submittedAt: "2026-09-12T10:00:00Z",
      estimatedPayoutDate: "2026-09-19",
      disputeNotes: null
    },
    {
      id: "CLM-88402",
      patientId: "pat-102",
      patientName: "Ahmed Al-Fassi",
      payor: "Bupa Worldwide",
      procedure: "Arthroscopic Knee Meniscal Repair",
      totalBilled: 2535,
      preAuthNumber: "PA-BP-77401",
      coverageRatioPct: 85,
      approvedPayorAmount: 2154.75,
      patientCoPayAmount: 380.25,
      status: "Pre-Auth Approved",
      submittedAt: "2026-09-11T14:30:00Z",
      estimatedPayoutDate: "2026-09-18",
      disputeNotes: null
    },
    {
      id: "CLM-88403",
      patientId: "pat-104",
      patientName: "Sophie Dubois",
      payor: "BlueCross Global Shield",
      procedure: "3T High-Resolution Brain MRI with Contrast",
      totalBilled: 852,
      preAuthNumber: "PA-BC-5521",
      coverageRatioPct: 90,
      approvedPayorAmount: 766.8,
      patientCoPayAmount: 85.2,
      status: "Settled in Full",
      submittedAt: "2026-09-09T08:15:00Z",
      settledAt: "2026-09-13T11:00:00Z",
      disputeNotes: null
    }
  ],

  // Platform Audit Logs & Rectifications
  auditLogs: [
    {
      id: "log-1",
      timestamp: "2026-09-13T18:42:10Z",
      actor: "SuperAdmin (Root)",
      category: "DYNAMIC_PRICING",
      action: "Recalculated Procedure #proc-1 Stent Angioplasty fee to $2,530 following +11.2% cobalt-chromium supplier index surge.",
      severity: "INFO"
    },
    {
      id: "log-2",
      timestamp: "2026-09-13T17:15:33Z",
      actor: "CFO Automated Accounting Engine",
      category: "TAX_SETTLEMENT",
      action: "Accrued $48,748 VAT liability and $17,410 withholding for Q3 period. Checksum verified.",
      severity: "INFO"
    },
    {
      id: "log-3",
      timestamp: "2026-09-13T16:02:11Z",
      actor: "Chief Nursing Supervisor",
      category: "PUNCTUALITY_AUDIT",
      action: "Clock-in verified across 4 duty nurses. 100% cash reconciliation balance confirmed.",
      severity: "INFO"
    }
  ]
};
