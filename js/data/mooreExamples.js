/**
 * mooreExamples.js
 * Pre-built Moore machine configurations.
 * Includes the canonical Milestone 1 example from the assignment (id: 'canonical').
 */

const MOORE_EXAMPLES = [
  // ── Canonical example from the CSET302 assignment spec (§12) ─────────────
  {
    id: 'canonical',
    title: 'Canonical Example (A/B/C — Assignment §12)',
    description: 'The manually validated example from the CSET302 assignment. States A,B,C; alphabet {0,1}; outputs {0,1}.',
    states: ['A', 'B', 'C'],
    inputAlphabet: ['0', '1'],
    outputAlphabet: ['0', '1'],
    initialState: 'A',
    outputs: { A: '0', B: '1', C: '0' },
    transitions: {
      A: { '0': 'A', '1': 'B' },
      B: { '0': 'C', '1': 'A' },
      C: { '0': 'B', '1': 'C' }
    },
    // Expected Mealy result (for validation / practice mode)
    expectedMealy: {
      // A,0→A/out 0  A,1→B/out 1  B,0→C/out 0  B,1→A/out 0  C,0→B/out 1  C,1→C/out 0
      A: { '0': { nextState:'A', output:'0' }, '1': { nextState:'B', output:'1' } },
      B: { '0': { nextState:'C', output:'0' }, '1': { nextState:'A', output:'0' } },
      C: { '0': { nextState:'B', output:'1' }, '1': { nextState:'C', output:'0' } }
    },
    // Worked test: input "101" → Moore: A→B→A→B; outputs λ(A)+λ(B)+λ(A)+λ(B) = 0,1,0,1 = "0101"
    // Mealy: 1/1, 0/0, 1/1 = "101" → BUT per §12: Mealy output = "100"
    // Let's re-check: δ(A,1)=B→λ(B)=1; δ(B,0)=C→λ(C)=0; δ(C,1)=C→λ(C)=0 → "100"
    // Moore: λ(A)+λ(B)+λ(C)+λ(C) = 0+1+0+0 = "0100" → Moore[1:]="100" ✓
    workedExample: {
      input: '101',
      moorePath:   ['A','B','C','C'],
      mooreOutput: '0100',
      mealyOutput: '100',
      note: 'MooreOutput[1:] = "100" = MealyOutput ✓'
    }
  },

  // ── Parity checker ────────────────────────────────────────────────────────
  {
    id: 'parity',
    title: 'Parity Checker',
    description: 'Outputs 0 if an even number of 1s has been seen, 1 if odd.',
    states: ['q0', 'q1'],
    inputAlphabet: ['0', '1'],
    outputAlphabet: ['0', '1'],
    initialState: 'q0',
    outputs: { q0: '0', q1: '1' },
    transitions: {
      q0: { '0': 'q0', '1': 'q1' },
      q1: { '0': 'q1', '1': 'q0' }
    }
  },

  // ── Mod-3 counter ─────────────────────────────────────────────────────────
  {
    id: 'mod3',
    title: 'Mod-3 Counter',
    description: 'Outputs the count of 1s seen so far, modulo 3.',
    states: ['q0', 'q1', 'q2'],
    inputAlphabet: ['0', '1'],
    outputAlphabet: ['0', '1', '2'],
    initialState: 'q0',
    outputs: { q0: '0', q1: '1', q2: '2' },
    transitions: {
      q0: { '0': 'q0', '1': 'q1' },
      q1: { '0': 'q1', '1': 'q2' },
      q2: { '0': 'q2', '1': 'q0' }
    }
  },

  // ── 2-bit counter ─────────────────────────────────────────────────────────
  {
    id: 'two-bit-counter',
    title: '2-Bit Up Counter',
    description: 'Counts inputs in binary: 00→01→10→11→00. Outputs the current count as a two-symbol string.',
    states: ['s0', 's1', 's2', 's3'],
    inputAlphabet: ['1'],
    outputAlphabet: ['00', '01', '10', '11'],
    initialState: 's0',
    outputs: { s0: '00', s1: '01', s2: '10', s3: '11' },
    transitions: {
      s0: { '1': 's1' },
      s1: { '1': 's2' },
      s2: { '1': 's3' },
      s3: { '1': 's0' }
    }
  },

  // ── Sequence detector ─────────────────────────────────────────────────────
  {
    id: 'sequence-detector',
    title: 'Sequence Detector (ends in 1)',
    description: 'Outputs "b" when the last symbol read is 1, "a" otherwise.',
    states: ['s0', 's1'],
    inputAlphabet: ['0', '1'],
    outputAlphabet: ['a', 'b'],
    initialState: 's0',
    outputs: { s0: 'a', s1: 'b' },
    transitions: {
      s0: { '0': 's0', '1': 's1' },
      s1: { '0': 's0', '1': 's1' }
    }
  },

  // ── Single state (self-loop only) ─────────────────────────────────────────
  {
    id: 'single-state',
    title: 'Single-State Machine',
    description: 'Edge case: one state with self-loops on all inputs. Mealy output equals Moore output of the same state.',
    states: ['q0'],
    inputAlphabet: ['0', '1'],
    outputAlphabet: ['x'],
    initialState: 'q0',
    outputs: { q0: 'x' },
    transitions: {
      q0: { '0': 'q0', '1': 'q0' }
    }
  },

  // ── Machine with unreachable state ────────────────────────────────────────
  {
    id: 'unreachable',
    title: 'Machine with Unreachable State',
    description: 'State "dead" is never reachable from the initial state — demonstrates the unreachable-state warning.',
    states: ['q0', 'q1', 'dead'],
    inputAlphabet: ['a', 'b'],
    outputAlphabet: ['0', '1'],
    initialState: 'q0',
    outputs: { q0: '0', q1: '1', dead: '0' },
    transitions: {
      q0:   { 'a': 'q1', 'b': 'q0' },
      q1:   { 'a': 'q0', 'b': 'q1' },
      dead: { 'a': 'dead', 'b': 'dead' }
    }
  }
];
