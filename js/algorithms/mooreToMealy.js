/**
 * mooreToMealy.js
 * Converts a Moore machine to an equivalent Mealy machine.
 * Pure function — no DOM, no side effects.
 *
 * Rule: for every transition δ(q, a) = p in the Moore machine,
 *       the Mealy output on that edge is λ(p) — the output of the DESTINATION state.
 */

/**
 * @typedef {Object} MooreMachine
 * @property {string[]} states
 * @property {string[]} inputAlphabet
 * @property {string[]} outputAlphabet
 * @property {string}   initialState
 * @property {Object}   transitions   { state: { symbol: nextState } }
 * @property {Object}   outputs       { state: outputSymbol }  (λ: Q → Δ)
 */

/**
 * @typedef {Object} ConversionStep
 * @property {string} fromState
 * @property {string} symbol
 * @property {string} nextState
 * @property {string} mooreOutput     - λ(nextState)
 * @property {string} description
 */

/**
 * Convert a Moore machine to a Mealy machine.
 * @param {MooreMachine} moore
 * @returns {{ mealy: Object, steps: ConversionStep[], note: string }}
 */
function mooreToMealy(moore) {
  const steps = [];
  const mealyTransitions = {};

  for (const state of moore.states) {
    mealyTransitions[state] = {};

    for (const symbol of moore.inputAlphabet) {
      const nextState = (moore.transitions[state] && moore.transitions[state][symbol]) || null;

      if (nextState === null) {
        steps.push({
          fromState: state,
          symbol,
          nextState: null,
          mooreOutput: null,
          description: `δ(${state}, ${symbol}) is undefined — no Mealy edge created.`
        });
        continue;
      }

      // Core rule: output = λ(destination state)
      const mooreOutput = moore.outputs[nextState] !== undefined
        ? String(moore.outputs[nextState])
        : '?';

      mealyTransitions[state][symbol] = { nextState, output: mooreOutput };

      steps.push({
        fromState: state,
        symbol,
        nextState,
        mooreOutput,
        description:
          `δ(${state}, ${symbol}) = ${nextState}.  ` +
          `Moore output of destination: λ(${nextState}) = "${mooreOutput}".  ` +
          `→ Mealy edge: (${state}) —${symbol}/${mooreOutput}→ (${nextState}).`
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
    note: `The Moore output of the initial state λ(${moore.initialState}) = "${moore.outputs[moore.initialState]}" has no Mealy equivalent and is not carried over (Mealy machines only output on transitions).`
  };
}

/**
 * Simulate the resulting Mealy machine on an input string.
 * @param {Object} mealy  - result of mooreToMealy().mealy
 * @param {string} input
 * @returns {{ input, outputString, trace, error }}
 */
function simulateMealy(mealy, input) {
  const alphabetSet = new Set(mealy.inputAlphabet);
  let current = mealy.initialState;
  let outputString = '';
  const trace = [];

  if (input === '') {
    return {
      input: 'ε (empty)',
      outputString: '',
      trace: [],
      error: 'Mealy machines produce no output on empty input.'
    };
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (!alphabetSet.has(char)) {
      return {
        input, outputString, trace,
        error: `Symbol "${char}" at position ${i + 1} is not in the input alphabet {${mealy.inputAlphabet.join(', ')}}.`
      };
    }

    const t = mealy.transitions[current] && mealy.transitions[current][char];
    if (!t) {
      return {
        input, outputString, trace,
        error: `No transition defined from state "${current}" on symbol "${char}".`
      };
    }

    trace.push({
      position: i,
      char,
      fromState: current,
      toState: t.nextState,
      output: t.output
    });

    outputString += t.output;
    current = t.nextState;
  }

  return { input, outputString, trace, error: null, finalState: current };
}
