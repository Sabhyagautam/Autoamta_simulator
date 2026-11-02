/**
 * mooreExamples.js
 * Pre-built Moore machine configurations for the simulator.
 */

const MOORE_EXAMPLES = [
  {
    id: 'parity',
    title: 'Parity Checker',
    description: 'Outputs 0 if the number of 1s seen so far is even, 1 if odd.',
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
  {
    id: 'mod3',
    title: 'Mod-3 Counter',
    description: 'Outputs the remainder when the count of 1s is divided by 3.',
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
  {
    id: 'sequence-detector',
    title: 'Sequence Detector (ends in 1)',
    description: 'Outputs "a" while not at end of a matching sequence, "b" when the last symbol is 1.',
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
  {
    id: 'three-state',
    title: 'Three-State Moore Machine',
    description: 'A general 3-state example demonstrating the conversion with all transitions defined.',
    states: ['A', 'B', 'C'],
    inputAlphabet: ['0', '1'],
    outputAlphabet: ['x', 'y', 'z'],
    initialState: 'A',
    outputs: { A: 'x', B: 'y', C: 'z' },
    transitions: {
      A: { '0': 'B', '1': 'C' },
      B: { '0': 'A', '1': 'C' },
      C: { '0': 'B', '1': 'A' }
    }
  }
];
