# Vishwas: Digital Trust & Micro-Agreement Platform for Unorganized Small Businesses in India

An academic MSc Computer Science final-year project establishing a digital micro-agreement and trust foundation for Indian micro-enterprises, independent service providers, and local merchants.

---

## 1. Problem Statement & Context

A massive portion of India's informal economy—carpenters, boutique designers, electrical contractors, fabrication fabricators, catering service providers, and freelance tradespeople—operates primarily on verbal commitments, informal WhatsApp chats, or handwritten slips. 

This informal modus operandi frequently leads to:
- Disagreements over work scope and deliverables.
- Confusion regarding payment milestones and advance deposits.
- Unclear completion deadlines and delayed handovers.
- Lack of an accessible, non-intimidating, and mutual written record.

**Vishwas** addresses this by providing a streamlined, lightweight digital micro-agreement platform tailored specifically for Indian trade practices, using INR (₹) denominated financial structures, milestone breakdown, and simple document generation.

---

## 2. Technology Stack

Built strictly adhering to a clean, minimal **MERN** architecture without extraneous overhead:

- **Frontend**: React 18 + Vite (fast build & lightning-quick HMR)
- **Styling**: Tailwind CSS (clean, light SaaS design system)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend**: Node.js & Express.js (RESTful API)
- **Database**: MongoDB with Mongoose ODM
- **Environment**: Dotenv for secure configuration management

---

## 3. Project Architecture & Folder Structure

```
Vishwas/
├── client/                           # React + Vite Frontend
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   └── agreementApi.js       # Axios API client functions
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Navigation bar & DB connectivity status
│   │   │   │   └── StatusBadge.jsx   # Lifecycle status pill (Draft, Pending, etc.)
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx     # Merchant overview & pipeline metrics
│   │   │   │   └── StatCard.jsx      # KPI card component
│   │   │   └── agreements/
│   │   │       ├── AgreementList.jsx # Registry view with search & status filters
│   │   │       ├── AgreementDetailView.jsx # Document-like agreement view & actions
│   │   │       └── CreateAgreementForm.jsx # Structured multi-section agreement form
│   │   ├── utils/
│   │   │   └── formatters.js         # Currency (₹ INR), date formatting, and status configs
│   │   ├── App.jsx                   # Primary state management and view routing
│   │   ├── index.css                 # Tailwind CSS directives & custom typography
│   │   └── main.jsx                  # React application entry point
│   ├── index.html                    # Root HTML document
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.js             # PostCSS configuration
│   ├── tailwind.config.js            # Tailwind color palette & typography config
│   └── vite.config.js                # Vite build & development proxy configuration
│
├── server/                           # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Mongoose connection & graceful status handler
│   │   ├── controllers/
│   │   │   └── agreementController.js # CRUD handlers with robust validation
│   │   ├── models/
│   │   │   └── Agreement.js          # Mongoose schema for micro-agreements
│   │   ├── routes/
│   │   │   └── agreementRoutes.js    # Express REST API routes
│   │   └── server.js                 # Express server bootstrap, CORS, & health checks
│   ├── .env                          # Local environment variables
│   ├── .env.example                  # Environment configuration template
│   ├── package.json                  # Backend dependencies & scripts
│   ├── seed.js                       # Realistic Indian MSME sample agreement seeder
│   ├── test-api.js                   # Automated HTTP endpoint test script
│   └── test-model.js                 # Mongoose validation unit test script
│
├── .gitignore                        # Standard Git ignore rules
├── package.json                      # Root workspace scripts
└── README.md                         # Comprehensive project documentation
```

---

## 4. Database Schema (Agreement Model)

The agreement schema in `server/src/models/Agreement.js` records all primary contract parameters:

