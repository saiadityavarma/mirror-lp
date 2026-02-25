# Mirror — A Self-Contradiction Engine

> *"The unexamined life is not worth living."* — Socrates  
> *Most people have never actually examined theirs.*

**Mirror** surfaces the contradictions between what you believe about yourself and what your beliefs actually imply. Not a quiz. Not a journal prompt. A logic engine for your own self-perception.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Built with FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Built with Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![GitHub Stars](https://img.shields.io/github/stars/saiadityavarma/mirror-lp?style=social)](https://github.com/saiadityavarma/mirror-lp)

![Mirror Demo](docs/demo.gif)

---

## The Problem

You think you value honesty. But you also think white lies are sometimes kind.  
You think you have a growth mindset. But you also think some people are just naturally smarter.  
You think you take ownership. But you also think your last failure was mostly bad luck.  
You think you live with agency. But you also think the system is rigged against you.

These are not just inconsistencies.

They are the **exact places where your self-perception diverges from your operating system** — the beliefs that actually run your decisions, your relationships, and your life.

**Mirror finds them.**

---

## How It Works

```
You enter a belief → Mirror categorizes it → Mirror compares it to your other beliefs
→ Contradictions surface → You see a live graph of your internal logic
```

1. **Choose a framework** — Agency, Ethics, Stoic Virtues, Amazon Leadership Principles, or define your own
2. **Enter your beliefs** — Plain language. Rate them on a Likert scale (Strongly Disagree → Strongly Agree)
3. **Mirror categorizes them** — Sentence embeddings map each belief to the most relevant principle
4. **Contradictions surface** — An AI engine compares semantically similar beliefs and flags logical inconsistencies
5. **See the graph** — A live visualization shows your belief network: 🟢 green = internally consistent, 🔴 red = contradiction

No right answers. No scores. No advice.  
Just a mirror.

---

## Frameworks

| | Framework | Core Question | Principles |
|---|-----------|--------------|------------|
| 🧠 | **Agency & Personal Power** *(default)* | Are you the author of your life? | Self-Determination, Accountability, Intentionality, Resilience, Boundaries, Growth Mindset, Authenticity, Agency over Fear |
| ⚖️ | **Ethics & Character** | Do your actions match your values? | Honesty, Fairness, Courage, Compassion, Integrity, Responsibility, Humility, Wisdom |
| 🏛️ | **Stoic Virtues** | What is actually in your control? | Wisdom, Justice, Courage, Temperance, Amor Fati, Memento Mori, Dichotomy of Control, Present Moment |
| 📦 | **Amazon Leadership Principles** | How do you operate at scale? | All 16 LPs |
| ✏️ | **Custom** *(coming soon)* | Whatever matters to you | Define your own principles |

---

## Why This Exists

Most self-improvement tools tell you what to do.  
Mirror just shows you what you already believe — and where those beliefs conflict with each other.

The insight is not in the answer. It is in the contradiction.

Cognitive dissonance is uncomfortable. That discomfort is the signal.  
This tool is built to surface it, not resolve it. What you do with it is up to you.

---

## Architecture

```
┌──────────────────────────────────────────────┐
│               Next.js Frontend               │
│                                              │
│  Framework Selector  │  Statement Input      │
│  React Flow Graph    │  Likert Scale         │
└──────────────────────┬───────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼───────────────────────┐
│               FastAPI Backend                │
├──────────────────────────────────────────────┤
│  /api/frameworks   → list all frameworks     │
│  /api/questions    → add + auto-check belief │
│  /api/graph        → get contradiction graph │
│  /api/check        → manual pair comparison  │
├──────────────────────────────────────────────┤
│  sentence-transformers  →  belief embedding  │
│  ChromaDB               →  semantic search   │
│  SQLite                 →  statement storage │
│  Gemini API             →  contradiction AI  │
└──────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/saiadityavarma/mirror-lp.git
cd mirror-lp

# 2. Backend
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY=your-key-here
cd .. && python -m backend.main
# Backend runs at http://localhost:8000

# 3. Frontend (new terminal)
cd frontend
npm install && npm run dev
# Frontend runs at http://localhost:3000
```

### API Keys Needed
| Key | Where to get it | Required? |
|-----|----------------|-----------|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) | Yes |

---

## API Reference

```bash
# List all frameworks
GET /api/frameworks

# Add a belief statement
POST /api/questions
{ "text": "I own my mistakes fully", "answer": "Strongly Agree", "framework_id": "agency" }

# Get the contradiction graph
GET /api/graph

# Check two beliefs manually
POST /api/check
{ "question_text": "...", "question_answer": "Agree", "compare_text": "...", "compare_answer": "Disagree" }
```

---

## Roadmap

### Near Term
- [ ] Custom framework builder UI
- [ ] Export contradiction report as PDF / share link
- [ ] Session history — watch your beliefs evolve over time
- [ ] Reflection prompts generated per detected contradiction

### Medium Term
- [ ] Team mode — map shared contradictions across a group
- [ ] Mobile app (React Native)
- [ ] Weekly reflection digest via email or Telegram
- [ ] Anonymous public heatmaps — which principles do people contradict most?

### Long Term
- [ ] Multi-session longitudinal analysis ("you've resolved this contradiction")
- [ ] Integration with journaling apps (Notion, Obsidian, Day One)
- [ ] Voice input mode

---

## Contributing

Mirror is intentionally simple to extend.

### Add a new framework (5 minutes)

1. Open `backend/config.py`
2. Add your framework to the `FRAMEWORKS` dict:

```python
"your_framework": {
    "name": "Your Framework Name",
    "description": "The core question it asks.",
    "icon": "🔥",
    "principles": ["Principle 1", "Principle 2", ...],
    "colors": ["#hexcolor1", "#hexcolor2", ...],
}
```

3. Open a PR — we merge fast.

### Everything else

- **Bug reports:** open an issue with repro steps
- **Feature requests:** open an issue, label it `enhancement`
- **Code:** fork, branch, PR — all contributions welcome

---

## Philosophy

> *"Between stimulus and response there is a space. In that space is our power to choose our response."* — Viktor Frankl

Mirror is built on one idea: **most people's self-model is wrong in specific, findable ways.**

Not wrong in a damning way. Wrong in the way that every human is slightly inconsistent — because we build our beliefs across different contexts, different years, different versions of ourselves. Those inconsistencies compound. They become the invisible architecture of our decisions.

Mirror doesn't judge. It just shows you where the beams don't align.

---

## License

MIT — use it, fork it, build on it.

---

*Built by [Sai Aditya Varma](https://linkedin.com/in/aditya-v-av)*  
*Star it if it made you think ⭐*
