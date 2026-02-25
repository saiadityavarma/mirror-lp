# Mirror LP

A true mirror for self-assessment against Amazon's 16 Leadership Principles. Enter your beliefs and see where your answers contradict each other — surfacing blind spots in your self-perception.

## How It Works

1. Enter self-assessment statements with Likert-scale answers (Strongly Disagree → Strongly Agree)
2. Statements are auto-categorized into one of the 16 Leadership Principles using embeddings
3. Similar statements are checked for contradictions via Gemini AI
4. Results visualized as a graph — green edges = consistent, red edges = contradiction

## Leadership Principles Tracked

| # | Principle | What It Measures |
|---|-----------|-----------------|
| 1 | Customer Obsession | Starting with the customer and working backwards |
| 2 | Ownership | Acting on behalf of the entire company, thinking long-term |
| 3 | Invent and Simplify | Innovation and reducing complexity |
| 4 | Are Right, A Lot | Strong judgment, seeking diverse perspectives |
| 5 | Learn and Be Curious | Continuous learning and self-improvement |
| 6 | Hire and Develop the Best | Talent recognition and mentoring |
| 7 | Insist on the Highest Standards | Quality bar and continuous improvement |
| 8 | Think Big | Bold vision and ambitious goals |
| 9 | Bias for Action | Speed, calculated risk-taking |
| 10 | Frugality | Resourcefulness, doing more with less |
| 11 | Earn Trust | Candor, respect, self-criticism |
| 12 | Dive Deep | Staying connected to details |
| 13 | Have Backbone; Disagree and Commit | Courage to challenge, then commit |
| 14 | Deliver Results | Focus on inputs, meeting commitments |
| 15 | Strive to be Earth's Best Employer | Empathy, inclusion, development |
| 16 | Success and Scale Bring Broad Responsibility | Broader impact, sustainability |

## Architecture

```
Next.js (React Flow graph) ──fetch──> FastAPI (Python)
                                        ├── sentence-transformers (embeddings)
                                        ├── ChromaDB (vector search)
                                        ├── SQLite (structured storage)
                                        └── Gemini API (consistency analysis)
```

## Setup

### Backend

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY=your-key-here
cd .. && python -m backend.main
```

Backend runs on http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000
