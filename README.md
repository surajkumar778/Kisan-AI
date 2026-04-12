# 🌾 Kisan AI — Final Full Stack Project
### AI-powered Crop Advisory for Indian Farmers (with Voice Features)

---

## 📁 Project Structure

```
kisan-ai-final/
├── backend/                    ← Express.js API server
│   ├── src/
│   │   ├── config/             ← Gemini AI + Mandi price config
│   │   ├── controllers/        ← Route handlers
│   │   ├── middleware/         ← Logger, rate limiter, error handler
│   │   ├── routes/             ← API routes (/api/recommend, /health)
│   │   ├── services/           ← Gemini AI, Weather, Mandi services
│   │   └── utils/              ← Validators, fallback data
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/                   ← React + Vite app
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useVoice.js     ← 🎙️ Voice engine (TTS + STT)
│   │   ├── components/
│   │   │   └── VoiceBar.jsx    ← 🎙️ Floating voice assistant widget
│   │   ├── pages/
│   │   │   ├── Home.jsx        ← Landing page (with voice banner)
│   │   │   ├── About.jsx       ← About Kisan AI
│   │   │   ├── Contact.jsx     ← Contact form
│   │   │   └── Advisor.jsx     ← AI Crop Advisor (with voice results)
│   │   ├── App.jsx             ← Router + Navbar + Footer + VoiceBar
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                ← Root: runs both together
└── README.md
```

---

## 🚀 Quick Start (Recommended — Single Command)

### Step 1 — Install all dependencies
```bash
cd kisan-ai-final
npm run install:all
```

### Step 2 — Add API keys
```bash
cd backend
cp .env.example .env
```
Edit `.env`:
```
GEMINI_API_KEY=your_gemini_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
PORT=5000
```

### Step 3 — Run both frontend + backend together
```bash
cd kisan-ai-final
npm run dev
```

### Step 4 — Open browser
```
http://localhost:5173
```

---

## 🔧 Run Separately (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd kisan-ai-final/backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd kisan-ai-final/frontend
npm install
npm run dev
```

---

## 🔑 API Keys (Free)

| Key | Where to Get | Cost |
|-----|-------------|------|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) | Free |
| `OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) | Free tier |

> **No keys?** The app still works — it falls back to demo data automatically.

---

## 🎙️ Voice Features

Designed for farmers who may not be comfortable reading text.

| Feature | Description |
|---------|-------------|
| 🔊 **Auto-read results** | Crop recommendations are automatically read aloud in Hindi/English when they arrive |
| 🎙️ **Floating Voice Button** | Fixed 🎙️ button on every page — tap to open the voice panel |
| 📢 **Page greeting** | Each page speaks a welcome message when voice panel opens |
| 🎤 **Mic Input** | Speak questions like "फसल क्या बोएं?" and get a spoken answer |
| 🔊 **Listen banner** | Home page has a banner to listen to the page summary |
| 🔊 **Listen to Results** | Purple button in Advisor reads crop results aloud |
| 🌐 **Hindi + English** | Follows the language toggle on the Advisor page |

> Works best in **Chrome on Android** — which most Indian farmers use.

---

## 📦 Build for Production

```bash
cd kisan-ai-final
npm run build
# Output in frontend/dist/
```

---

## 🌐 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with features and stats |
| About | `/about` | About Kisan AI and the team |
| Contact | `/contact` | Contact form |
| AI Advisor | `/advisor` | Crop recommendation form + results |

