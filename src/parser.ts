/*/
  A parser generator loosely based on LR parser.
/*/

import { Grammar, startSymbols, chalkGrammar } from "./grammar";
import { Token, EmptyToken } from "./tokenizer";
import { Transition } from "./parser-table-generator";
import { ChalkModule } from "./chalk-ir";

import * as parserTableU from "./parser-table.json";
const parserTable: Transition[] = parserTableU;

export class AstNode {
  constructor(
    public child: Token|AstNode|null,
    public prev: AstNode|null,
    public state: Transition
  ) {}
}

function goBackN(node: AstNode, n: number) {
  for (let i = 0; i < n; i++) node = node.prev as AstNode;
  
  return node;
}

export function parse(tokens: Iterator<Token, null>, startSymbol: string): ChalkModule {
  const startState: Transition = parserTable[startSymbols.indexOf(startSymbol) ];
  
  let astHeads: AstNode[] = [ new AstNode(null, null, startState) ];
  let token: Token|null = tokens.next().value;
  let ast: AstNode|null = null;
  
  while (astHeads.length > 0) {
    const oldHeads = astHeads;
    
    astHeads = [];
    
    for (let head of oldHeads) {
      const actions = head.state[(token as Token).type];
      
      if (!actions) continue;
      
      if (actions.shift) {
        if (actions.reduce.length === 0) {
          astHeads.push(new AstNode(token, head, parserTable[actions.shift]));
          
          token = tokens.next().value;
        }
        
        astHeads.push(head);
      }
      
      for (let index of actions.reduce) {
        if (index === -1) {
          if (ast) throw new Error("Multiple parses of file.");
          
          ast = head;
          
          continue;
        }
        
        let prevNode = goBackN(head, chalkGrammar[index][1].length);
        
        astHeads.push(new AstNode(head, prevNode, prevNode.state[chalkGrammar[index][0]]));
      }
    }
    
    if (astHeads.length === 0) {
      if (tops.length === 0) throw new Error("Cannot parse at "
      + (token ? token.row + ":" + token.col + "." : "end of file."));
      
      if (tops.length > 1)
    }
    
    break;
  }
}
