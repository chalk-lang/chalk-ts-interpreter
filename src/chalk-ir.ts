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

export class AstNode {}

export class ImportWhat extends AstNode {
  names: Map<string, [ string, string[] ]> = new Map();
  
  constructor(whatToImport: ObjectLit|NamedToken) {
    super();
    
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
    public what: string|ImportWhat,
    _from: unknown,
    public path: StringToken
  ) {
    super();
    
    // TODO
  }
}

export class Imports extends AstNode {
  imports: Import[];
  
  constructor(i?: Import, rest?: Imports) {
    super();
    
    this.imports = rest ? rest.imports : [];
    
    i && this.imports.push(i);
  }
}

export class Literal extends AstNode {
  constructor(
    lit: NumberToken|StringToken|VarDef|ArrowFnDef|FnDef|ClassDef|TraitDef|Array|Tuple|ObjectLit|SetLit,
  ) {
    super();
    
    // TODO
  };
}

export class Unary extends AstNode {
  constructor(
    zeroth: Unary|NamedToken|Type|Literal|Block|Switch|For,
    first: NamedToken|Expr|Tuple,
  ) {
    super();
    
    // TODO
  }
}

export class NegS {
  s: "await"|"nowait"|"ignore";
  
  constructor(s: SimpleToken) {
    this.s = s.type as "await"|"nowait"|"ignore";
  }
}

export class Neg extends AstNode {
  constructor(z: Neg|NegS|Unary, f: Neg) {
    super();
    
    // TODO
  }
}

export class AssignS extends AstNode {
  s: "="|"+="|"-="|"*="|"/="|"%="|"**=";
  
  constructor(s: SimpleToken) {
    super();
    
    this.s = s.type as "="|"+="|"-="|"*="|"/="|"%="|"**=";
  }
}

export class Assign extends AstNode {
  constructor(left: Neg, op: AssignS, right: Assign) {
    super();
    
    // TODO
  }
}

class Op extends AstNode {
  isOperator: true = true;
  op: string|null;
  left: AstNode;
  right: AstNode;
  
  constructor(
    left: AstNode,
    op: string|AstNode,
    right?: AstNode,
  ) {
    super();
    
    this.op = typeof op === "string" ? op : null;
    this.left = left;
    this.right = right ? right : op as AstNode;
  }
}

export class EqualS extends AstNode {
  s: "=="|"!=";
  
  constructor(s: SimpleToken) {
    super();
    
    this.s = s.type as "=="|"!=";
  }
}

export class RelationS extends AstNode {
  s: "<"|">"|"<="|">="|"is";
  
  constructor(s: SimpleToken) {
    super();
    
    this.s = s.type as "<"|">"|"<="|">="|"is";
  }
}

export class AddS extends AstNode {
  s: "+"|"-";
  
  constructor(s: SimpleToken) {
    super();
    
    this.s = s.type as "+"|"-";
  }
}

export class MulS extends AstNode {
  s: "*"|"/";
  
  constructor(s: SimpleToken) {
    super();
    
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
  constructor(left: Op, mid: Expr, right: QMarkR) {
    super();
    
    // TODO;
  }
}

export const QMarkL = QMarkR;

export class ExprS extends AstNode {
  s: "return"|"break"|"comptime"|"ignore"|"mutab"|"immut"|"const";
  
  constructor(s: SimpleToken) {
    super();
    
    this.s = s.type as "return"|"break"|"comptime"|"ignore"|"mutab"|"immut"|"const";
  }
}

export class Expr extends AstNode {
  constructor(z: ExprS|SimpleToken|QMarkR, f: Expr) {
    super();
    
    // TODO
  }
}

export class Identifier extends AstNode {
  name: string;
  
  constructor(name: NamedToken) {
    super();
    
    this.name = name.name;
  }
}

export class TypeListNext extends AstNode {
  types: Type[];
  
