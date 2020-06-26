/*/
  Grammar of the Chalk language.
  
  If you change the grammar, don't forget to genearte parser tables by running
  "npm run tables", and also change the hardcoded number of states of the
  parser table in `parser-table-generator.ts`. Ctrl + F `numOfStates`.
  
  Known defects:
  0. `"{" "Expr" "}"` will be read both as object literal and a block.
     Solution: add a trailing comma/semicolon.
  
  I'm not touching this grammar again unless I absolutely have to.
/*/

import * as Rules from './chalk-ir';

export type Rule = [string, string[]];

export type Grammar = Rule[];

export function isTerminal(symbol: string): boolean {
  return !symbol.match(/^[A-Z]/);
}

export const startSymbols = [ "ChalkScript", "ChalkDoc" ];

export const chalkGrammar: Grammar =
  [ [ "ChalkScript", [ "Imports", "ExprList" ] ],
    [ "Imports", [ "Import", "Imports" ] ],
    [ "Imports", [] ],
    [ "Import", [ "import", "ImportWhat", "lIdentifier", "string", ";" ] ],
    [ "ImportWhat", [ "uIdentifier" ] ],
    [ "ImportWhat", [ "ObjectLit" ] ],
    [ "Access", [] ],
    [ "Access", [ "AccessS", "Access" ] ],
    [ "AccessS", [ "pub" ] ],
    [ "AccessS", [ "static" ] ],
    [ "DefExprE", [ "FnDef" ] ],
    [ "DefExprE", [ "ClassDef" ] ],
    [ "DefExprE", [ "TraitDef" ] ],
    [ "VarDef", [ "VarDefSkeleton" ] ],
    [ "VarDef", [ "Modifier", "AtomicType", "Tuple" ] ],
    [ "VarDefSkeleton", [ "Type", "Identifier" ] ],
    [ "VarDefSkeleton", [ "Modifier", "Type", "Identifier" ] ],
    [ "VarDefSkeleton", [ "Modifier", "Identifier" ] ],
    [ "Identifier", [ "lIdentifier" ] ],
    [ "Identifier", [ "uIdentifier" ] ],
    [ "Modifier", [ "mut" ] ],
    [ "Modifier", [ "let" ] ],
    [ "Modifier", [ "cst" ] ],
    [ "Modifier", [ "imt" ] ],
    [ "ArrowFnDef", [ "MType", "Identifier", "ConstructorInitList", "=>", "Expr" ] ],
    [ "ArrowFnDef", [ "MType", "MIdentifier", "(", "IdList", ")", "ConstructorInitList", "=>", "Expr" ] ],
    [ "ArrowFnDef", [ "MType", "MIdentifier", "Tuple", "ConstructorInitList", "=>", "Expr" ] ],
    [ "FnDeclaration", [ "MType", "Tuple" ] ],
    [ "FnDeclaration", [ "MType", "lIdentifier", "Tuple" ] ],
    [ "FnDef", [ "FnDeclaration", "ConstructorInitList", "BlockOrEmpty" ] ],
    [ "MType", [ "Type" ] ],
    [ "MType", [] ],
    [ "MIdentifier", [ "Identifier" ] ],
    [ "MIdentifier", [] ],
    [ "ConstructorInitList", [] ],
    [ "ConstructorInitList", [ ":", "Identifier", "Tuple", "InitListNext" ] ],
    [ "InitListNext", [] ],
    [ "InitListNext", [ "," ] ],
    [ "InitListNext", [ ",", "Tuple", "InitListNext" ] ],
    [ "IdList", [ "Identifier", ",", "IdListNext" ] ],
    [ "IdList", [ "Identifier" ] ],
    [ "IdListNext", [ ",", "Identifier", "IdListNext" ] ],
    [ "IdListNext", [ "," ] ],
    [ "IdListNext", [] ],
    [ "ClassDef", [ "class", "ClassDefStart", "BlockOrEmpty" ] ],
    [ "TraitDef", [ "trait", "uIdentifier", "GenericParams", "BlockOrEmpty" ] ],
    [ "ClassDefStart", [] ],
    [ "ClassDefStart", [ "uIdentifier", "GenericParams" ] ],
    [ "ClassDefStart", [ "uIdentifier", "GenericParams", ":", "IdList" ] ],
    [ "GenericParams", [ "<", "Params", ">" ] ],
    [ "GenericParams", [] ],
    [ "Params", [ "Type", "Identifier", ",", "ParamsRest" ] ],
    [ "Params", [] ],
    [ "ParamsRest", [ ",", "Type", "Identifier" ] ],
    [ "ParamsRest", [ ",", "Identifier" ] ],
    [ "ParamsRest", [ "," ] ],
    [ "ParamsRest", [] ],
    [ "Type", [ "TypeUnion" ] ], // TODO forgot function types
    [ "TypeUnion", [ "TypeIntersection", "|", "TypeUnion" ] ],
    [ "TypeUnion", [ "TypeIntersection" ] ],
    [ "TypeIntersection", [ "AtomicType", "&", "TypeIntersection" ] ],
    [ "TypeIntersection", [ "AtomicType" ] ],
    [ "AtomicType", [ "TypeModifier", "AtomicType" ] ],
    [ "AtomicType", [ "class" ] ],
    [ "AtomicType", [ "trait" ] ],
    [ "AtomicType", [ "type" ] ],
    [ "AtomicType", [ "any" ] ],
    [ "AtomicType", [ "(", "Type", "TypeListNext", ")" ] ],
    [ "AtomicType", [ "MemAccessType" ] ],
    [ "TypeModifier", [ "[]" ] ],
    [ "TypeModifier", [ "?" ] ],
    [ "MemAccessType", [ "Identifier", ".", "MemAccessType" ] ],
    [ "MemAccessType", [ "uIdentifier" ] ],
    [ "MemAccessType", [ "uIdentifier", "<", "Type", "TypeListNext", ">" ] ],
    [ "TypeListNext", [ ",", "Type", "TypeListNext" ] ],
    [ "TypeListNext", [ "," ] ],
    [ "TypeListNext", [] ],
    [ "Expr", [ "ExprS", "Expr" ] ],
    [ "Expr", [ "continue" ] ],
    [ "Expr", [ "QMarkR" ] ],
    [ "ExprS", [ "return" ] ],
    [ "ExprS", [ "break" ] ],
    [ "ExprS", [ "comptime" ] ],
    [ "ExprS", [ "ignore" ] ],
    [ "ExprS", [ "mutab" ] ],
    [ "ExprS", [ "immut" ] ],
    [ "ExprS", [ "const" ] ],
    [ "QMarkR", [ "OrL", "?", "Expr", ":", "QMarkR" ] ],
    [ "QMarkR", [ "OrR" ] ],
    [ "QMarkL", [ "OrL", "?", "Expr", ":", "QMarkL" ] ],
    [ "QMarkL", [ "OrL" ] ],
    [ "OrR", [ "AndL", "||", "OrR" ] ],
    [ "OrR", [ "AndR" ] ],
    [ "OrL", [ "AndL", "||", "OrL" ] ],
    [ "OrL", [ "AndL" ] ],
    [ "AndR", [ "EqualL", "&&", "AndR" ] ],
    [ "AndR", [ "EqualR" ] ],
    [ "AndL", [ "EqualL", "&&", "AndL" ] ],
    [ "AndL", [ "EqualL" ] ],
    [ "EqualR", [ "EqualL", "EqualS", "RelationR" ] ],
    [ "EqualR", [ "RelationR" ] ],
    [ "EqualL", [ "EqualL", "EqualS", "RelationL" ] ],
    [ "EqualL", [ "RelationL" ] ],
    [ "EqualS", [ "==" ] ],
    [ "EqualS", [ "!=" ] ],
    [ "RelationR", [ "CompareL", "RelationS", "CompareR" ] ],
    [ "RelationR", [ "CompareR" ] ],
    [ "RelationL", [ "CompareL", "RelationS", "CompareL" ] ],
    [ "RelationL", [ "CompareL" ] ],
    [ "RelationS", [ "<" ] ],
    [ "RelationS", [ ">" ] ],
    [ "RelationS", [ "<=" ] ],
    [ "RelationS", [ ">=" ] ],
    [ "RelationS", [ "is" ] ],
    [ "CompareR", [ "ConcatL", "<=>", "ConcatR" ] ],
    [ "CompareR", [ "ConcatR" ] ],
    [ "CompareL", [ "ConcatL", "<=>", "ConcatL" ] ],
    [ "CompareL", [ "ConcatL" ] ],
    [ "ConcatR", [ "ConcatL", "++", "ModR" ] ],
    [ "ConcatR", [ "ModR" ] ],
    [ "ConcatL", [ "ConcatL", "++", "ModL" ] ],
    [ "ConcatL", [ "ModL" ] ],
    [ "ModR", [ "ModL", "%", "AddR" ] ],
    [ "ModR", [ "AddR" ] ],
    [ "ModL", [ "ModL", "%", "AddL" ] ],
    [ "ModL", [ "AddL" ] ],
    [ "AddR", [ "AddL", "AddS", "MulR" ] ],
    [ "AddR", [ "MulR" ] ],
    [ "AddL", [ "AddL", "AddS", "MulL" ] ],
    [ "AddL", [ "MulL" ] ],
    [ "AddS", [ "+" ] ],
    [ "AddS", [ "-" ] ],
    [ "MulR", [ "MulL", "MulS", "PowR" ] ],
    [ "MulR", [ "PowR" ] ],
    [ "MulL", [ "MulL", "MulS", "PowL" ] ],
    [ "MulL", [ "PowL" ] ],
    [ "MulS", [ "*" ] ],
    [ "MulS", [ "/" ] ],
    [ "PowR", [ "Neg", "**", "PowR" ] ],
    [ "PowR", [ "Neg" ] ],
    [ "PowR", [ "Assign" ] ],
    [ "PowL", [ "Neg", "**", "PowL" ] ],
    [ "PowL", [ "Neg" ] ],
    [ "Assign", [ "Neg", "AssignS", "Expr" ] ],
    [ "AssignS", [ "=" ] ],
    [ "AssignS", [ "+=" ] ],
    [ "AssignS", [ "-=" ] ],
    [ "AssignS", [ "*=" ] ],
    [ "AssignS", [ "/=" ] ],
    [ "AssignS", [ "%=" ] ],
    [ "AssignS", [ "**=" ] ],
    [ "Neg", [ "NegS", "Neg" ] ],
    [ "Neg", [ "Unary" ] ],
    [ "NegS", [ "!" ] ],
    [ "NegS", [ "await" ] ],
    [ "NegS", [ "nowait" ] ],
    [ "NegS", [ "ignore" ] ],
    [ "Unary", [ "Unary", ".", "lIdentifier" ] ],
    [ "Unary", [ "Unary", "[", "Expr", "]" ] ],
    [ "Unary", [ "Unary", "Tuple" ] ], // Function call.
    [ "Unary", [ "lIdentifier" ] ],
    [ "Unary", [ "Type" ] ],
    [ "Unary", [ "Literal" ] ],
    [ "Unary", [ "Block" ] ],
    [ "Unary", [ "Switch" ] ],
    [ "Unary", [ "For" ] ],
    [ "Literal", [ "number" ] ],
    [ "Literal", [ "string" ] ],
    [ "Literal", [ "VarDef" ] ],
    [ "Literal", [ "ArrowFnDef" ] ],
    [ "Literal", [ "FnDef" ] ],
    [ "Literal", [ "ClassDef" ] ],
    [ "Literal", [ "TraitDef" ] ],
    [ "Literal", [ "Array" ] ],
    [ "Literal", [ "Tuple" ] ],
    [ "Literal", [ "ObjectLit" ] ],
    [ "Literal", [ "SetLit" ] ],
    [ "Array", [ "[]" ] ],
    [ "Array", [ "[", "]" ] ],
    [ "Array", [ "[", "Expr", "LitExprListNext", "]" ] ],
    [ "Tuple", [ "(", ")" ] ],
    [ "Tuple", [ "(", "Expr", "LitExprListNext", ")" ] ],
    [ "ObjectLit", [ "{", "}" ] ],
    [ "ObjectLit", [ "{", "Identifier", ":", "Expr", "ObjNext", "}" ] ],
    [ "ObjectLit", [ "{", "VarDefSkeleton", ":", "Expr", "ObjNext", "}" ] ],
    [ "ObjectLit", [ "{", "Expr", "ObjNext", "}" ] ],
    [ "ObjNext", [ ",", "VarDefSkeleton", ":", "Expr", "ObjNext" ] ],
    [ "ObjNext", [ ",", "Identifier", ":", "Expr", "ObjNext" ] ],
    [ "ObjNext", [ ",", "Expr", "ObjNext" ] ],
    [ "ObjNext", [ "," ] ],
    [ "ObjNext", [] ],
    [ "SetLit", [ "{", "Expr", ",", "Expr", "SetNext", "}" ] ],
    [ "SetNext", [ ",", "Expr", "SetNext" ] ],
    [ "SetNext", [ "," ] ],
    [ "SetNext", [] ],
    [ "LitExprListNext", [ ",", "Expr", "LitExprListNext" ] ],
    [ "LitExprListNext", [ "," ] ],
    [ "LitExprListNext", [] ],
    [ "Block", [ "{", "ExprList", "}" ] ],
    [ "ExprList", [ "Access", "Expr" ] ],
    [ "ExprList", [ "Access", "Expr", ";" ] ],
    [ "ExprList", [ "Proposition" ] ],
    [ "ExprList", [ "Access", "Expr", ";", "ExprList" ] ],
    [ "ExprList", [ "Proposition", "ExprList" ] ],
    [ "ExprList", [ "Access", "DefExprE", "ExprList" ] ],
    [ "BlockOrEmpty", [ "{", "}" ] ],
    [ "BlockOrEmpty", [ "Block" ] ],
    [ "Switch", [ "switch", "MExpr", "{", "Cases", "}" ] ], // Here 0
    [ "MExpr", [ "Expr" ] ],
    [ "MExpr", [] ],
    [ "Cases", [ "Case", "Cases" ] ],
    [ "Cases", [ "Case" ] ],
    [ "Case", [ "case", "Expr", ":", "Expr", ";" ] ],
    [ "Case", [ "case", "Expr", ":", "DefExprE" ] ],
    [ "Case", [ "default", ":", "Expr" ] ],
    [ "Case", [ "default", ":", "DefExprE" ] ],
    [ "For", [ "for", "BlockOrEmpty" ] ],
    [ "For", [ "for", "Expr", "BlockOrEmpty" ] ], // `for 10 {}`
    [ "For", [ "for", "Expr", ";", "BlockOrEmpty" ] ],
    [ "For", [ "for", "Expr", ";", "Expr", ";", "BlockOrEmpty" ] ],
    [ "For", [ "for", "Expr", ";", "Expr", ";", "Expr", ";", "BlockOrEmpty" ] ],
    
    [ "Proposition", [ "Proposition" ] ],
    /*
    [ "Proposition", [ "@All", ":", "Stm" ] ],
    [ "Proposition", [ "@All", "Relation", ":", "Stm" ] ],
    [ "Proposition", [ "@All", "StmDef", ":", "Stm" ] ],
    [ "Proposition", [ "@Exists", "Relation", ":", "Stm" ] ],
    [ "Proposition", [ "@Exists", "StmDef", ":", "Stm" ] ],
    [ "Proposition", [ "@Ex", "Relation", ":", "Stm" ] ],
    [ "Proposition", [ "@Ex", "StmDef", ":", "Stm" ] ],
    [ "Stm", [ "Proposition" ] ],
    [ "Stm", [ "Relation" ] ],
    [ "Stm", [ "Stm", "<-", "Stm" ] ],
    [ "Stm", [ "Stm", "->", "Stm" ] ],
    [ "Stm", [ "Stm", "<->", "Stm" ] ],
    [ "Relation", [ "hmm" ] ], // TODO
    [ "StmDef", [ "hmm" ] ], // TODO
    
    
    
    
    [ "Plaintext", [ "string" ] ],
    [ "JSON", [] ], // TODO
    [ "ChalkDoc", [] ], // TODO
    
    [ "ChalkDoc", [] ],
    */
  ];

function checkGrammarCorrectenss(grammar: Grammar) {
  for (let rule of grammar) {
    if (!(Rules as any)[rule[0]]) {
      throw new Error("Rule " + rule[0] + " doesn't have its corresponding class.");
    }
    
    for (let symbol of rule[1]) {
      if (!isTerminal(symbol) && !grammar.find(rule => rule[0] == symbol)) {
        throw new Error("Undefined non-terminal: " + symbol);
      }
    }
  }
}

checkGrammarCorrectenss(chalkGrammar);
