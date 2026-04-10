# 💸 CashBridge

**Peer-to-Peer Cash Exchange Platform**  
*Digital money ↔ Physical cash, instantly and safely*

---

## 🚀 Setup Instructions

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

---

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📱 How to Demo

1. Open `http://localhost:3000`
2. Enter your name and phone
3. Choose **"Get Cash"** (Seeker flow) or **"Give Cash"** (Provider flow)

### Seeker Flow:
- Enter amount (max ₹1000)
- See nearby providers on map
- Select a provider → Request match
- Enter OTP shown in demo hint → Confirm

### Provider Flow:
- See incoming cash requests
- Accept a request
- Show OTP to seeker
- Mark as complete → Earn commission

---

## 🏗 Project Structure

```
cashbridge/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt
│   ├── routes/
│   │   └── match.py         # All API endpoints
│   └── data/
│       └── fake_users.py    # Demo database
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx     # Role selection + login
    │   │   ├── Seeker.jsx   # Get cash flow
    │   │   ├── Provider.jsx # Give cash flow
    │   │   └── Success.jsx  # Transaction complete
    │   ├── App.jsx          # Router
    │   └── index.css        # Global design system
    └── vite.config.js
```

---

## 🔑 Key Features

- **Max ₹1000 per transaction** — safety by design
- **OTP verification** — cash confirmed before exchange
- **Trust score system** — ratings unlock higher limits
- **GPS-based matching** — find providers within 1km
- **Commission model** — providers earn ₹2-10 per transaction