  constructor(type?: Type, list?: TypeListNext) {
    super();
    
    this.types = list ? list.types : [];
    
    type && this.types.push(type);
  }
}

export class MemAccessType extends AstNode {
  constructor(
    id: Identifier|NamedToken,
    type?: MemAccessType|Type,
    list?: TypeListNext
  ) {
    super();
    
    // TODO
  }
}

export class TypeModifier extends AstNode {
  modifier: string;
  
  constructor(modifier: SimpleToken) {
    super();
    
    this.modifier = modifier.type;
  }
}

export class AtomicType extends AstNode {
  constructor(
    zeroth: TypeModifier|SimpleToken|Type|MemAccessType,
    first?: AtomicType|TypeListNext) {
    super();
    
    // TODO
  }
}

export class TypeIntersection extends AstNode {
  constructor(zeroth: AtomicType, first?: TypeIntersection) {
    super();
    
    // TODO
  }
}

export class TypeUnion extends AstNode {
  constructor(zeroth: TypeIntersection, first: TypeUnion) {
    super();
    
    // TODO
  }
}

export class Type extends AstNode {
  constructor(type: TypeUnion) {
    super();
    
    // TODO
  }
}

export class Modifier extends AstNode {
  modifier: "mut"|"let"|"cst"|"imt";
  
  constructor(modifier: SimpleToken) {
    super();
    
    this.modifier = modifier.type as "mut"|"let"|"cst"|"imt";
  }
}

export class VarDefSkeleton extends AstNode {
  constructor(ta: Type|Modifier, it: Identifier|Type, i?: Identifier) {
    super();
    
    // TODO
  }
}

export class LitExprListNext extends AstNode {
  constructor(item?: Expr|VarDefSkeleton, rest?: LitExprListNext) {
    super();
    
    // TODO
  }
}

export class Tuple extends AstNode {
  constructor(item?: Expr|VarDefSkeleton, rest?: LitExprListNext) {
    super();
    
    // TODO
  }
}

export class VarDef extends AstNode {
  constructor(
    z: VarDefSkeleton|AtomicType|Modifier,
    f: Expr|Tuple|AtomicType,
    s: Tuple
  ) {
    super();
    
    // TODO
  }
  
  addInit(initializer: Expr): VarDef {
    // TODO
    
    return this;
  }
}

export class MType extends AstNode {
  constructor(type?: Type) {
    super();
    
    // TODO
  }
}

export class MIdentifier extends AstNode {
  constructor(id?: Identifier) {
    super();
    
    // TODO
  }
}

export class IdListNext extends AstNode {
  constructor(i?: NamedToken, rest?: IdListNext) {
    super();
    
    // TODO
  }
}

export class IdList extends AstNode {
  constructor(i?: NamedToken, rest?: IdListNext) {
    super();
    
    // TODO
  }
}

export class ParamsRest extends AstNode {
  constructor(z: Type|Identifier|SimpleToken, f?: Identifier) {
    super();
    
    // TODO
  }
}

export class Params extends AstNode {
  constructor(type?: Type, id?: Identifier, rest?: ParamsRest) {
    super();
    
    // TODO
  }
}

export class InitListNext extends AstNode {
  constructor(name?: Identifier, params?: Params, next?: InitListNext) {
    super();
    
    // TODO
  }
}

export class ConstructorInitList extends AstNode {
  constructor(name?: Identifier, params?: Params, next?: InitListNext) {
    super();
    
    // TODO
  }
}

export class ArrowFnDef extends AstNode {
  constructor(mType: MType, i: Identifier|MIdentifier, a: Expr|IdList|Params, b?: Expr) {
    super();
    
    // TODO
  }
}

export class FnDeclaration extends AstNode {
  constructor(mType: MType, name: Identifier, params: Params) {
    super();
    
    // TODO
  }
}

export class BlockOrEmpty extends AstNode {
  constructor(block?: Block) {
    super();
    
    // TODO
  }
}

export class FnDef extends AstNode {
  constructor(dec: FnDeclaration, body: BlockOrEmpty) {
    super();
    
    // TODO
  }
}

export class AccessS extends AstNode {
  s: "pub"|"static";
  
