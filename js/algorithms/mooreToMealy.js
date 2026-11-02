/**
 * mooreToMealy.js  —  Automata Lab core engine (pure JS, no DOM)
 *
 * Implements:
 *   mooreToMealy(moore)    → { mealy, steps, note }
 *   simulateMoore(moore, input) → { outputString, trace, stateTrace }
 *   simulateMealy(mealy, input) → { outputString, trace, finalState, error }
 *   validateMoore(moore)   → { errors[], warnings[] }
 *   findUnreachable(moore) → string[]
 *   generateRandom(cfg)    → MooreMachine
 *   parseMooreText(text)   → { machine, errors[] }
 *   serializeMoore(moore)  → string
 *   checkEquivalence(moore, mealy, input) → { equivalent, mooreOut, mealyOut }
 */

// ─────────────────────────────────────────────────────────────
// 1. CONVERSION ALGORITHM
// ─────────────────────────────────────────────────────────────

/**
 * Convert a Moore machine to a Mealy machine.
 *
 * Rule: λ'(q, a) = λ(δ(q, a))
 * Time complexity: O(|Q| · |Σ|)
 *
 * @param {Object} moore
 * @returns {{ mealy, steps, note }}
 */
function mooreToMealy(moore) {
  const steps = [];
  const mealyTransitions = {};
  let stepIndex = 0;

  for (const state of moore.states) {
    mealyTransitions[state] = {};
    for (const symbol of moore.inputAlphabet) {
      const nextState = (moore.transitions[state] && moore.transitions[state][symbol]) || null;

      if (!nextState) {
        steps.push({
          index: stepIndex++,
          fromState: state, symbol,
          nextState: null, mooreOutput: null,
          pseudocodeLine: 4,
          description: `δ(${state}, ${symbol}) is undefined — no Mealy edge created.`,
          explanation: `The transition from state ${state} on input "${symbol}" is missing in the Moore machine. No Mealy edge is created for this pair.`
        });
        continue;
      }

      // Core rule: λ'(q,a) = λ(δ(q,a)) = λ(nextState)
      const mooreOutput = moore.outputs[nextState] !== undefined ? String(moore.outputs[nextState]) : '?';
      mealyTransitions[state][symbol] = { nextState, output: mooreOutput };

      steps.push({
        index: stepIndex++,
        fromState: state, symbol, nextState, mooreOutput,
        pseudocodeLine: 6,
        description: `δ(${state}, ${symbol}) = ${nextState}  →  λ(${nextState}) = "${mooreOutput}"  →  Mealy edge: ${state} —${symbol}/${mooreOutput}→ ${nextState}`,
        explanation:
          `Step ${stepIndex}: Processing state ${state} on input "${symbol}". ` +
          `The Moore transition leads to state ${nextState}. ` +
          `The Moore output of ${nextState} is λ(${nextState}) = "${mooreOutput}". ` +
          `So the Mealy edge (${state}) —${symbol}/${mooreOutput}→ (${nextState}) is created.`
      });
    }
  }

  return {
    mealy: {
      states:         [...moore.states],
      inputAlphabet:  [...moore.inputAlphabet],
      outputAlphabet: [...moore.outputAlphabet],
      initialState:   moore.initialState,
      transitions:    mealyTransitions
    },
    steps,
    note: `Important: The Moore machine emits λ(${moore.initialState}) = "${moore.outputs[moore.initialState]}" before any input is read. The Mealy machine produces no output on ε, so this first symbol is dropped. For input of length n, Moore outputs n+1 symbols; Mealy outputs n symbols. MealyOutput = MooreOutput[1:]`
  };
}

// ─────────────────────────────────────────────────────────────
// 2. SIMULATION
// ─────────────────────────────────────────────────────────────

/**
 * Simulate a Moore machine on an input string.
 * Moore outputs λ(q0) BEFORE reading any input, then λ(qi) after each step.
 * Output length = input length + 1.
 */
