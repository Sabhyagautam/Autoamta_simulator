/**
 * examples.js
 * Pre-built NFA configurations for demonstration purposes.
 * Each object matches the NFA model shape expected by subsetConstruction().
 */

const NFA_EXAMPLES = [
  {
    id: 'assignment',
    title: 'Assignment Example (Strings ending in 1)',
    description: 'The canonical NFA from the CSET302 assignment. Accepts binary strings where the second-to-last symbol is 1.',
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    initialState: 'q0',
    finalStates: ['q2'],
    transitions: {
      q0: { '0': ['q0'], '1': ['q0', 'q1'] },
      q1: { '0': ['q2'], '1': ['q2'] },
      q2: { '0': ['q2'], '1': ['q2'] }
    }
  },
  {
    id: 'ends-in-a',
    title: 'Strings ending in "a"',
    description: 'A simple NFA over {a, b} that accepts strings ending with the symbol "a".',
    states: ['q0', 'q1'],
    alphabet: ['a', 'b'],
    initialState: 'q0',
    finalStates: ['q1'],
    transitions: {
      q0: { 'a': ['q0', 'q1'], 'b': ['q0'] },
      q1: { 'a': [],            'b': []     }
    }
  },
  {
    id: 'contains-ab',
    title: 'Strings containing "ab"',
    description: 'NFA over {a, b} that accepts any string containing the substring "ab".',
    states: ['q0', 'q1', 'q2'],
    alphabet: ['a', 'b'],
    initialState: 'q0',
    finalStates: ['q2'],
    transitions: {
      q0: { 'a': ['q0', 'q1'], 'b': ['q0'] },
      q1: { 'a': [],            'b': ['q2'] },
      q2: { 'a': ['q2'],        'b': ['q2'] }
    }
  },
  {
    id: 'self-loop',
    title: 'Self-loop NFA',
    description: 'An NFA with self-loops. Accepts strings over {0,1} that contain at least one "1".',
    states: ['p', 'q'],
    alphabet: ['0', '1'],
    initialState: 'p',
    finalStates: ['q'],
    transitions: {
      p: { '0': ['p'], '1': ['p', 'q'] },
      q: { '0': ['q'], '1': ['q']      }
    }
  },
  {
    id: 'missing-transitions',
    title: 'NFA with missing transitions (dead state)',
    description: 'An NFA where some transitions are undefined, requiring a dead/trap state in the DFA.',
    states: ['s0', 's1', 's2'],
    alphabet: ['0', '1'],
    initialState: 's0',
    finalStates: ['s2'],
    transitions: {
      s0: { '0': ['s1'] },
      s1: { '1': ['s2'] },
      s2: {}
    }
  }
];
