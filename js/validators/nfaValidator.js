/**
 * nfaValidator.js
 * Validates a user-supplied NFA configuration before running the algorithm.
 * Returns a list of human-readable error messages.
 */

/**
 * @param {Object} nfa
 * @param {string[]} nfa.states
 * @param {string[]} nfa.alphabet
 * @param {string}   nfa.initialState
 * @param {string[]} nfa.finalStates
 * @param {Object}   nfa.transitions  { state: { symbol: [states] } }
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateNFA(nfa) {
  const errors = [];

  // States
  if (!nfa.states || nfa.states.length === 0) {
    errors.push('At least one state is required.');
  } else {
    const seen = new Set();
    for (const s of nfa.states) {
      if (!s || s.trim() === '') {
        errors.push('State names cannot be empty.');
      } else if (seen.has(s.trim())) {
        errors.push(`Duplicate state name: "${s}".`);
      } else {
        seen.add(s.trim());
      }
    }
  }

  // Alphabet
  if (!nfa.alphabet || nfa.alphabet.length === 0) {
    errors.push('The input alphabet cannot be empty.');
  } else {
    const seen = new Set();
    for (const sym of nfa.alphabet) {
      if (!sym || sym.trim() === '') {
        errors.push('Alphabet symbols cannot be empty.');
      } else if (seen.has(sym.trim())) {
        errors.push(`Duplicate alphabet symbol: "${sym}".`);
      } else {
        seen.add(sym.trim());
      }
    }
  }

  const stateSet = new Set((nfa.states || []).map(s => s.trim()));

  // Initial state
  if (!nfa.initialState || nfa.initialState.trim() === '') {
    errors.push('An initial state must be selected.');
  } else if (!stateSet.has(nfa.initialState.trim())) {
    errors.push(`Initial state "${nfa.initialState}" is not in the state set.`);
  }

  // Final states
  if (!nfa.finalStates || nfa.finalStates.length === 0) {
    errors.push('At least one final (accepting) state is required.');
  } else {
    for (const f of nfa.finalStates) {
      if (!stateSet.has(f.trim())) {
        errors.push(`Final state "${f}" is not in the state set.`);
      }
    }
  }

  // Transitions
  const alphabetSet = new Set((nfa.alphabet || []).map(s => s.trim()));
  if (nfa.transitions) {
    for (const [fromState, symMap] of Object.entries(nfa.transitions)) {
      if (!stateSet.has(fromState)) {
        errors.push(`Transition source "${fromState}" is not in the state set.`);
        continue;
      }
      for (const [symbol, targets] of Object.entries(symMap)) {
        if (!alphabetSet.has(symbol)) {
          errors.push(`Transition symbol "${symbol}" from state "${fromState}" is not in the alphabet.`);
        }
        if (Array.isArray(targets)) {
          for (const t of targets) {
            if (t && !stateSet.has(t.trim())) {
              errors.push(`Transition target "${t}" (from ${fromState} on ${symbol}) is not in the state set.`);
            }
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
