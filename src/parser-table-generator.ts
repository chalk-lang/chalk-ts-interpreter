/*/
  Creates tables for parser of Chalk.
/*/

import { promises } from "fs";

import { Grammar, Rule, isTerminal, chalkGrammar } from "./grammar";

type JsonObject = {
  [key: string]: {
    shift: number|null;
    reduce: number[];
  }
};

function setEquals<T>(a: Set<T>, b: Set<T>): boolean {
  return a.size === b.size && (() => {
    let f = true;
    
    a.forEach((a: T) => b.has(a) || (f = false));
    
    return f;
  })();
}

class Visited {
  constructor(public terminal: string, public prev: Visited|null) {}
  
  has(terminal: string): boolean {
    return this.terminal === terminal || !!this.prev && this.has(terminal);
  }
}

function first(grammar: Grammar, symbols: string[], visitedTerminals: Visited|null = null): Set<string> {
  if (symbols.length === 0) return new Set([ "" ]);
  if (isTerminal(symbols[0])) return new Set([ symbols[0] ]);
  if (visitedTerminals && visitedTerminals.has(symbols[0])) return new Set();
  
  return grammar.map(rule => {
    if (rule[0] == symbols[0]) {
      return first(grammar, rule[1].concat(symbols.slice(1)), new Visited(symbols[0], visitedTerminals));
    }
    
    return null;
    
  }).reduce((acc: Set<string>, a) => (a && a.forEach(b => acc.add(b)), acc), new Set());
}

class RuleAt {
  read: string|null;
  
  constructor(
    public rule: Rule,
    public dot: number,
    public context: Set<string>
  ) {
    this.read = rule[1][dot] || null;
  }
  
  move(): RuleAt { return new RuleAt(this.rule, this.dot + 1, this.context) }
  
  static equals(a: RuleAt, b: RuleAt): boolean {
    return a.rule === b.rule && a.dot === b.dot && setEquals(a.context, b.context);
  }
}

class Actions {
  shift: number|null = null;
  reduce: number[] = [];
  
  ruleAts: RuleAt[] = [];
}

class ParserState {
  transitions: Map<string, Actions> = new Map();
  ruleAts: RuleAt[];
  
  constructor(
    grammar: Grammar,
    ruleAts: RuleAt[],
  ) {
    this.ruleAts = ruleAts;
    
    this.addMissingRuleAts(grammar);
  }
  
  addMissingRuleAts(grammar: Grammar): void {
    for (let i = 0; i < this.ruleAts.length; i++) {
      const ruleAt = this.ruleAts[i];
      
      if (!ruleAt.read || isTerminal(ruleAt.read)) return;
      
      const context = first(grammar, ruleAt.rule[1].slice(ruleAt.dot + 1));
      
      if (context.has("")) {
        ruleAt.context.forEach(f => context.add(f));
        
        ruleAt.context.has("") || context.delete("");
      }
      
      grammar.forEach(r => {
        if (r[0] !== ruleAt.read) return;
        
        const missing = new RuleAt(r, 0, context);
        
        this.ruleAts.every(r => !RuleAt.equals(r, missing)) && this.ruleAts.push(missing);
      });
    }
  }
  
  getActions(symbol: string): Actions {
    const actions = this.transitions.get(symbol) || new Actions();
    
    this.transitions.set(symbol, actions);
    
    return actions;
  }
  
  addStates(grammar: Grammar, addState: (kernel: RuleAt[]) => number): void {
    for (let ruleAt of this.ruleAts) {
      if (ruleAt.read) {
        this.getActions(ruleAt.read).ruleAts.push(ruleAt.move());
      } else {
        ruleAt.context.forEach(symbol =>
          this.getActions(symbol).reduce.push(grammar.indexOf(ruleAt.rule)),
        );
      }
    }
    
    for (let actions of this.transitions.values()) {
      actions.shift = addState(actions.ruleAts);
    }
  }
  
  static equals(a: ParserState, b: ParserState): boolean {
    if (a.ruleAts.length !== b.ruleAts.length) return false;
    
    return a.ruleAts.every(a => b.ruleAts.some(b => RuleAt.equals(a, b)));
  }
  
  jsonObject(): JsonObject {
    const obj: JsonObject = {};
    
    for (let [ symbol, actions ] of this.transitions) {
      obj[symbol] = { shift: actions.shift, reduce: actions.reduce };
    }
    
    return obj;
  }
}

class Main {
  table: ParserState[];
  startTime: number;
  
  constructor() {
    console.log("Calculating parser tables.");
    
    this.startTime = Date.now();
    
    const startSymbols = [ "ChalkModule", "ChalkDocModule" ];
    
    this.table = startSymbols.map(startSymbol =>
      new ParserState(chalkGrammar, [ new RuleAt([ "", [ startSymbol ] ], 0, new Set([ "" ])) ]),
    );
    
    const addState = this.addState.bind(this);
    
    for (let i = 0; i < this.table.length; i++) {
      this.table[i].addStates(chalkGrammar, addState);
    }
    
    this.saveFile();
  }
  
  addState(ruleAts: RuleAt[]): number {
    const newState = new ParserState(chalkGrammar, ruleAts);
    const index = this.table.findIndex(state => ParserState.equals(state, newState));
    
    return index === -1 ? this.table.push(newState) - 1 : index;
  }
  
  async saveFile(): Promise<void> {
    const data = JSON.stringify(this.table.map(state => state.jsonObject()));
    
    promises.writeFile("./parser-table.json", data);
    
    console.log("Done: Calculating parser tables. Took " + (Date.now() - this.startTime) + "ms.");
  }
}

new Main();