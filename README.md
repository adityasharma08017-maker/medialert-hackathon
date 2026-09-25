# 🏥 MediaLert Hackathon Project

A smart emergency medical triage and tracking system built to help users quickly assess health situations and locate immediate help.

## 🚀 Project Overview
This application takes symptom inputs from a user, evaluates the situation, and provides immediate actionable steps to connect them with emergency care.

### Key Features:
* **Symptom Input & Triage:** Collects user symptoms and automatically categorizes them into **4 distinct severity conditions** (Low, Medium, High, Critical).
* **Location Tracking:** Uses a **mic/voice input location tracker** to pinpoint the user's live position.
* **Smart Hospital Recommendations:** Recommends the **nearest hospital** based on the tracked location.
* **Direct Emergency Contact:** Displays the recommended hospital's **phone number** for immediate actions.
* **Ambulance Availability:** Shows live availability status for **ambulances** to speed up emergency response.

## 🛠️ Tech Stack
* **Frontend/Build Tool:** Vite, TypeScript (`server.ts`, `tsconfig.json`)
* **AI Integration:** Google AI Studio (Gemini API)

## ⚙️ How to Run Locally

### Prerequisites
Make sure you have **Node.js** installed on your computer.

### Installation Steps
1. Clone or download this repository.
2. Open your terminal in the project folder and install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory (you can duplicate `.env.example`) and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
