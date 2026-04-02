# 🤖 ResumeAI – AI-Powered Resume Generator

> **Mini Project | B.E. / B.Tech | Artificial Intelligence**

A web application that uses AI (Claude by Anthropic) to help students and freshers generate professional, ATS-friendly resumes in minutes.

---

## 📁 Project Structure

```
ai-resume-generator/
├── frontend/
│   ├── index.html        ← Landing page
│   ├── form.html         ← Multi-step resume form
│   ├── preview.html      ← Resume preview + PDF download
│   ├── css/style.css     ← All styles
│   └── js/
│       ├── form.js       ← Form logic, validation, step navigation
│       ├── preview.js    ← Resume rendering (2 templates) + PDF export
│       └── ai-helper.js  ← Calls Claude AI API from browser
├── backend/
│   ├── app.py            ← Flask REST API
│   ├── ai_engine.py      ← Python AI integration (Claude API)
│   ├── resume_generator.py ← PDF generation using ReportLab
│   └── templates/        ← HTML resume templates
├── database/
│   └── user_data.json    ← Simple JSON database
├── output/               ← Generated PDFs stored here
├── requirements.txt
└── README.md
```

---

## 🚀 How to Run

### Option A: Frontend Only (Easiest for Demo)

Just open `frontend/index.html` in a browser. The AI calls happen directly from JavaScript.

> ⚠️ You need an **Anthropic API key** for AI features. Without it, the app still works — it just skips AI enhancement.

### Option B: Full Stack (Backend + Frontend)

**Step 1: Install Python dependencies**
```bash
pip install -r requirements.txt
```

**Step 2: Set your API key**
```bash
# Windows
set ANTHROPIC_API_KEY=your_key_here

# Mac/Linux
export ANTHROPIC_API_KEY=your_key_here
```

**Step 3: Start the backend**
```bash
cd backend
python app.py
```

**Step 4: Open browser**
```
http://localhost:5000
```

---

## 🔑 Getting an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to **API Keys** → Create new key
4. Copy and use it in your `.env` or environment variable

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🤖 AI Content | Claude AI rewrites your rough notes into professional language |
| 📄 2 Templates | Classic (gold accents) and Modern (dark sidebar) designs |
| ⬇ PDF Download | One-click PDF export using html2pdf.js |
| ✅ ATS Friendly | Structured format passes Applicant Tracking Systems |
| 📱 Responsive | Works on desktop and mobile |
| 💾 Data Saved | Form data saved in localStorage |

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| AI | Anthropic Claude API (claude-sonnet) |
| Backend | Python, Flask, Flask-CORS |
| PDF | html2pdf.js (frontend), ReportLab (backend) |
| Database | JSON file (user_data.json) |

---

## 📸 Pages

1. **Home** (`index.html`) – Landing page with features overview
2. **Form** (`form.html`) – 5-step form: Personal → Education → Skills → Experience → Projects
3. **Preview** (`preview.html`) – AI-enhanced resume with template switcher + PDF download

---

## 👨‍💻 How AI Works

1. User fills the form with basic info
2. On submit, data is sent to **Claude AI** (Anthropic)
3. AI generates:
   - Professional summary
   - Enhanced skill list
   - Action-verb bullet points for experience
   - Professional project descriptions
4. Enhanced content is rendered in the resume template
5. User downloads PDF

**Example:**
- User types: *"i know python and made a website"*
- AI writes: *"Proficient in Python programming with hands-on experience building full-stack web applications."*

---

## 📝 Project Report Info

- **Domain:** Artificial Intelligence / Web Development
- **Category:** Mini Project
- **Tools:** HTML, CSS, JS, Python, Flask, Claude AI API
- **Target Users:** Students, freshers, job seekers

---

*Built with ❤️ for College Mini Project*