function simulateMoore(moore, input) {
  const alphabetSet = new Set(moore.inputAlphabet);
  let current = moore.initialState;
  const stateTrace = [current];
  const trace = [];

  // Initial output λ(q0)
  let outputString = moore.outputs[current] || '';

  if (input === '' || input === null || input === undefined) {
    return {
      input: 'ε (empty)', outputString,
      stateTrace, trace,
      error: null,
      note: 'Empty input: Moore machine outputs only λ(q0).'
    };
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (!alphabetSet.has(char)) {
      return { input, outputString, stateTrace, trace,
        error: `Symbol "${char}" at position ${i+1} is not in Σ = {${moore.inputAlphabet.join(', ')}}.` };
    }
    const next = (moore.transitions[current] && moore.transitions[current][char]) || null;
    if (!next) {
      return { input, outputString, stateTrace, trace,
        error: `No transition from "${current}" on "${char}".` };
    }
    const out = moore.outputs[next] || '';
    trace.push({ step: i+1, char, fromState: current, toState: next, output: out });
    outputString += out;
    current = next;
    stateTrace.push(current);
  }

  return { input, outputString, stateTrace, trace, error: null, finalState: current };
}

/**
 * Simulate a Mealy machine on an input string.
 * Output length = input length.
 */
function simulateMealy(mealy, input) {
  const alphabetSet = new Set(mealy.inputAlphabet);
  let current = mealy.initialState;
  let outputString = '';
  const trace = [];

  if (input === '' || input === null || input === undefined) {
    return { input: 'ε (empty)', outputString: '', trace: [], error: null,
      note: 'Empty input: Mealy machine produces no output.' };
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (!alphabetSet.has(char)) {
      return { input, outputString, trace,
        error: `Symbol "${char}" at position ${i+1} is not in Σ = {${mealy.inputAlphabet.join(', ')}}.` };
    }
    const t = mealy.transitions[current] && mealy.transitions[current][char];
    if (!t) {
      return { input, outputString, trace,
        error: `No transition from "${current}" on "${char}".` };
    }
    trace.push({ step: i+1, char, fromState: current, toState: t.nextState, output: t.output });
    outputString += t.output;
    current = t.nextState;
  }

  return { input, outputString, trace, error: null, finalState: current };
}

/**
 * Check equivalence: Mealy output should equal Moore output with first symbol dropped.
 */
function checkEquivalence(moore, mealy, input) {
  const mooreResult = simulateMoore(moore, input);
  const mealyResult = simulateMealy(mealy, input);

  if (mooreResult.error || mealyResult.error) {
    return { equivalent: false, mooreOut: mooreResult.outputString, mealyOut: mealyResult.outputString,
      error: mooreResult.error || mealyResult.error };
  }

  const mooreDropped = mooreResult.outputString.slice(1);
  const equivalent   = mooreDropped === mealyResult.outputString;

  return {
    equivalent,
    mooreOut:    mooreResult.outputString,
    mealyOut:    mealyResult.outputString,
    mooreDropped,
    diff: equivalent ? null : `Moore[1:] = "${mooreDropped}" ≠ Mealy = "${mealyResult.outputString}"`
  };
}

// ─────────────────────────────────────────────────────────────
// 3. VALIDATION ENGINE
// ─────────────────────────────────────────────────────────────

/**
 * Validate a Moore machine. Returns { errors[], warnings[] }.
 * Errors block conversion; warnings are advisory.
 */
