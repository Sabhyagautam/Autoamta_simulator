/**
 * stateSetUtils.js
 * Utility functions for working with sets of NFA states.
 * These are the building blocks of the subset construction algorithm.
 */

/**
 * Produce a canonical, human-readable label for a set of NFA states.
 * The states are sorted alphabetically so {q1,q0} and {q0,q1} always
 * produce the same label: "{q0,q1}".
 * @param {string[]} stateArray
 * @returns {string}
 */
function canonicalLabel(stateArray) {
  if (!stateArray || stateArray.length === 0) return '∅';
  const sorted = [...new Set(stateArray)].sort();
  return '{' + sorted.join(',') + '}';
}

/**
 * Check whether two state arrays represent the same set.
 * @param {string[]} a
 * @param {string[]} b
 * @returns {boolean}
 */
function setsEqual(a, b) {
  return canonicalLabel(a) === canonicalLabel(b);
}

/**
 * Union of multiple state arrays, deduplicated.
 * @param {string[][]} arrays
 * @returns {string[]}
 */
function setUnion(arrays) {
  const result = new Set();
  for (const arr of arrays) {
    for (const s of arr) result.add(s);
  }
  return Array.from(result).sort();
}

/**
 * Parse a canonical label like "{q0,q1}" back into ["q0","q1"].
 * Returns [] for the dead-state label "∅".
 * @param {string} label
 * @returns {string[]}
 */
function parseLabelToSet(label) {
  if (label === '∅' || !label) return [];
  const inner = label.replace(/[{}]/g, '');
  return inner.split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Check if any element of setA is in setB.
 * @param {string[]} setA
 * @param {string[]} setB
 * @returns {boolean}
 */
function setsIntersect(setA, setB) {
  const bSet = new Set(setB);
  return setA.some(s => bSet.has(s));
}
