// Entry point of the interpreter.

import { promises } from "fs";
import * as Path from "path";

import { parse } from "./parser";
import { ChalkModule } from "./chalk-ir";
import { tokenizer } from "./tokenizer";

class Main {
  modules: Map<string, ChalkModule> = new Map();
  loadingPaths = new Map<string, Promise<unknown>>();
  
  constructor({ mainPath }: { mainPath: string }) {
    const path = Path.normalize(mainPath);
    
    if (path[0] === ".") throw new Error("Cannot import path \"" + path);
    
    /*nowait*/ this.loadModule(path);
  }
  
  async loadModule(path: string) {
    const ext = Path.extname(path);
    const obj: { [key: string]: { symbol: string, isDoc: boolean } } =
      { ".ch": { symbol: "ChalkModule", isDoc: false },
        ".chdoc": { symbol: "ChalkDocModule", isDoc: true },
      };
    
    if (!obj[ext]) throw new Error("Unknown extension \"" + ext + "\" of file: "
      + path);
    
    if (this.loadingPaths.has(path)) return this.loadingPaths.get(path);
    
    const promise = promises.readFile(path, "utf8");
    
    this.loadingPaths.set(path, promise);
    
    const module = parse(
      tokenizer(await promise, obj[ext].isDoc),
      obj[ext].symbol,
    ).setPath(path);
    
    this.modules.set(path, module);
    
    await Promise.all([ ...module.importPaths ].map(
      path => this.loadModule(path),
    ));
  }
}

if (!process.argv[2]) throw new Error("Argument expected (program entry point)");

new Main({ mainPath: process.argv[2] });
