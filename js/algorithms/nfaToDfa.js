/**
 * nfaToDfa.js
 * Implements the Subset Construction Algorithm to convert an NFA to a DFA.
 *
 * This is a pure function — no DOM access, no side effects.
 * The same input always produces the same output.
 *
 * Algorithm Reference:
 *   Hopcroft, Motwani & Ullman — "Introduction to Automata Theory" §2.3
 */

/**
 * Run the subset construction algorithm.
 *
 * @param {Object} nfa
 * @param {string[]} nfa.states
 * @param {string[]} nfa.alphabet
 * @param {string}   nfa.initialState
 * @param {string[]} nfa.finalStates
 * @param {Object}   nfa.transitions   { state: { symbol: [states] } }
 *
 * @returns {{
 *   dfa: {
 *     states: string[],
 *     alphabet: string[],
 *     initialState: string,
 *     finalStates: string[],
 *     transitions: Object,
 *     deadState: string|null
 *   },
 *   steps: SimulationStep[],
 *   initialLabel: string
 * }}
 */
function subsetConstruction(nfa) {
  // ── helpers ────────────────────────────────────────────────────────────────

  /** Canonical label for a set of NFA states */
  function label(stateArr) {
    if (!stateArr || stateArr.length === 0) return '∅';
    return '{' + [...new Set(stateArr)].sort().join(',') + '}';
  }

  /** Get NFA transitions for (state, symbol). Returns [] if not defined. */
  function delta(state, symbol) {
    return (nfa.transitions[state] && nfa.transitions[state][symbol]) || [];
  }

  /** Compute δ*(subsetArr, symbol) = union of δ(q, symbol) for q in subsetArr */
  function deltastar(subsetArr, symbol) {
    const result = new Set();
    const nfaTransitionsExamined = [];
    for (const state of subsetArr) {
      const targets = delta(state, symbol);
      nfaTransitionsExamined.push({ from: state, symbol, to: [...targets] });
      for (const t of targets) result.add(t);
    }
    return {
      result: [...result].sort(),
      nfaTransitionsExamined
    };
  }

  // ── algorithm ──────────────────────────────────────────────────────────────

  const DEAD = '∅';
  const initialSet = [nfa.initialState];
  const initialLabel = label(initialSet);

  // DFA data structures
  const dfaStatesMap = {};          // label → string[] (NFA state set)
  const dfaTransitions = {};        // { label: { symbol: label } }
  const dfaFinalStates = [];
  const steps = [];                 // SimulationStep[]

  let needsDeadState = false;

  // BFS queue
  const queue = [initialSet];
  const visited = new Set();

  let stepIndex = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    const currentLabel = label(current);

    if (visited.has(currentLabel)) continue;
    visited.add(currentLabel);

    dfaStatesMap[currentLabel] = current;
    dfaTransitions[currentLabel] = {};

    // Is this a DFA accepting state?
    const isAccepting = current.some(s => nfa.finalStates.includes(s));
    if (isAccepting) dfaFinalStates.push(currentLabel);

    // Process each alphabet symbol
    for (const symbol of nfa.alphabet) {
      const { result: reachable, nfaTransitionsExamined } = deltastar(current, symbol);
      const resultLabel = label(reachable);

      const isNewState = reachable.length > 0 && !visited.has(resultLabel);
      const isDeadTransition = reachable.length === 0;

      if (isDeadTransition) {
        needsDeadState = true;
        dfaTransitions[currentLabel][symbol] = DEAD;
      } else {
        dfaTransitions[currentLabel][symbol] = resultLabel;
        if (isNewState) {
          queue.push(reachable);
        }
      }

      // Build human-readable description for this step
      const description = buildStepDescription(
        currentLabel, symbol, nfaTransitionsExamined,
        resultLabel, isNewState, isDeadTransition
      );

      steps.push({
        stepIndex: stepIndex++,
        currentSubset: currentLabel,
        symbol,
        nfaTransitionsExamined,
        resultingSubset: resultLabel,
        isNewState: isNewState || isDeadTransition,
        isAccepting: !isDeadTransition && reachable.some(s => nfa.finalStates.includes(s)),
        dfaTransitionAdded: { from: currentLabel, symbol, to: resultLabel },
        queue: [...queue].map(s => label(s)),
        description
      });
    }
  }

  // Add dead state transitions if needed
  if (needsDeadState) {
    dfaStatesMap[DEAD] = [];
    dfaTransitions[DEAD] = {};
    for (const symbol of nfa.alphabet) {
      dfaTransitions[DEAD][symbol] = DEAD;
    }
  }

  const dfaStates = Object.keys(dfaStatesMap);

  return {
    dfa: {
      states: dfaStates,
      alphabet: nfa.alphabet,
      initialState: initialLabel,
      finalStates: dfaFinalStates,
      transitions: dfaTransitions,
      deadState: needsDeadState ? DEAD : null
    },
    steps,
    initialLabel
  };
}

