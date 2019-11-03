/*/
  Defines the internal representation of Chalk source code.
/*/

import * as Path from "path";

import {
  SimpleToken,
  NamedToken,
  StringToken,
  NumberToken
} from "./tokenizer";

import { AstNode } from "./parser";

type A = AstNode|null;

export class ImportWhat extends AstNode {
  names: Map<string, [ string, string[] ]> = new Map();
  
  constructor(prev: A, whatToImport: ObjectLit|NamedToken) {
    super(prev);
    
    whatToImport instanceof ObjectLit
      ? this.object(whatToImport) : this.name(whatToImport);
  }
  
  private object(object: ObjectLit) {
    // TODO
  }
  
  private name(name: NamedToken) {
    // TODO
  }
}

export class Import extends AstNode {
  constructor(
    prev: A,
    public what: string|ImportWhat,
    _from: unknown,
    public path: StringToken
  ) {
    super(prev);
    
    // TODO
  }
}

export class Imports extends AstNode {
  imports: Import[];
  
  constructor(prev: A, i?: Import, rest?: Imports) {
    super(prev);
    
    this.imports = rest ? rest.imports : [];
    
    i && this.imports.push(i);
  }
}

export class Literal extends AstNode {
  constructor(
    prev: A,
    lit: NumberToken|StringToken|VarDef|ArrowFnDef|FnDef|ClassDef|TraitDef|Array|Tuple|ObjectLit|SetLit,
  ) {
    super(prev);
    
    // TODO
  };
}

export class Unary extends AstNode {
  constructor(
    prev: A,
    zeroth: Unary|NamedToken|Type|Literal|FunctionCall|Block|Switch|For,
    first: NamedToken|Expr,
  ) {
    super(prev);
    
    // TODO
  }
}

export class NegS {
  s: "await"|"nowait"|"ignore";
  
  constructor(prev: A, s: SimpleToken) {
    this.s = s.type as "await"|"nowait"|"ignore";
  }
}

export class Neg extends AstNode {
  constructor(prev: A, z: Neg|NegS|Unary, f: Neg) {
    super(prev);
    
    // TODO
  }
}

export class AssignS extends AstNode {
  s: "="|"+="|"-="|"*="|"/="|"%="|"**=";
  
  constructor(prev: A, s: SimpleToken) {
    super(prev);
    
    this.s = s.type as "="|"+="|"-="|"*="|"/="|"%="|"**=";
  }
}

export class Assign extends AstNode {
  constructor(prev: A, left: Neg, op: AssignS, right: Assign) {
    super(prev);
    
    // TODO
  }
}

class Op extends AstNode {
  isOperator: true = true;
  op: string|null;
  left: AstNode;
  right: AstNode;
  
  constructor(
    prev: A,
    left: AstNode,
    op: string|AstNode,
    right?: AstNode,
  ) {
    super(prev);
    
    this.op = typeof op === "string" ? op : null;
    this.left = left;
    this.right = right ? right : op as AstNode;
  }
}

export class EqualS extends AstNode {
  s: "=="|"!=";
  
  constructor(prev: A, s: SimpleToken) {
    super(prev);
    
    this.s = s.type as "=="|"!=";
  }
}

export class RelationS extends AstNode {
  s: "<"|">"|"<="|">="|"is";
  
  constructor(prev: A, s: SimpleToken) {
    super(prev);
    
    this.s = s.type as "<"|">"|"<="|">="|"is";
  }
}

export class AddS extends AstNode {
  s: "+"|"-";
  
  constructor(prev: A, s: SimpleToken) {
    super(prev);
    
    this.s = s.type as "+"|"-";
  }
}

export class MulS extends AstNode {
  s: "*"|"/";
  
  constructor(prev: A, s: SimpleToken) {
    super(prev);
    
    this.s = s.type as "*"|"/";
  }
}

export const PowR = Op;
export const PowL = Op;
export const MulR = Op;
export const MulL = Op;
export const AddR = Op;
export const AddL = Op;
export const ModR = Op;
export const ModL = Op;
export const ConcatR = Op;
export const ConcatL = Op;
export const CompareR = Op;
export const CompareL = Op;
export const RelationR = Op;
export const RelationL = Op;
export const EqualR = Op;
export const EqualL = Op;
export const AndR = Op;
export const AndL = Op;
export const OrR = Op;
export const OrL = Op;

export class QMarkR extends AstNode {
  constructor(prev: A, left: Op, mid: Expr, right: QMarkR) {
    super(prev);
    
    // TODO;
  }
}

export const QMarkL = QMarkR;

export class ExprS extends AstNode {
  s: "return"|"break"|"comptime"|"ignore"|"mutab"|"immut"|"const";
  
  constructor(prev: A, s: SimpleToken) {
    super(prev);
    
    this.s = s.type as "return"|"break"|"comptime"|"ignore"|"mutab"|"immut"|"const";
  }
}

export class Expr extends AstNode {
  constructor(prev: A, z: ExprS|SimpleToken|QMarkR, f: Expr) {
    super(prev);
    
    // TODO
  }
}

