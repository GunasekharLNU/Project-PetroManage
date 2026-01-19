
<p align='center'>
  <img src='https://dummyimage.com/600x200/0D6EFD/ffffff&text=PetroManage' alt='PetroManage Logo'/>
</p>

<h1 align='center'>PetroManage – Oil & Gas Asset & Operations Management System</h1>
<p align='center'>A modern, modular, enterprise-grade platform for managing assets, production, maintenance, compliance, and analytics in the oil & gas industry.</p>

---

## 📛 Badges

<p align="left">
  <img src="https://img.shields.io/badge/Backend-SpringBoot-green" />
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Database-MySQL-orange" />
  <img src="https://img.shields.io/badge/Build-Maven-yellow" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>

---

## 🏗️ Overview
PetroManage is a complete operational management suite that enables oil & gas companies to:
- Monitor and track physical assets
- Manage production plans and daily output
- Schedule and resolve maintenance tasks
- Maintain regulatory & safety compliance
- View dashboards with KPIs and trends

This repository includes the **Spring Boot backend**, and integrates with a **React/Vite frontend**.
Frontend Repo: https://github.com/GunasekharLNU/PetroManage

---

## 🧱 System Architecture
```
┌──────────────┐        ┌───────────────────────┐        ┌──────────────┐
│   Frontend   │ <----> │     Spring Boot API    │ <----> │   Database    │
│ React + Vite │        │ Controllers, Services  │        │ MySQL/SQLSrv  │
└──────────────┘        └───────────────────────┘        └──────────────┘
```

---

## 🧩 Core Modules

### 1️⃣ Asset Management
- Register rigs, pipelines, storage units
- Track health, status, location, lifecycle
- Asset-based filtering and classification

### 2️⃣ Production Management
- Create production plans
- Log daily production volumes
- View planned vs actual variance

### 3️⃣ Maintenance & Work Orders
- Schedule preventive/corrective work
- Assign to technicians
- Track completion & downtime

### 4️⃣ Compliance & Safety Reporting
- Safety, environmental & regulatory reports
- Track compliance scores and audit history

### 5️⃣ Analytics & Dashboards
- Efficiency KPIs
- Downtime trends
- Asset performance charts

---

## 🗂️ Entity Model Summary
```
Asset(assetId, name, type[RIG|PIPELINE|STORAGE], location, status)
ProductionPlan(planId, assetId, plannedVolume, startDate, endDate)
ProductionRecord(recordId, assetId, actualVolume, date)
WorkOrder(workOrderId, assetId, description, scheduledDate, status, technician)
ComplianceReport(reportId, assetId, assetName, reportType, safetyScore, complianceStatus,
                 inspector, nextAuditDate, generatedDate, lastUpdatedDate)
```

---

## 🔌 REST API Summary
### Assets
```
POST /api/assets
GET  /api/assets
GET  /api/assets/{id}
PUT  /api/assets/{id}
DELETE /api/assets/{id}
```

### Production
```
POST /api/production/plans
GET  /api/production/plans
POST /api/production/records
GET  /api/production/records
```

### Maintenance
```
POST /api/maintenance/work-orders
GET  /api/maintenance/work-orders
PUT  /api/maintenance/work-orders/{id}
DELETE /api/maintenance/work-orders/{id}
```

### Compliance
```
POST /api/compliance-reports
GET  /api/compliance-reports
GET  /api/compliance-reports/{id}
PUT  /api/compliance-reports/{id}
DELETE /api/compliance-reports/{id}
```

---

## ⚙️ Backend Setup
### 1. Database Configuration (`application.properties`)
```
spring.datasource.url=jdbc:mysql://localhost:3306/petromanage?serverTimezone=UTC
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

### 2. Run Backend
```
cd backend
mvn spring-boot:run
```
Backend: **http://localhost:8080**

---

## 💻 Frontend Setup
```
git clone https://github.com/GunasekharLNU/PetroManage.git
cd PetroManage
npm install
npm run dev
```
Frontend: **http://localhost:5173**

---

## 📈 Roadmap
- 🔐 Role-based access (Admin/Tech/Operator)
- 📄 PDF export for reports
- ⏰ Scheduled jobs for overdue audits & reminders
- 📊 Improved analytics widgets
- 📡 Optional IoT integration

---

## 🤝 Contribution Guidelines
1. Fork repository
2. Create feature branch
3. Commit using conventional commits
4. Open pull request with clear description

---

## 📜 License
Specify MIT/Apache/Proprietary as needed.

---
