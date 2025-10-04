<!-- Banner -->
<p align="center">
  <img src="https://img.shields.io/badge/AI%20for%20Good-🌱-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Top%2010-IEEE%20Tech%20Sangam%20Hackathon-blue?style=for-the-badge" />
</p>

<h1 align="center"> EcoLens</h1>
<p align="center">AI-Powered Environmental Sustainability Analyzer</p>

<p align="center">
  <i>Redefining sustainability by revealing the hidden footprint of everyday products.</i>
</p>

---

## ✨ Overview

Every day, millions of purchasing decisions are made without understanding their environmental cost.  
**EcoLens** bridges this gap by analyzing ingredients, lifecycle impact, and packaging choices—empowering both **consumers** and **manufacturers** to make conscious, sustainable decisions.

---

## 🚀 Key Features

- **Scan-to-Insight** → Instantly uncover a product's environmental footprint  
- **Ingredient Intelligence** → Decode hidden formulations into sustainability metrics  
- **Lifecycle Assessment Engine** → Predict, compare, and optimize product sustainability  
- **AI-Powered Reasoning** → Contextual insights powered by Groq's LLaMA models + Tavily  
- **Voice-First Experience** → Accessibility through Whisper + TTS  
- **Seamless Web App** → Built with React.js, Next.js, and MongoDB for scale

---

## 🏆 Recognition

🌱 **Top 10 Finalist** at *IEEE Tech Sangam Hackathon*  
Recognized for combining **AI, Sustainability, and Accessibility** to drive climate impact

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js, Next.js, TailwindCSS |
| **Backend** | Python (Flask, FastAPI), MongoDB, Node.js, Express.js |
| **ML Models** | Transformers, RandomForest, GradientBoosting |
| **AI Reasoning** | Groq LLaMA-3.1 + Tavily |
| **Voice AI** | OpenAI Whisper, TTS |
| **Infrastructure** | Docker, REST APIs |

---

## 📂 Repository Structure

```bash
EcoLens/
├── Frontend/                  # React + Next.js web app
│   ├── backend/               # Node.js + Express API for auth, uploads, products
│   ├── public/                # Static assets (logos, images, icons)
│   └── src/                   # App pages, components, chatbot, dashboards
│
├── ML-Backend/                # AI/ML engine + FastAPI backend
│   ├── Agents/                # AI agents (satellite analyst, sustainability reports)
│   ├── Alerts/                # Eco alerts + monitoring service (Node.js server)
│   ├── LCA/                   # Lifecycle Assessment models, results & comparisons
│   ├── chatbot/               # Voice & text chatbot powered by Whisper + LLaMA
│   ├── dataset_building/      # Scripts + datasets for eco-score generation
│   ├── ocr/                   # OCR + barcode/url-based product data extraction
│   ├── proportions-quantifier/# Ingredient proportion prediction models
│   ├── main.py                # Entry point for backend server
│   └── requirements.txt       # Python dependencies
│
└── README.md                  # Project documentation
```

---

## 🔧 Local Setup

Follow these steps to run EcoLens locally:

### 1️⃣ Frontend (Terminal 1)

```bash
cd frontend
npm install
npm run dev
```

The frontend should now run on http://localhost:3000.

### 2️⃣ Backend with Ngrok (Terminal 2)

```bash
cd backend
ngrok http 5001
```

Copy the generated HTTPS URL (e.g., `https://2593391a16e1.ngrok-free.app`).

Open your `.env` file and paste it as your `BACKEND_PUBLIC_URL`.

### 3️⃣ Backend Server (Terminal 3)

```bash
cd backend
node server.js
```

### 4️⃣ Configure .env

Create a `.env` file inside the `backend/` directory with the following variables:

```bash
PORT=5001
ML_BASE_URL=https://prishaa-library-space.hf.space

# Replace this with your ngrok URL
BACKEND_PUBLIC_URL=https://2593391a16e1.ngrok-free.app  

BACKEND_URL=http://localhost:5001
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
CLOUDINARY_NAME=your_cloudinary_name

JWT_SECRET=your_jwt_secret
SENDER_EMAIL=your_email
SENDER_PASSWORD=your_email_password
GOV_EMAIL=gov_email_if_any
```

✅ **After this setup, your EcoLens app will be live locally with:**

- Frontend → http://localhost:3000
- Backend (Ngrok) → https://xxxxxx.ngrok-free.app

---

## 🔮 Future Scope

-  **Cross-Domain Expansion** → Extend sustainability analysis to **food, fashion, consumer electronics, and logistics**, creating a unified eco-intelligence platform.
-  **Seamless Retail Integration** → Partner with **e-commerce platforms, supermarkets, and manufacturers** to embed real-time eco scores into purchase journeys.
-  **Ubiquitous Accessibility** → Build **mobile-first apps (Android & iOS)** with AR-powered product scanning for instant sustainability insights.
-  **Smarter AI Insights** → Enhance reasoning with **multi-agent systems** that can cross-verify product data, predict carbon hotspots, and recommend eco-friendly alternatives.
-  **Enterprise SaaS Offering** → Provide a **cloud-based platform** for enterprises, NGOs, and governments to track and improve supply chain sustainability at scale.
-  **IoT & Satellite Data Fusion** → Incorporate **IoT sensors, geospatial analytics, and satellite imagery** to validate sourcing claims and monitor environmental footprints.
-  **Policy & Awareness Impact** → Support **regulatory compliance checks** and build **consumer education dashboards** to drive large-scale behavioral change.

---

##  Contributors

We thank all the amazing contributors who built **EcoLens** 🌱

- **Anannaya Agarwal**
- **Ishita Sodhiya**
- **Loheyta Dhanure**
- **Prisha Birla**
- **Sakshi Sangale**

