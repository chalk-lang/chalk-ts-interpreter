/*/
  Exports a function that parses a single Chalk module.
  
  Probably deprecated and will be replaced by `./parser.js`.
/*/

/*/
import { tokenizer, Token } from "./tokenizer";
import { Module } from "./chalk-ir";

function unexpected(token: Token): never {
  console.log(("Unexpected token:"));
  console.log(token);
  throw new Error("Unexpected token.");
}

export function parse(path: string, str: string, isChalkDoc: boolean): Module {
  const tokens = tokenizer(str, isChalkDoc);
  const module = new Module(path);
  
  let token = tokens.next().value;
  
  while (token.type == "import") {
    token = parseImport(module, tokens);
  }
  
  parseDecls(module, token);
  
  return module;
}

function parseImport(module: Module, tokens: Iterator<Token>): Token {
  const idLink = new IdentifierToLink();
  
  let token = tokens.next().value;
  
  switch (token.type) {
    case "uIdentifier": module.addMember(token.name, idLink.setName(token.name)); break;
    case "{": break;
    default: unexpected(token);
  }
  
  if (token.type != "lIdentifier" && token.name != "from") unexpected(token);
  
  token = tokens.next().value;
  
  if (token.type != "string") unexpected(token);
  
  idLink.setModulePath(token.value);
  
  return tokens.next().value;
}

function parseDecls(module: Module, token: Token) {
  
}
/*/
