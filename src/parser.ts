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

export async function parse(tokens: Iterator<Token, Token>, startSymbol: string): Promise<ChalkModule> {
  const startState: Transition = parserTable[startSymbols.indexOf(startSymbol) ];
  
  let [ oldHeads, heads ]: Head[][] = [ [], [ new Head(null, null, startState) ] ];
  let token: Token = tokens.next().value;
  
  let ast: AstNode|null = null;
  
  while (heads.length > 0) {
    [ oldHeads, heads ] = [ heads, [] ];
    
    console.log(oldHeads);
    
    for (let head of oldHeads) {
      const actions = head.state[(token as Token).type];
      console.log("Actions: ", actions);
      if (!actions) continue;
      
      if (actions.shift) {
        if (actions.reduce.length === 0) {
          heads.push(new Head(token, head, parserTable[actions.shift]));
          
          token = tokens.next().value;
        } else heads.push(head.removeReduces());
      }
      
      for (let index of actions.reduce) {
        if (index === -1) {
          if (ast) throw new Error("Multiple parses of file.");
          
          ast = head.child;
          
          continue;
        }
        
        let prevNode = goBackN(head, chalkGrammar[index][1].length);
        
        heads.push(new Head(
          head,
          prevNode,
          parserTable[prevNode.state[chalkGrammar[index][0]].shift as number],
        ));
      }
    }
    
    await new Promise(f => setTimeout(f, 1000));
  }
  
  if (!ast) throw new Error("Cannot parse at "
    + (token ? token.row + ":" + token.col + "." : "end of file."));
  
  return ast as ChalkModule;
}
