/*/
  Exports a function that parses a single Chalk module.
/*/

import { tokenizer } from "./tokenizer";
import { Module, IdentifierToLink } from "./chalk-ir";

function unexpected(token) {
  throw new Error("Unexpected token: ", token);
}

export function parse(path : string, str : string, isChalkDoc : boolean) {
  const tokens = tokenizer(str, isChalkDoc);
  const module = new Module(path);
  
  let token = tokens.next().value;
  
  while (token.type == "import") {
    token = parseImport(module, tokens);
  }
  
  parseDecls(module);
  
  return module;
}

function parseImport(module : Module, tokens: Iterator<string>) : string|undefined {
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
  
  return tokens.next();
}

function parseDecls(module : Module) {
  
}