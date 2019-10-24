/*/
  A parser generator loosely based on LR parser.
/*/

import { Grammar } from "./grammar";
import { Token } from "./tokenizer";

type Actions = {
  reduce: number[],
  read: number[],
};

export class AstNode {
  prev: AstNode|null;
  child?: AstNode;
  
  constructor(child: AstNode|null, prev: AstNode|null) {
    this.child = child;
    this.prev = prev;
  }
}

class Head {
  node: AstNode;
  state: ParserState;
  
  getActions(token: Token): Actions {
    // TODO
  }
}

function goBackN(node: AstNode, n) {
  for (let i = 0; i < n; i++) node = node.prev;
  
  return node;
}

class ParserState {
  
}

class Parser {
  startStates: Map<string, ParserState>;
  
  constructor(jsonTable: string) {
    const table = JSON.parse(jsonTable).map(state => {
      const ret = { transitions: new Map() };
      
      Object.keys(state).forEach(key => ret.transitions.set(key, state[key]));
      
      return ret;
    });
    
    
  }
  
  parse(tokens: Iterator<Token>, startSymbol: string) {
    let astHeads = [];
    let token = tokens.next().value;
    
    while (token) {
      const heads = astHeads;
      
      astHeads = [];
      
      for (let head of heads) {
        for (let action of head.getActions(token)) {
          let prevNode = goBackN(head, action.take);
          
          new AstNode(head, prevNode)
        }
      }
    }
  }
}