/**
 * Build a human-readable explanation for one algorithm step.
 */
function buildStepDescription(currentLabel, symbol, examined, resultLabel, isNew, isDead) {
  const transStr = examined
    .map(t => t.to.length > 0
      ? `δ(${t.from}, ${t.symbol}) = {${t.to.join(', ')}}`
      : `δ(${t.from}, ${t.symbol}) = ∅`)
    .join('; ');

  let desc = `Processing DFA state ${currentLabel} on input symbol "${symbol}". `;
  desc += `Examining NFA transitions: ${transStr}. `;
  desc += `Union of reachable states = ${resultLabel}. `;

  if (isDead) {
    desc += `No NFA states are reachable — this leads to the dead/trap state ∅.`;
  } else if (isNew) {
    desc += `${resultLabel} is a NEW DFA state — added to the processing queue.`;
  } else {
    desc += `${resultLabel} was already discovered — no new state added.`;
  }

  return desc;
}

/**
 * Test a string against a DFA produced by subsetConstruction.
 *
 * @param {Object} dfa   Result of subsetConstruction().dfa
 * @param {string} inputString
 * @returns {{
 *   inputString: string,
 *   accepted: boolean,
 *   stateTrace: string[],
 *   transitionHistory: {char: string, fromState: string, toState: string}[],
 *   errorSymbol: string|null,
 *   verdict: string
 * }}
 */
function testStringOnDFA(dfa, inputString) {
  const alphabetSet = new Set(dfa.alphabet);
  const stateTrace = [dfa.initialState];
  const transitionHistory = [];
  let current = dfa.initialState;

  // Empty string — just check if initial state is accepting
  if (inputString === '') {
    const accepted = dfa.finalStates.includes(current);
    return {
      inputString: 'ε (empty)',
      accepted,
      stateTrace,
      transitionHistory,
      errorSymbol: null,
      verdict: accepted ? 'ACCEPTED' : 'REJECTED'
    };
  }

  for (let i = 0; i < inputString.length; i++) {
    const char = inputString[i];

    // Invalid symbol
    if (!alphabetSet.has(char)) {
      return {
        inputString,
        accepted: false,
        stateTrace,
        transitionHistory,
        errorSymbol: char,
        verdict: 'ERROR',
        errorMessage: `Symbol "${char}" is not in the alphabet Σ = {${dfa.alphabet.join(', ')}}.`
      };
    }

    const next = dfa.transitions[current] && dfa.transitions[current][char];

    // Dead/missing transition
    if (!next) {
      return {
        inputString,
        accepted: false,
        stateTrace,
        transitionHistory,
        errorSymbol: null,
        verdict: 'REJECTED',
        errorMessage: `No transition from ${current} on "${char}".`
      };
    }

    transitionHistory.push({ char, fromState: current, toState: next, position: i });
    current = next;
    stateTrace.push(current);

    // Landed on dead state — can stop early
    if (dfa.deadState && current === dfa.deadState) {
      // consume remaining but we know it's rejected
      for (let j = i + 1; j < inputString.length; j++) {
        const c = inputString[j];
        if (!alphabetSet.has(c)) {
          return {
            inputString,
            accepted: false,
            stateTrace,
            transitionHistory,
            errorSymbol: c,
            verdict: 'ERROR',
            errorMessage: `Symbol "${c}" is not in the alphabet.`
          };
        }
        transitionHistory.push({ char: c, fromState: current, toState: dfa.deadState, position: j });
        stateTrace.push(dfa.deadState);
      }
      return {
        inputString,
        accepted: false,
        stateTrace,
        transitionHistory,
        errorSymbol: null,
        verdict: 'REJECTED'
      };
    }
  }

  const accepted = dfa.finalStates.includes(current);
  return {
    inputString,
    accepted,
    stateTrace,
    transitionHistory,
    errorSymbol: null,
    verdict: accepted ? 'ACCEPTED' : 'REJECTED'
  };
}
