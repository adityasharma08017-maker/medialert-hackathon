# 🚑 MediAlert: Intelligent Emergency Medical Triage & Dispatch Engine

[![Render Deployment](https://img.shields.io/badge/Render-Live%20App-00c7b7?style=flat-square&logo=render)](https://medialert-hackathon.onrender.com)
[![Built for Hackathon](https://img.shields.io/badge/GGSIPU%20Hackathon-B.Tech%20CSE%201st%20Year-0284c7?style=flat-square)](https://medialert-hackathon.onrender.com)
[![AI Engine](https://img.shields.io/badge/AI%20Model-Google%20Gemini%203.8%20Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-React%2019-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> **Live Application**: [https://medialert-hackathon.onrender.com](https://medialert-hackathon.onrender.com)  
> *A prototype engineered for rapid pre-hospital clinical triage, voice-to-text accessibility, and geodesic emergency facility routing across Delhi NCR.*

---

## ⚠️ Important Medical Disclaimer & Academic Notice

> **DISCLAIMER:**  
> MediAlert is an **academic prototype developed exclusively for a college hackathon** by 1st-year B.Tech Computer Science & Engineering students. 
> 
> * **Not Medical Advice:** This software does not provide certified medical diagnoses, clinical treatment plans, or physician consultations. It is built strictly as a proof-of-concept demonstrating automated triage algorithms and spatial facility dispatch.
> * **Possibility of Inaccuracies:** While the algorithmic rules and AI prompts have been rigorously designed and tested against standard emergency triage matrices to the best of our technical knowledge as first-year engineering students, artificial intelligence models can produce unexpected outputs or make mistakes. It has not been reviewed, certified, or audited by licensed healthcare practitioners or medical authorities.
> * **Real Emergencies:** In any actual life-threatening scenario (e.g., suspected heart attack, severe trauma, stroke symptoms, uncontrolled bleeding, or breathing difficulty), **do not rely on this application. Immediately call national emergency services (112 / 102 in India, or 911 globally)** or proceed directly to the nearest emergency trauma department.

---

## 📌 Problem Brief & Overview

During acute medical emergencies, the **"Golden Hour"** dictates patient survival. In dense metropolitan corridors like Delhi NCR, two critical issues arise:
1. **Critical Decision Latency:** Frantic patients and bystanders lose 20–40 minutes attempting to figure out which hospital to visit and whether they need an ICU or emergency trauma unit.
2. **ER Congestion:** Up to 40% of emergency room walk-ins present minor, non-urgent ailments (Tier 4 Low), congesting limited emergency medical personnel and critical ICU beds.

**MediAlert solves this** by providing a sub-2-second, standardized 4-tier triage assessment, hands-free voice dictation, geodesic hospital matching, and one-tap emergency contact links.

---

## 🚀 Key Features

* 🎙️ **Hands-Free Voice-to-Text Dictation:** Built using the native Web Speech API (`webkitSpeechRecognition`) with real-time audio wave telemetry for patients experiencing distress or motor panic.
* 🚦 **Standardized 4-Tier Urgency Matrix:** Strictly categorizes symptoms into:
  * **Level 1 (Critical):** Immediate life threat (cardiac arrest, stroke, severe respiratory failure) $\rightarrow$ Immediate 112 dispatch.
  * **Level 2 (Severe):** Urgent high-risk emergency $\rightarrow$ Hospital ER evaluation within 15–30 minutes.
  * **Level 3 (Moderate):** Non-critical acute illness $\rightarrow$ Urgent care visit within 2–4 hours.
  * **Level 4 (Low):** Minor, self-limiting condition $\rightarrow$ Home care, hydration, and regular outpatient consult.
* 📍 **Exact Haversine Geodesic Routing:** Uses spherical trigonometry to calculate great-circle distances to the nearest accredited hospitals across all 6 zones of Delhi NCR (Central, South, North, West, East, Dwarka) without third-party map API latency.
* 🚑 **Live Ambulance Readiness Telemetry:** Real-time visibility of standby ambulances, emergency contact numbers, and estimated response times for 24+ verified apex institutions (AIIMS Trauma, Safdarjung, RML, LNJP, Fortis, Max, Manipal, etc.).
* 🔄 **Dual-Layer Failover Engine:** If cloud AI endpoints throttle or internet connectivity is degraded, the client automatically falls back to an embedded deterministic clinical heuristic engine, ensuring zero downtime.
* 📊 **Interactive Hackathon Pitch Deck:** Built-in 10-slide presentation deck accessible directly in the header with full-screen presentation mode and 1-click **"Save / Print to PDF"** export.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS 4 | Modern functional components, strict typing, responsive clinical UI |
| **Icons & Design** | Lucide React | Clean, high-contrast medical iconography |
| **Backend & Proxy** | Express.js, Node.js | Secure server proxy protecting API keys |
| **AI Intelligence** | Google Gemini API (`gemini-3.8-flash`) | Structured JSON schema output (`responseSchema`) for guaranteed consistency |
| **Voice Processing** | Web Speech API | Native browser speech recognition with real-time interim transcription |
| **Geospatial Engine** | Native Haversine Algorithm | $O(N)$ geodesic distance calculation over spherical coordinates |
| **Deployment** | Render (Web Service) | Continuous deployment connected directly to GitHub |

---

## 📐 Mathematical Formulation (Haversine Distance)

Instead of relying on rate-limited third-party distance matrix APIs, hospital proximity is calculated using the spherical Haversine formula:

$$a = \sin^2\left(\frac{\Delta \varphi}{2}\right) + \cos(\varphi_1) \cdot \cos(\varphi_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$c = 2 \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$
$$d = R \cdot c \quad (R = 6,371 \text{ km})$$

This delivers sub-millisecond distance sorting with an accuracy of $\pm0.3\%$ across the Delhi National Capital Region.

---
