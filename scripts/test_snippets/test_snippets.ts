/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const index = path.join(process.cwd(), 'src/index.ts');
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
console.log(index);

// Use the same compiler options that we use to compile the library
// here.
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

delete tsconfig.compilerOptions.moduleResolution;
// Build a program using the set of root file names in fileNames
const program = ts.createProgram([index], tsconfig.compilerOptions);

// Get the checker, we will use it to find more about classes
const checker = program.getTypeChecker();

// Visit every sourceFile in the program
for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    // Walk the tree to search for classes
    ts.forEachChild(sourceFile, visit);
  }
}

/** visit nodes finding exported classes */
function visit(node: ts.Node) {
  if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) || ts.isInterfaceDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name);
    const documentation = symbol.getDocumentationComment(checker);
    if (documentation == null) {
      return;
    }
    documentation.forEach(doc => {
      const re = /```js.*```/gs;
      const matches = re.exec(doc.text);
      if (matches == null) {
        return;
      }
      matches.forEach(match => {
        const lines = match.split('\n');
        console.log('-------------');
        lines.forEach(line => {
          console.log(line);
        });
        console.log('...............');
      });
    });
  }
}
