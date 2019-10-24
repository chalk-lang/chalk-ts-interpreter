/*/
  Tokenizer for the Chalk programming language.
/*/

import { AstNode } from './parser.js';

const uppercaseTokens = [ "All", "Ex", "Exists" ];
const simpleSymbolArr =
  [ "comptime", "import", "ignore", "nowait", "switch", "class", "trait", "await",
    "type", "case", "mut", "let", "cst", "imt", "any", "<=>", "**=", "<->", "=>",
    "[]", "||", "&&", "==", "!=", "<=", ">=", "is", "++", "**", "+=", "-=", "*=",
    "/=", "%=", "<-", "->", ";", "=", "(", ")", "{", "}", "<", ">", "|", "&",
    "*", ".", ",", "?", ":", "%", "+", "-", "/", "!", "[", "]", ... uppercaseTokens,
  ];

type SimpleSymbol = typeof simpleSymbolArr[number];

interface SimpleToken extends AstNode {
  type: SimpleSymbol;
  row: number;
  col: number;
}

const namedSymbolArr =
  [ "break", "continue", "for", "return", "lIdentifier", "uIdentifier" ];

interface NamedToken extends AstNode {
  type: typeof namedSymbolArr[number];
  row: number;
  col: number;
  name: string;
}

interface StringToken extends AstNode {
  type: "string";
  row: number;
  col: number;
  value: string;
}

interface NumberToken extends AstNode {
  type: "number";
  row: number;
  col: number;
  value: number;
}

export type Token = SimpleToken|NamedToken|StringToken|NumberToken;

export function* tokenizer(str: string, isChalkDoc: boolean): IterableIterator<Token> {
  let rowCount = 0;
  let rowStart = 0;
  let i = 0;
  
  let chalkDocLevel = isChalkDoc ? -1 : 0;
  
  function newLine() {
    if (str[i] == "\n") {
      rowCount++;
      rowStart = i + 1;
    }
  }
  
  while (i < str.length) {
    if (str.substring(i, i + 3) == "}}}") {
      chalkDocLevel--;
      i += 3;
    }
    
    if (chalkDocLevel !== 0) {
      while (i < str.length) {
        while (i < str.length && (str[i] !== "{" || str[i] !== "}")) {
          newLine();
          
          i++;
        }
        
        (str.substring(i, i + 3) == "{{{" && (chalkDocLevel++, true)
          || str.substring(i, i + 3) == "}}}" && (chalkDocLevel--, true)) && (i += 3);
        
        if (chalkDocLevel == 0) break;
      }
    }
    
    if (str.substring(i, i + 3) == "///") {
      i += 3;
      
      while (i < str.length) {
        while (i < str.length && str[i] != "/") {
          newLine();
          
          i++;
        }
        
        if (str.substring(i, i + 3) == "///") {
          i += 3;
          
          break;
        }
      }

      continue;
    }
    
    let match;
    
    if (match = simpleSymbolArr.find(symbol => str.substring(i, i + symbol.length) == symbol)) {
      if (uppercaseTokens.includes(match)) match = "@" + match;
      
      yield { type: match, row: rowCount, col: i - rowStart, prev: null };
      
      i += match.length;
      
      continue;
    }
    
    if (match = namedSymbolArr.find(symbol => str.substring(i, i + symbol.length) == symbol)) {
      const col = i - rowStart;
      
      i += match.length;
      
      let name = "";
      
      if (str[i] == "-") {
        i++;
        
        const nameStart = i;
        
        if (str[i].match(/[a-zA-Z]/)) i++;
        while (str[i].match(/[a-zA-Z0-9]/)) i++;
        
        name = str.substring(nameStart, i);
      }
      
      yield { type: name, row: rowCount, col, prev: null, name };
      
      continue;
    }
    
    if (str.substring(i, i + 2) == "//") {
      i += 2;
      
      while (i < str.length && str[i] != "\n") i++;
      
      newLine();
      
      i++;
      
      continue;
    }
    
    if (str[i].match(/[a-zA-Z]/)) {
      const nameStart = i;
      const type = str[i].match(/[a-z]/) ? "lIdentifier" : "uIdentifier";
      
      i++;
      
      while (i < str.length && str[i].match(/[a-zA-Z0-9]/)) i++;
      
      yield { type, row: rowCount, col: i - rowStart, prev: null, name: str.substring(nameStart, i) };
      
      continue;
    }
    
    if (str[i].match(/\s/)) {
      newLine();
      
      i++;
      
      continue;
    }
    
    if (str[i] == '"') {
      i++;
      
      const strStart = i;
      
      let escaped = false;
      
      while (i < str.length && !escaped && str[i] != '"') {
        escaped = !escaped && str[i] == "\"";
        i++;
      }
      
      const value = str.substring(strStart, i);
      
      i++;
      
      yield { type: "string", row: rowCount, col: i - rowStart, prev: null, value };
      
      continue;
    }
    
    if (str[i].match(/[0-9]/)) {
      let base = 10;
      
      if (str[i] == "0") {
        i += 2;
        
        switch (str[i-1]) {
          case "x": base = 16; break;
          case "o": base = 8; break;
          case "b": base = 2; break;
          default: i--;
        }
      }
      
      const getNum = () => {
        const numStart = i;
        
        while (i < str.length && str[i].match(/[0-9A-F]/)) i++;
        
        return { num: parseInt("0" + str.substring(numStart, i), base), digits: i - numStart };
      }
      
      const wholeNum = getNum().num;
      let fractionalNum = 0;
      let fractionalDigits = 0;
      
      if (str[i] == ".") {
        i++;
        
        ({ num: fractionalNum, digits: fractionalDigits } = getNum());
        
        if (fractionalDigits == 0) throw new Error("Bad number at " + rowCount + ":" + (i - rowStart));
      }
      
      let magnitude = 0;
      let magDigits = 0;
      
      if (str[i] == "e") {
        i++;
        
        ({ num: magnitude, digits: magDigits } = getNum());
        
        if (magDigits == 0) throw new Error("Bad number at " + rowCount + ":" + (i - rowStart));
      }
      
      if (isNaN(wholeNum) || isNaN(fractionalNum) || isNaN(magnitude)) throw new Error("Bad number at " + rowCount + ":" + (i - rowStart));
      
      yield {
        type: "number",
        row: rowCount,
        col: i - rowStart,
        prev: null,
        value: (wholeNum + fractionalNum * base ** (-fractionalDigits)) * base ** magnitude,
      };
      
      continue;
    }
    
    throw new Error("Unknown: " + str.substring(i, i + 30));
  }
}