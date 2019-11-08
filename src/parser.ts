/*/
  A parser generator loosely based on LR parser.
/*/

import { Grammar, startSymbols, chalkGrammar } from "./grammar";
import { Token, EmptyToken } from "./tokenizer";
import { Transition } from "./parser-table-generator";
import { ChalkModule, AstNode } from "./chalk-ir";

import * as parserTableU from "./parser-table.json";
const parserTable: Transition[] = parserTableU;

const emptyArr: never[] = [];

class Head {
  constructor(
    public child: AstNode|null,
    public prev: Head|null,
    public state: Transition
  ) {}
  
  actions(token: Token) { return this.state[token.type] }
  
  hasReduces(token: Token) {
    return this.state[token.type] && this.state[token.type].reduce.length > 0;
  }
  
  removeReduces(): Head {
    const transition: Transition = {};
    
    Object.keys(this.state).forEach(key => {
      transition[key] = { shift: this.state[key].shift, reduce: emptyArr };
    });
    
    return new Head(this.child, this.prev, transition);
  }
}

function goBackN(node: Head, n: number): Head {
  for (let i = 0; i < n; i++) node = node.prev as Head;
  
  return node;
}

export function parse(tokens: Iterator<Token, Token>, startSymbol: string): ChalkModule {
  const startState: Transition = parserTable[startSymbols.indexOf(startSymbol) ];
  
  let [ token, tokenNext ]: Token[] = [ tokens.next().value, tokens.next().value ];
  
  let [ heads, headsNext ]: Head[][] = [ [], [ new Head(null, null, startState) ] ];
  let [ doShift, doShiftNext ]: boolean[] = [ false, !headsNext[0].hasReduces(token) ];
  
  let ast: AstNode|null = null;
  
  while (headsNext.length > 0) {
    [ heads, headsNext ] = [ headsNext, [] ];
    [ doShift, doShiftNext ] = [ doShiftNext, true ];
    
    console.log("\nStart.");
    console.log("Tokens:");
    console.log(" ", token);
    console.log(" ", tokenNext);
    console.log("Heads: ", heads);
    
    for (let head of heads) {
      const actions = head.actions(token);
      console.log("Head actions: ", actions);
      if (!actions) continue;
      
      if (actions.shift) {
        if (doShift) {
          const newHead = new Head(token, head, parserTable[actions.shift]);
          
          newHead.hasReduces(tokenNext) && (doShiftNext = false);
          
          headsNext.push(newHead);
        } else headsNext.push(head.removeReduces());
      }
      
      for (let index of actions.reduce) {
        if (index === -1) {
          if (ast) throw new Error("Multiple parses of file.");
          
          ast = head.child;
          
          continue;
        }
        
        const prevNode = goBackN(head, chalkGrammar[index][1].length);
        
        const newHead = new Head(head, prevNode,
          parserTable[prevNode.state[chalkGrammar[index][0]].shift as number],
        );
        
        newHead.hasReduces(token) && (doShiftNext = false);
        
        headsNext.push(newHead);
      }
    }
    
    doShift && headsNext.length > 0
      && ([ token, tokenNext ] = [ tokenNext, tokens.next().value ]);
  }
  
  if (!ast) throw new Error("Cannot parse at "
    + (token ? token.row + ":" + token.col + "." : "end of file."));
  
  return ast as ChalkModule;
}