export class Identifier extends AstNode {
  name: string;
  
  constructor(prev: A, name: NamedToken) {
    super(prev);
    
    this.name = name.name;
  }
}

export class TypeListNext extends AstNode {
  types: Type[];
  
  constructor(prev: A, type?: Type, list?: TypeListNext) {
    super(prev);
    
    this.types = list ? list.types : [];
    
    type && this.types.push(type);
  }
}

export class MemAccessType extends AstNode {
  constructor(
    prev: A,
    id: Identifier|NamedToken,
    type?: MemAccessType|Type,
    list?: TypeListNext
  ) {
    super(prev);
    
    // TODO
  }
}

export class TypeModifier extends AstNode {
  modifier: string;
  
  constructor(prev: A, modifier: SimpleToken) {
    super(prev);
    
    this.modifier = modifier.type;
  }
}

export class AtomicType extends AstNode {
  constructor(
    prev: A,
    zeroth: TypeModifier|SimpleToken|Type|MemAccessType,
    first?: AtomicType|TypeListNext) {
    super(prev);
    
    // TODO
  }
}

export class TypeIntersection extends AstNode {
  constructor(prev: A, zeroth: AtomicType, first?: TypeIntersection) {
    super(prev);
    
    // TODO
  }
}

export class TypeUnion extends AstNode {
  constructor(prev: A, zeroth: TypeIntersection, first: TypeUnion) {
    super(prev);
    
    // TODO
  }
}

export class Type extends AstNode {
  constructor(prev: A, type: TypeUnion) {
    super(prev);
    
    // TODO
  }
}

export class Access extends AstNode {
  access: "mut"|"let"|"cst"|"imt";
  
  constructor(prev: A, access: SimpleToken) {
    super(prev);
    
    this.access = access.type as "mut"|"let"|"cst"|"imt";
  }
}

export class VarDefSkeleton extends AstNode {
  constructor(prev: A, ta: Type|Access, it: Identifier|Type, i?: Identifier) {
    super(prev);
    
    // TODO
  }
}

export class LitExprListNext extends AstNode {
  constructor(prev: A, item?: Expr|VarDefSkeleton, rest?: LitExprListNext) {
    super(prev);
    
    // TODO
  }
}

export class Tuple extends AstNode {
  constructor(prev: A, item?: Expr|VarDefSkeleton, rest?: LitExprListNext) {
    super(prev);
    
    // TODO
  }
}

export class VarDef extends AstNode {
  constructor(
    prev: A,
    z: VarDefSkeleton|AtomicType|Access,
    f: Expr|Tuple|AtomicType,
    s: Tuple
  ) {
    super(prev);
    
    // TODO
  }
  
  addInit(initializer: Expr): VarDef {
    // TODO
    
    return this;
  }
}

export class MType extends AstNode {
  constructor(prev: A, type?: Type) {
    super(prev);
    
    // TODO
  }
}

export class MIdentifier extends AstNode {
  constructor(prev: A, id?: Identifier) {
    super(prev);
    
    // TODO
  }
}

export class IdListNext extends AstNode {
  constructor(prev: A, i?: NamedToken, rest?: IdListNext) {
    super(prev);
    
    // TODO
  }
}

export class IdList extends AstNode {
  constructor(prev: A, i?: NamedToken, rest?: IdListNext) {
    super(prev);
    
    // TODO
  }
}

export class ParamsRest extends AstNode {
  constructor(prev: A, z: Type|Identifier|SimpleToken, f?: Identifier) {
    super(prev);
    
    // TODO
  }
}

export class Params extends AstNode {
  constructor(prev: A, type?: Type, id?: Identifier, rest?: ParamsRest) {
    super(prev);
    
    // TODO
  }
}

export class ArrowFnDef extends AstNode {
  constructor(prev: A, mType: MType, i: Identifier|MIdentifier, a: Expr|IdList|Params, b?: Expr) {
    super(prev);
    
    // TODO
  }
}

export class FnDeclaration extends AstNode {
  constructor(prev: A, mType: MType, name: Identifier, params: Params) {
    super(prev);
    
    // TODO
  }
}

export class BlockOrEmpty extends AstNode {
  constructor(prev: A, block?: Block) {
    super(prev);
    
    // TODO
  }
}

export class FnDef extends AstNode {
  constructor(prev: A,dec: FnDeclaration, body: BlockOrEmpty) {
    super(prev);
    
    // TODO
  }
}

export class DefExpr extends AstNode {
  constructor(prev: A, public def: VarDef|ArrowFnDef|FnDef|ClassDef|TraitDef) {
    super(prev);
    
    // TODO
  }
}

export class Proposition extends AstNode {
  constructor(prev: A) {
    super(prev);
    
    // TODO
  }
}

export class DefExprs extends AstNode {
  defExprs: DefExpr[];
  
  constructor(prev: A, defOrProp?: DefExpr|Proposition, defs?: DefExprs) {
    super(prev);
    
    this.defExprs = defs ? defs.defExprs : [];
    
    defOrProp instanceof DefExpr && this.defExprs.push(defOrProp);
  }
}

