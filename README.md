# 🩺 AuraMed Enterprise OS — High-Throughput Core Backend

Autonomous, stateless healthcare operations backend integrating clinical queues, multilingual cross-cultural consultations, double-entry accounting & tax settlements, dynamic procedure pricing, machinery maintenance & CapEx ROI modeling, nursing performance scorecards, and insurance adjudication.

---

## 🚀 Key Architectural Capabilities

- **Stateless High-Throughput REST Core**: Built on Node.js v24 with JWT stateless sessions ready for enterprise scale.
- **Cross-Cultural Medical Translation Engine**: Real-time translation across English, Spanish, Arabic, French, and Mandarin with specialized clinical dictionaries.
- **Dynamic Procedure Margin Protection**: Automatically recalculates procedure fees based on supplier material cost surges to lock in clinic margins (42%).
- **Automated Double-Entry Ledger & Tax Settlement**: Calculates VAT & withholding liabilities net of deductible COGS, generating cryptographically signed tax clearance receipts.
- **Biomedical Machinery Health & CapEx Modernization**: Asset uptime monitoring and payback modeling for acquiring advanced diagnostic and surgical systems.
- **Nursing Operations & Attitude Scorecards**: Shift punctuality logs, patient review empathy ratings, and cash collection audits.
- **Health Insurance Payor Gateway**: Pre-authorization validation and dynamic co-pay splitting (e.g. 80% covered / 20% patient out-of-pocket).

---

## 🛠️ Tech Stack

- **Runtime**: Node.js v24 LTS
- **Framework**: Express.js
- **Auth**: Stateless JSON Web Tokens (JWT)
- **Container**: Docker (Lightweight Alpine runtime)
- **CI/CD**: GitHub Actions (Automated testing & Docker packaging)

---

## 🏃 Quick Start (Local)

```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Start backend server (listening on port 5000)
npm start
```

---

## 🐳 Docker Deployment

### Build the Docker Image
```bash
docker build -t auramed-backend:latest .
```

### Run the Container
```bash
docker run -d \
  --name auramed-backend \
  -p 5000:5000 \
  -e PORT=5000 \
  auramed-backend:latest
```

### Check Container Health
```bash
curl http://localhost:5000/api/health
```

---

## 🤖 GitHub Actions Workflow

This repository includes a continuous integration workflow in `.github/workflows/ci-cd.yml` that:
1. Validates code on Ubuntu runners with Node.js v24.
2. Runs all 11 backend subsystem integration tests (`test-api.js`).
3. Builds the production Docker container.
4. Optionally publishes the verified container image to GitHub Container Registry (`ghcr.io`).