function validateMoore(moore) {
  const errors = [];
  const warnings = [];

  // ── Errors ─────────────────────────────────────────────────
  if (!moore.states || moore.states.length === 0) { errors.push({ msg: 'No states defined.', type: 'states' }); }
  if (!moore.inputAlphabet || moore.inputAlphabet.length === 0) { errors.push({ msg: 'Input alphabet Σ is empty.', type: 'alphabet' }); }
  if (!moore.outputAlphabet || moore.outputAlphabet.length === 0) { errors.push({ msg: 'Output alphabet Δ is empty.', type: 'output-alphabet' }); }
  if (!moore.initialState) { errors.push({ msg: 'No initial state selected.', type: 'initial' }); }

  const stateSet  = new Set(moore.states || []);
  const alphaSet  = new Set(moore.inputAlphabet || []);
  const outSet    = new Set(moore.outputAlphabet || []);

  // Duplicate state names
  const statesSeen = new Set();
  for (const s of (moore.states || [])) {
    if (!s || s.trim() === '') { errors.push({ msg: 'A state has an empty name.', type: 'states' }); continue; }
    if (statesSeen.has(s)) { errors.push({ msg: `Duplicate state name: "${s}".`, type: 'states', ref: s }); }
    else statesSeen.add(s);
  }

  // Initial state must be in Q
  if (moore.initialState && !stateSet.has(moore.initialState)) {
    errors.push({ msg: `Initial state "${moore.initialState}" is not in Q.`, type: 'initial' });
  }

  // Every state must have an output in Δ
  for (const s of (moore.states || [])) {
    if (!moore.outputs || moore.outputs[s] === undefined || moore.outputs[s] === '') {
      errors.push({ msg: `State "${s}" has no output (λ(${s}) is unassigned).`, type: 'output', ref: s });
    } else if (!outSet.has(moore.outputs[s])) {
      errors.push({ msg: `Output "${moore.outputs[s]}" of state "${s}" is not in Δ.`, type: 'output', ref: s });
    }
  }

  // Transition checks
  const transitionsSeen = new Set();
  for (const s of (moore.states || [])) {
    for (const sym of (moore.inputAlphabet || [])) {
      const next = moore.transitions && moore.transitions[s] && moore.transitions[s][sym];
      if (!next || next.trim() === '') {
        // Missing transition — warning (not error, user may want partial machines)
        warnings.push({ msg: `Missing transition: δ(${s}, ${sym}) is undefined. A dead state may be needed.`, type: 'missing-trans', ref: `${s},${sym}` });
        continue;
      }
      if (!stateSet.has(next)) {
        errors.push({ msg: `Transition δ(${s}, ${sym}) = "${next}" references unknown state "${next}".`, type: 'trans', ref: s });
      }
      // Nondeterminism check (shouldn't happen in a well-formed form, but guard)
      const key = `${s}__${sym}`;
      if (transitionsSeen.has(key)) {
        errors.push({ msg: `Nondeterministic transition: (${s}, ${sym}) has multiple definitions.`, type: 'nondeterminism', ref: s });
      }
      transitionsSeen.add(key);
    }
  }

  // Duplicate alphabet symbols
  const alphaSeen = new Set();
  for (const sym of (moore.inputAlphabet || [])) {
    if (alphaSeen.has(sym)) { errors.push({ msg: `Duplicate input symbol: "${sym}".`, type: 'alphabet' }); }
    else alphaSeen.add(sym);
  }

  // ── Warnings ───────────────────────────────────────────────
  // Unreachable states
  const unreachable = findUnreachable(moore);
  for (const s of unreachable) {
    warnings.push({ msg: `State "${s}" is unreachable from the initial state.`, type: 'unreachable', ref: s });
  }

  // Unused output symbols
  const usedOutputs = new Set(Object.values(moore.outputs || {}));
  for (const o of (moore.outputAlphabet || [])) {
    if (!usedOutputs.has(o)) {
      warnings.push({ msg: `Output symbol "${o}" is defined in Δ but not used by any state.`, type: 'unused-output' });
    }
  }

  return { errors, warnings };
}

/**
 * Find all unreachable states via BFS from initialState.
 */