export class DefExprsTrait extends AstNode {
  constructor(prev: A, z?: DefExpr|Proposition|FnDeclaration, rest?: DefExprsTrait) {
    super(prev);
    
    // TODO
  }
}

export class GenericParams extends AstNode {
  constructor(prev: A, params?: Params) {
    super(prev);
    
    // TODO
  }
}

export class ClassDef extends AstNode {
  constructor(prev: A, name: NamedToken, params: GenericParams, defs: DefExprs) {
    super(prev);
    
    // TODO
  }
}

export class TraitDef extends AstNode {
  constructor(prev: A, name: NamedToken, params: GenericParams, defs: DefExprsTrait) {
    super(prev);
    
    // TODO
  }
}

export class Array extends AstNode {
  constructor(prev: A, z?: Expr|VarDefSkeleton, rest?: LitExprListNext) {
    super(prev);
    
    // TODO
  }
}

export class ObjNext extends AstNode {
  constructor(
    prev: A,
    z?: Identifier|VarDef|VarDefSkeleton,
    f?: Expr|VarDefSkeleton|ObjNext,
    s?: ObjNext,
  ) {
    super(prev);
    
    // TODO
  }
}

export class ObjectLit extends AstNode {
  constructor(
    prev: A,
    z?: Identifier|VarDef|VarDefSkeleton,
    f?: Expr|VarDefSkeleton|ObjNext,
    s?: ObjNext,
  ) {
    super(prev);
    
    // TODO
  }
}

export class SetNext extends AstNode {
  constructor(prev: A, item?: Expr|VarDefSkeleton, rest?: SetNext) {
    super(prev);
    
    // TODO
  }
}

export class SetLit extends AstNode {
  constructor(
    prev: A,
    z: Expr|VarDefSkeleton,
    f: Expr|VarDefSkeleton,
    rest: SetNext) {
    super(prev);
    
    // TODO
  }
}

export class FunctionCall extends AstNode {
  constructor(prev: A, expr: Expr, args: Tuple) {
    super(prev);
    
    // TODO: if (isAtomicType(expr)) throw new Error("Rejecting wrong parse");
    
    // TODO
  }
}

export class ExprList extends AstNode {
  constructor(prev: A, item: Expr|Proposition|DefExpr, rest?: ExprList) {
    super(prev);
    
    // TODO
  }
}

export class Block extends AstNode {
  constructor(prev: A, exprs: ExprList) {
    super(prev);
    
    // TODO
  }
}

export class MExpr extends AstNode {
  constructor(prev: A, expr?: Expr) {
    super(prev);
    
    // TODO
  }
}

export class Case extends AstNode {
  constructor(prev: A, z: Expr|DefExpr, f?: Expr|DefExpr) {
    super(prev);
    
    // TODO
  }
}

export class Cases extends AstNode {
  constructor(prev: A, c: Case, rest?: Cases) {
    super(prev);
    
    // TODO
  }
}

export class Switch extends AstNode {
  constructor(prev: A, expr: MExpr, cases: Cases) {
    super(prev);
    
    // TODO
  }
}

export class For extends AstNode {
  constructor(
    prev: A,
    z: Expr|BlockOrEmpty,
    f: Expr|BlockOrEmpty,
    s: Expr|BlockOrEmpty,
    t: BlockOrEmpty,
  ) {
    super(prev);
    
    // TODO
  }
}

export class ChalkModule extends AstNode {
  importPaths = new Set<string>();
  path: string|null = null;
  
  members: Map<string, Expr|null> = new Map();
  
  constructor(prev: A, imports: Imports, defs: DefExprs) {
    super(prev);
    
    // TODO
  }
  
  addMember(name: string, member: Expr): ChalkModule {
    // TODO
    
    return this;
  }
  
  linkImports(modules: Modules): ChalkModule {
    // TODO
    
    return this;
  }
  
  setPath(path: string): ChalkModule {
    this.path = path;
    
    const match = path.match(/^local\/lib\/[a-zA-Z0-9-]+\/0-0-0\//);
    const root = match ? match[0] : "";
    
    // TODO compute importPaths;
    
    this.path = ((): string => {
      switch (path[0]) {
        case "/": return root + Path.normalize("." + path);
        case ".": {
          const normalized = Path.normalize(path);
          
          if (normalized[0] === ".") throw new Error("Cannot import path \""
            + path + ", normalized to " + normalized + ". Path refers to outside "
            + "of root (\"" + (root || ".") + "\")."
          );
          
          return root + normalized;
        };
        default: {
          if (!path.match(/[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9]|)/))
            throw new Error("Library must only contain letters, digits, and '-' "
            + "not at the start or end of the name."
          );
          
          // Implementation of versioning will be left to the compiler.
          return "local/lib/0-0-0/" + path + "/index.ch";
        }
      }
    })()
    
    path.match(/\/$/) && (path += "index.ch");
    
    return this;
  }
}
