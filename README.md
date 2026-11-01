# Automata Lab

**Interactive Automata Theory Simulator**  
Course: CSET302 — Automata Theory and Computability

---

## Overview

Automata Lab is a plain HTML/CSS/JavaScript website that simulates the **NFA to DFA Subset Construction algorithm** in the browser. No npm, no build step, no backend.

Open `index.html` in any modern browser to start.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page — intro, features, module list |
| `dashboard.html` | Dashboard — all 15 module cards with filtering |
| `simulator.html` | ★ Primary simulator — full NFA→DFA workspace |
| `learning.html` | Theory guide — NFA, DFA, algorithm, worked example |
| `about.html` | Project info, architecture, module status |
| `tests.html` | In-browser test suite — 13 automated algorithm tests |

---

## How to Run

1. Download or clone this folder.
2. Open `index.html` in Chrome, Firefox, or Safari.
3. No server required — all pages work as local files.

**To run from a local server (optional):**
```
python3 -m http.server 3000
# then open http://localhost:3000
```

---

## Simulator Usage

1. Open `simulator.html`
2. Load an example from the dropdown **or** enter your own NFA:
   - Add states (e.g. `q0`, `q1`, `q2`)
   - Add alphabet symbols (e.g. `0`, `1`)
   - Select the initial state
   - Check the final states
   - Fill in the transition table
3. Click **Run Subset Construction**
4. Explore the four tabs:
   - **DFA Graph** — visualise the generated DFA (drag to pan, +/- to zoom)
   - **Transition Table** — full DFA δ table
   - **Step View** — step through the algorithm with Prev/Next/Play
   - **Test String** — test any string for acceptance

---

## Running Tests

Open `tests.html` in a browser and click **Run All Tests**.

13 automated tests cover:
- Single-state trivial NFA
- Assignment example (canonical 4-state DFA)
- Multiple final states
- Multiple transitions for same symbol
- Unreachable states
- Missing transitions / dead state
- Self-loops
- Empty string (ε) — accepted and rejected cases
- Valid accepted string
- Valid rejected string
- Invalid symbol in test string
- String entering dead state

---

## File Structure

```
automata-lab/
├── css/
│   └── style.css              — complete design system
├── js/
│   ├── algorithms/
│   │   └── nfaToDfa.js        — subset construction (pure function)
│   ├── validators/
│   │   └── nfaValidator.js    — input validation
│   ├── utils/
│   │   └── stateSetUtils.js   — set utilities
│   ├── data/
│   │   ├── examples.js        — 5 example NFAs
│   │   └── simulatorRegistry.js — all 15 module definitions
│   └── components/
│       └── layout.js          — navbar, footer, theme
├── index.html
├── dashboard.html
├── simulator.html
├── learning.html
├── about.html
├── tests.html
└── README.md
```

---

## Algorithm

The subset construction is implemented as a pure function in `js/algorithms/nfaToDfa.js`:

```
subsetConstruction(nfa) → { dfa, steps, initialLabel }
```

- `dfa` — complete DFA object (states, alphabet, transitions, finalStates, deadState)
- `steps` — pre-computed array of SimulationStep objects for playback
- Each step contains: currentSubset, symbol, NFA transitions examined, resulting subset, new/existing flag, queue

The algorithm runs in `O(2ⁿ · |Σ|)` where n = number of NFA states.

---

## Design

- Dark/light theme (persists to localStorage, respects system preference)
- Responsive layout — works on mobile, tablet, desktop
- Accessible — ARIA roles, labels, keyboard navigation
- No external dependencies except Google Fonts

---

## Deployment

The site is a collection of static files. Deploy by uploading the folder to:
- **Vercel** — drag the folder into vercel.com/new
- **Netlify** — drag the folder into netlify.com/drop
- **GitHub Pages** — push to a repo and enable Pages

No build step, no configuration needed.