  constructor(s: SimpleToken) {
    super();
    
    this.s = s.type as "pub"|"static";
  }
}

export class Access extends AstNode {
  pub: boolean;
  sta: boolean;
  
  constructor(s?: AccessS, access?: Access) {
    super();
    
    this.pub = !!access && access.pub || !!s && s.s === "pub";
    this.sta = !!access && access.sta || !!s && s.s === "static";
  }
}

export class DefExpr extends AstNode {
  constructor(public def: VarDef|ArrowFnDef|FnDef|ClassDef|TraitDef) {
    super();
    
    // TODO
  }
}

export class Proposition extends AstNode {
  constructor() {
    super();
    
    // TODO
  }
}

export class DefExprs extends AstNode {
  defExprs: DefExpr[];
  
  constructor(defOrProp?: DefExpr|Proposition, defs?: DefExprs) {
    super();
    
    this.defExprs = defs ? defs.defExprs : [];
    
    defOrProp instanceof DefExpr && this.defExprs.push(defOrProp);
  }
}

export class DefExprsTrait extends AstNode {
  constructor(z?: DefExpr|Proposition|FnDeclaration, rest?: DefExprsTrait) {
    super();
    
    // TODO
  }
}

export class GenericParams extends AstNode {
  constructor(params?: Params) {
    super();
    
    // TODO
  }
}

export class ClassDef extends AstNode {
  constructor(name: NamedToken, params: GenericParams, defs: DefExprs) {
    super();
    
    // TODO
  }
}

export class TraitDef extends AstNode {
  constructor(name: NamedToken, params: GenericParams, defs: DefExprsTrait) {
    super();
    
    // TODO
  }
}

export class Array extends AstNode {
  constructor(z?: Expr|VarDefSkeleton, rest?: LitExprListNext) {
    super();
    
    // TODO
  }
}

export class ObjNext extends AstNode {
  constructor(
    z?: Identifier|VarDef|VarDefSkeleton,
    f?: Expr|VarDefSkeleton|ObjNext,
    s?: ObjNext,
  ) {
    super();
    
    // TODO
  }
}

export class ObjectLit extends AstNode {
  constructor(
    z?: Identifier|VarDef|VarDefSkeleton,
    f?: Expr|VarDefSkeleton|ObjNext,
    s?: ObjNext,
  ) {
    super();
    
    // TODO
  }
}

export class SetNext extends AstNode {
  constructor(item?: Expr|VarDefSkeleton, rest?: SetNext) {
    super();
    
    // TODO
  }
}

export class SetLit extends AstNode {
  constructor(
    z: Expr|VarDefSkeleton,
    f: Expr|VarDefSkeleton,
    rest: SetNext) {
    super();
    
    // TODO
  }
}

export class ExprList extends AstNode {
  constructor(item: Expr|Proposition|DefExpr, rest?: ExprList) {
    super();
    
    // TODO
  }
}

export class Block extends AstNode {
  constructor(exprs: ExprList) {
    super();
    
    // TODO
  }
}

export class MExpr extends AstNode {
  constructor(expr?: Expr) {
    super();
    
    // TODO
  }
}

export class Case extends AstNode {
  constructor(z: Expr|DefExpr, f?: Expr|DefExpr) {
    super();
    
    // TODO
  }
}

export class Cases extends AstNode {
  constructor(c: Case, rest?: Cases) {
    super();
    
    // TODO
  }
}

export class Switch extends AstNode {
  constructor(expr: MExpr, cases: Cases) {
    super();
    
    // TODO
  }
}

export class For extends AstNode {
  constructor(
    z: Expr|BlockOrEmpty,
    f: Expr|BlockOrEmpty,
    s: Expr|BlockOrEmpty,
    t: BlockOrEmpty,
  ) {
    super();
    
    // TODO
  }
}

export class ChalkModule extends AstNode {
  importPaths = new Set<string>();
  path: string|null = null;
  
  members: Map<string, Expr|null> = new Map();
  
  constructor(imports: Imports, defs: DefExprs) {
    super();
    
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
