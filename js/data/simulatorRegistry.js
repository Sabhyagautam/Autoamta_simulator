/**
 * simulatorRegistry.js
 * Central registry of all 15 automata simulator modules.
 * The UI reads this array to render dashboard cards and navigation.
 */

const SIMULATORS = [
  {
    id: 'nfa-to-dfa',
    title: 'NFA → DFA Conversion',
    description: 'Convert a Non-deterministic Finite Automaton to a Deterministic Finite Automaton using the Subset Construction algorithm.',
    status: 'active',
    icon: '⇌',
    difficulty: 'Intermediate',
    topic: 'Finite Automata',
    page: 'simulator.html'
  },
  {
    id: 'epsilon-nfa',
    title: 'ε-NFA → DFA Conversion',
    description: 'Extend subset construction to handle epsilon transitions by first computing ε-closures.',
    status: 'coming-soon',
    icon: 'ε',
    difficulty: 'Intermediate',
    topic: 'Finite Automata',
    page: null
  },
  {
    id: 'dfa-minimization',
    title: 'DFA Minimization',
    description: 'Reduce a DFA to its minimal equivalent using the table-filling (Myhill-Nerode) algorithm.',
    status: 'coming-soon',
    icon: '⊏',
    difficulty: 'Intermediate',
    topic: 'Finite Automata',
    page: null
  },
  {
    id: 'regex-to-nfa',
    title: 'Regex → NFA (Thompson)',
    description: 'Convert a regular expression to an NFA using Thompson\'s construction.',
    status: 'coming-soon',
    icon: '.*',
    difficulty: 'Advanced',
    topic: 'Regular Languages',
    page: null
  },
  {
    id: 'fa-to-regex',
    title: 'FA → Regular Expression',
    description: 'Derive the regular expression for a finite automaton using state elimination.',
    status: 'coming-soon',
    icon: '→R',
    difficulty: 'Advanced',
    topic: 'Regular Languages',
    page: null
  },
  {
    id: 'ardens-theorem',
    title: "Arden's Theorem",
    description: 'Solve sets of linear equations over regular languages to find the language of an automaton.',
    status: 'coming-soon',
    icon: 'A=',
    difficulty: 'Advanced',
    topic: 'Regular Languages',
    page: null
  },
  {
    id: 'string-processing',
    title: 'DFA / NFA String Processing',
    description: 'Simulate any DFA or NFA on an input string, tracing the path of execution step by step.',
    status: 'coming-soon',
    icon: '▶',
    difficulty: 'Beginner',
    topic: 'Finite Automata',
    page: null
  },
  {
    id: 'pumping-lemma',
    title: 'Pumping Lemma',
    description: 'Interactively apply the pumping lemma for regular languages to prove non-regularity.',
    status: 'coming-soon',
    icon: '⤻',
    difficulty: 'Advanced',
    topic: 'Regular Languages',
    page: null
  },
  {
    id: 'cfg-derivation',
    title: 'CFG Derivation & Parse Tree',
    description: 'Enter a context-free grammar and derive strings with an animated parse tree.',
    status: 'coming-soon',
    icon: '⊢',
    difficulty: 'Intermediate',
    topic: 'Context-Free Languages',
    page: null
  },
  {
    id: 'cfg-ambiguity',
    title: 'CFG Ambiguity',
    description: 'Visualize multiple parse trees for a string to detect grammar ambiguity.',
    status: 'coming-soon',
    icon: '⎇',
    difficulty: 'Intermediate',
    topic: 'Context-Free Languages',
    page: null
  },
  {
    id: 'cfg-to-cnf',
    title: 'CFG → Chomsky Normal Form',
    description: 'Transform any CFG into Chomsky Normal Form through a step-by-step process.',
    status: 'coming-soon',
    icon: 'CNF',
    difficulty: 'Intermediate',
    topic: 'Context-Free Languages',
    page: null
  },
  {
    id: 'pushdown-automata',
    title: 'Pushdown Automata',
    description: 'Simulate a PDA on an input string with a visual stack trace.',
    status: 'coming-soon',
    icon: '⊞',
    difficulty: 'Advanced',
    topic: 'Context-Free Languages',
    page: null
  },
  {
    id: 'turing-machine',
    title: 'Turing Machine',
    description: 'Design and simulate Turing Machines with animated tape operations.',
    status: 'coming-soon',
    icon: '⊡',
    difficulty: 'Expert',
    topic: 'Computability',
    page: null
  },
  {
    id: 'moore-to-mealy',
    title: 'Moore → Mealy Conversion',
    description: 'Convert a Moore machine to an equivalent Mealy machine. Outputs move from states to transitions — step by step.',
    status: 'active',
    icon: '⇄',
    difficulty: 'Intermediate',
    topic: 'Finite Automata',
    page: 'moore-to-mealy.html'
  },
  {
    id: 'closure-operations',
    title: 'Regular Language Closures',
    description: 'Explore union, intersection, complement and concatenation on regular languages.',
    status: 'coming-soon',
    icon: '∪',
    difficulty: 'Intermediate',
    topic: 'Regular Languages',
    page: null
  }
];