| Field Name | Type | Constraints & Defaults | Description |
| :--- | :--- | :--- | :--- |
| `agreementId` | String | Unique, Indexed, Format: `AGR-YYYYMMDD-XXXX` | Auto-generated human-readable identifier |
| `merchantName` | String | Required, Trimmed | Merchant or business enterprise name |
| `merchantContact` | String | Required, Trimmed | Merchant phone number or email |
| `customerName` | String | Required, Trimmed | Customer or client full name |
| `customerContact` | String | Required, Trimmed | Customer phone number or email |
| `transactionTitle` | String | Required, Max: 120 chars | Title/nature of the commercial engagement |
| `workDescription` | String | Required, Trimmed | Detailed scope of work, specifications, deliverables |
| `totalAmount` | Number | Required, Min: 0 | Total agreed financial value (INR ₹) |
| `advanceAmount` | Number | Default: 0, Min: 0 | Advance paid upon engagement (INR ₹) |
| `remainingAmount` | Number | Auto-computed: `total - advance` | Outstanding balance due upon delivery (INR ₹) |
| `paymentTerms` | String | Required, Trimmed | Clear explanation of milestones and payments |
| `startDate` | Date | Required | Formal commencement date |
| `expectedCompletionDate` | Date | Required | Agreed delivery/completion target date |
| `status` | String | Enum: `Draft`, `Pending`, `Confirmed`, `Completed`, `Cancelled` | Lifecycle status of the agreement |
| `createdAt` / `updatedAt` | Date | Timestamps: `true` | Automated Mongoose audit timestamps |

---

## 5. API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System diagnostics & MongoDB connection status |
| `GET` | `/agreements/stats/summary` | Aggregate metrics for merchant dashboard |
| `GET` | `/agreements` | Retrieve all agreements (supports `?search=` and `?status=`) |
| `GET` | `/agreements/:id` | Retrieve single agreement by `_id` or `agreementId` |
| `POST` | `/agreements` | Create a new agreement with validation and auto-generated ID |
| `PUT` | `/agreements/:id` | Update agreement details or advance lifecycle status |

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (either a local MongoDB Community server or a free MongoDB Atlas cloud cluster)

### Step 1: Clone or Navigate to Directory
```bash
cd e:/Vishwas
```

### Step 2: Configure Backend Environment Variables
In the `server` directory, check or copy `.env.example` to `.env`:
```bash
cd server
copy .env.example .env
```
Default `.env` contents:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vishwas_db
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/vishwas_db?retryWrites=true&w=majority`)*

### Step 3: Run the Backend Server
```bash
cd server
npm run dev
```
The server will start at `http://localhost:5000`.

*(Optional: If MongoDB is connected and you want to seed realistic Indian MSME sample data, run `npm run seed` inside `server/`)*

### Step 4: Run the Frontend Client
In a separate terminal window:
```bash
cd client
npm run dev
```
The Vite development server will start at `http://localhost:5173`. Open this URL in any modern web browser.

---

## 7. Automated Testing & Verification

Automated test scripts have been provided to verify backend integrity:

1. **Schema & Model Validation Tests**:
   ```bash
   cd server
   npm test
   ```
   *Verifies schema requirements, auto-computation of remaining balance, random ID generation, and rejection of invalid status enums.*

2. **API & Connectivity Verification Tests**:
   ```bash
   cd server
   node test-api.js
   ```
   *Verifies HTTP server initialization, `/api/health` status, database connection reporting, and API error formatting.*

3. **Frontend Production Build Test**:
   ```bash
   cd client
   npm run build
   ```
   *Verifies all React JSX components, Tailwind styles, and modules bundle with zero errors.*

---

## 8. Feature Status: Completed vs. Future Scope

### Implemented & Fully Functional (Stage 1)
- [x] Full MERN folder structure with clean modular separation.
- [x] React 18 + Vite frontend configured with Tailwind CSS design system.
- [x] Express backend with RESTful agreement routes, controllers, and Mongoose schema.
- [x] Human-readable agreement ID generation (`AGR-YYYYMMDD-XXXX`).
- [x] Auto-computation of outstanding balances from total and advance payments.
- [x] Form validation (date ranges, positive figures, required fields).
- [x] Merchant Dashboard with key performance indicators and financial pipeline metrics.
- [x] Agreement Registry with real-time text search and lifecycle status filtering.
- [x] Document-Style Agreement View formatted with Indian business terms, print/PDF layout, and direct status progression.
- [x] Graceful database error handling and UI indicators when MongoDB is offline vs live.
- [x] Realistic Indian small-business sample seeder script.

### Planned for Later Stages (Out of Initial Scope)
- [ ] Multi-tenant user authentication (JWT / sessions) for merchants and customers.
- [ ] WhatsApp API / SMS OTP integration for customer instant agreement confirmation.
- [ ] SHA-256 tamper-evident cryptographic verification hash.
- [ ] Photo / work milestone progress attachments.
- [ ] Guided dispute resolution workflow.
- [ ] Multilingual creation (Hindi, Hinglish, regional scripts).
