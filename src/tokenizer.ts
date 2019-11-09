/*/
  Tokenizer for the Chalk programming language.
/*/

import { AstNode } from "./chalk-ir";

export abstract class Token extends AstNode {
  type!: string;
  row!: number;
  col!: number;
}

export class EmptyToken extends Token {
  type = "";
  
  constructor(public row: number, public col: number) {
    super();
  }
}

export class SimpleToken extends Token {
  static typesUppercase = [ "All", "Ex", "Exists" ];
  static types =
    [ "comptime", "import", "ignore", "nowait", "switch", "static", "class",
      "trait", "await", "type", "case", "mut", "let", "cst", "imt", "any", "<=>",
      "**=", "<->", "=>", "[]", "||", "&&", "==", "!=", "<=", ">=", "is", "++",
      "**", "+=", "-=", "*=", "/=", "%=", "<-", "->", ";", "=", "(", ")", "{",
      "}", "<", ">", "|", "&", "*", ".", ",", "?", ":", "%", "+", "-", "/", "!",
      "[", "]", ...SimpleToken.typesUppercase,
    ];
  
  constructor(
    public type: typeof SimpleToken.types[number],
    public row: number,
    public col: number
  ) {
    super();
  }
}

export class NamedToken extends Token {
  static types = [ "break", "continue", "for", "return", "lIdentifier", "uIdentifier" ];
  
  constructor(
    public type: typeof NamedToken.types[number],
    public row: number,
    public col: number,
    public name: string
  ) {
    super();
  }
}

export class StringToken extends Token {
  constructor(
    public type: "string",
    public row: number,
    public col: number,
    public value: string,
  ) {
    super();
  }
}

export class NumberToken extends Token {
  constructor(
    public type: "number",
    public row: number,
    public col: number,
    public value: number,
  ) {
    super();
  }
}

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
    
    if (str.substring(i, i + 2) == "//") {
      i += 2;
      
      while (i < str.length && str[i] != "\n") i++;
      
      newLine();
      
      i++;
      
      continue;
    }
    
    let match;
    
    if (match = SimpleToken.types.find(symbol => str.substring(i, i + symbol.length) == symbol)) {
      if (SimpleToken.typesUppercase.includes(match)) match = "@" + match;
      
      yield new SimpleToken(match, rowCount, i - rowStart);
      
      i += match.length;
      
      continue;
    }
    
    if (match = NamedToken.types.find(symbol => str.substring(i, i + symbol.length) == symbol)) {
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
      
      yield new NamedToken(name, rowCount, col, name);
      
      continue;
    }
    
    if (str[i].match(/[a-zA-Z]/)) {
      const nameStart = i;
      const type = str[i].match(/[a-z]/) ? "lIdentifier" : "uIdentifier";
      
      i++;
      
      while (i < str.length && str[i].match(/[a-zA-Z0-9]/)) i++;
      
      yield new NamedToken(
        type,
        rowCount,
        i - rowStart,
        str.substring(nameStart, i)
      );
      
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
      
      yield new StringToken("string", rowCount, i - rowStart, value);
      
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
      
      yield new NumberToken(
        "number",
        rowCount,
        i - rowStart,
        (wholeNum + fractionalNum * base ** (-fractionalDigits)) * base ** magnitude,
      );
      
      continue;
    }
    
    throw new Error("Unknown: " + str.substring(i, i + 30));
  }
  
  yield new EmptyToken(rowCount, i - rowStart);
}