function findUnreachable(moore) {
  if (!moore.initialState || !moore.states || moore.states.length === 0) return [];
  const visited = new Set([moore.initialState]);
  const queue   = [moore.initialState];
  while (queue.length > 0) {
    const cur = queue.shift();
    for (const sym of (moore.inputAlphabet || [])) {
      const next = moore.transitions && moore.transitions[cur] && moore.transitions[cur][sym];
      if (next && !visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  return moore.states.filter(s => !visited.has(s));
}

// ─────────────────────────────────────────────────────────────
// 4. RANDOM MACHINE GENERATOR
// ─────────────────────────────────────────────────────────────

/**
 * Generate a random complete Moore machine.
 * @param {{ states: number, alphabetSize: number, outputSize: number }} cfg
 */
function generateRandom(cfg) {
  const n = Math.max(2, Math.min(cfg.states || 4, 8));
  const a = Math.max(1, Math.min(cfg.alphabetSize || 2, 3));
  const o = Math.max(2, Math.min(cfg.outputSize || 2, 4));

  const states        = Array.from({length: n}, (_, i) => `q${i}`);
  const inputAlphabet = Array.from({length: a}, (_, i) => String.fromCharCode(48 + i)); // '0','1','2'
  const outputAlphabet= Array.from({length: o}, (_, i) => String(i));

  const outputs     = {};
  const transitions = {};
  states.forEach(s => {
    outputs[s] = outputAlphabet[Math.floor(Math.random() * o)];
    transitions[s] = {};
    inputAlphabet.forEach(sym => { transitions[s][sym] = states[Math.floor(Math.random() * n)]; });
  });

  return { states, inputAlphabet, outputAlphabet, initialState: 'q0', outputs, transitions };
}

// ─────────────────────────────────────────────────────────────
// 5. TEXT PARSER / SERIALIZER
// ─────────────────────────────────────────────────────────────

/**
 * Parse a Moore machine from the text format:
 *
 *   States: A,B,C
 *   Alphabet: 0,1
 *   Outputs: 0,1
 *   Initial: A
 *   StateOutputs:
 *     A -> 0
 *     B -> 1
 *     C -> 0
 *   Transitions:
 *     A,0 -> A
 *     A,1 -> B
 *
 * Returns { machine, errors[] } where errors have { line, msg }
 */
function parseMooreText(text) {
  const lines    = text.split('\n');
  const errors   = [];
  const machine  = {
    states: [], inputAlphabet: [], outputAlphabet: [],
    initialState: null, outputs: {}, transitions: {}
  };

  let section = null;

  for (let i = 0; i < lines.length; i++) {
    const lineNum  = i + 1;
    let   raw      = lines[i];
    // Strip comments
    const hashIdx  = raw.indexOf('#');
    if (hashIdx >= 0) raw = raw.slice(0, hashIdx);
    const line = raw.trim();
    if (!line) continue;

    // Section headers (case-insensitive)
    const lower = line.toLowerCase();
    if (lower.startsWith('states:')) {
      section = 'states';
      const rest = line.slice(7).trim();
      if (rest) machine.states = rest.split(',').map(s => s.trim()).filter(Boolean);
      continue;
    }
    if (lower.startsWith('alphabet:') || lower.startsWith('input:') || lower.startsWith('inputalphabet:')) {
      section = 'alphabet';
      const rest = line.slice(lower.indexOf(':') + 1).trim();
      if (rest) machine.inputAlphabet = rest.split(',').map(s => s.trim()).filter(Boolean);
      continue;
    }
    if (lower.startsWith('outputs:') || lower.startsWith('outputalphabet:')) {
      section = 'outputAlphabet';
      const rest = line.slice(lower.indexOf(':') + 1).trim();
      if (rest) machine.outputAlphabet = rest.split(',').map(s => s.trim()).filter(Boolean);
      continue;
    }
    if (lower.startsWith('initial:') || lower.startsWith('initialstate:')) {
      const rest = line.slice(lower.indexOf(':') + 1).trim();
      machine.initialState = rest || null;
      section = null;
      continue;
    }
    if (lower.startsWith('stateoutputs:')) { section = 'stateOutputs'; continue; }
    if (lower.startsWith('transitions:'))  { section = 'transitions';   continue; }

    // Section content
    if (section === 'stateOutputs') {
      // Expect: StateName -> OutputSymbol
      const match = line.match(/^([^\s->]+)\s*->\s*(.+)$/);
      if (!match) { errors.push({ line: lineNum, msg: `Cannot parse state output: "${line}". Expected format: StateName -> Output` }); continue; }
      machine.outputs[match[1].trim()] = match[2].trim();
      continue;
    }
    if (section === 'transitions') {
      // Expect: State,Symbol -> NextState
      const match = line.match(/^([^\s,]+)\s*,\s*([^\s->]+)\s*->\s*([^\s]+)$/);
      if (!match) { errors.push({ line: lineNum, msg: `Cannot parse transition: "${line}". Expected format: State,Symbol -> NextState` }); continue; }
      const [, from, sym, to] = match.map(s => s.trim());
      if (!machine.transitions[from]) machine.transitions[from] = {};
      if (machine.transitions[from][sym]) {
        errors.push({ line: lineNum, msg: `Duplicate transition for (${from}, ${sym}) — nondeterminism detected.` });
      }
      machine.transitions[from][sym] = to;
      continue;
    }
  }

  return { machine, errors };
}

/**
 * Serialize a Moore machine back to text format.
 */
function serializeMoore(moore) {
  const lines = [];
  lines.push(`States: ${moore.states.join(', ')}`);
  lines.push(`Alphabet: ${moore.inputAlphabet.join(', ')}`);
  lines.push(`Outputs: ${moore.outputAlphabet.join(', ')}`);
  lines.push(`Initial: ${moore.initialState || ''}`);
  lines.push('');
  lines.push('StateOutputs:');
  moore.states.forEach(s => { lines.push(`  ${s} -> ${moore.outputs[s] || ''}`); });
  lines.push('');
  lines.push('Transitions:');
  moore.states.forEach(s => {
    moore.inputAlphabet.forEach(sym => {
      const next = moore.transitions[s] && moore.transitions[s][sym];
      if (next) lines.push(`  ${s},${sym} -> ${next}`);
    });
  });
  return lines.join('\n');
}
