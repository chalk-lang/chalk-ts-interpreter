/*/
  Defines the internal representation of Chalk source code.
/*/

export class Modules {
  modules = new Map<String, Module>();
}

export class Module {
  importPaths = new Set();
  path: string;
  
  members: Map<string, Value> = new Map();
  
  constructor(path: string) {
    this.path = path;
  }
  
  addMember(name: string, member: Expr) {
    // TODO
  }
  
  linkImports(modules: Modules) {
    // TODO
  }
}

export class Class {
  name: string;
}

export class Function {
  name: string;
  body: Expr[];
}

type Expr = Destructuring;

type Destructuring = ObjectLiteral | ArrayLiteral | TupleLiteral;

export class ObjectLiteral {
  names = new Map<string, string|Destructuring>();
}

export class ArrayLiteral {
  names: (String|Destructuring)[] = [];
}

export class TupleLiteral {
  names: (String|Destructuring)[] = [];
}
