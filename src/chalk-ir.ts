/*/
  Defines the internal representation of Chalk source code.
/*/

export class Modules {
  modules = new Map<String, Module>();
}

export class Module {
  importPaths = new Set();
  
  linkImports(modules : Modules) {
    // TODO
  }
}

class Destructuring {}

export class ObjectDestructuring extends Destructuring {
  names = new Map<string, string|Destructuring>;
}

export class ArrayTupleDestructuring extends Destructuring {
  names: (String|Destructuring)[] = [];
}
