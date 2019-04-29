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

import * as tf from '../../src/index';
// tf is used in the eval() but not visible to this file so we ignore the unused
// expression.
// tslint:disable-next-line:no-unused-expression
[tf];

const index = path.join(process.cwd(), 'src/index.ts');
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

// Use the same compiler options that we use to compile the library
// here.
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

delete tsconfig.compilerOptions.moduleResolution;
const program = ts.createProgram([index], tsconfig.compilerOptions);

const checker = program.getTypeChecker();

let snippetCount = 0;
async function main() {
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      const children = sourceFile.getChildren();
      for (let i = 0; i < children.length; i++) {
        await visit(children[i]);
      }
    }
  }

  console.log(`Parsed and evaluated ${snippetCount} snippets successfully.`);
}

async function visit(node: ts.Node) {
  const children = node.getChildren();
  for (let i = 0; i < children.length; i++) {
    await visit(children[i]);
  }

  if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) || ts.isInterfaceDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name);
    const jsdoc = getJSDoc(symbol);
    if (jsdoc == null) {
      return;
    }
    // Ignore snippets of methods that have been marked with ignoreCI.
    if (jsdoc['ignoreCI']) {
      return;
    }

    const documentation = symbol.getDocumentationComment(checker);
    if (documentation == null) {
      return;
    }
    for (let i = 0; i < documentation.length; i++) {
      const doc = documentation[i];
      const re = /```js.*?```/gs;
      const matches = re.exec(doc.text);
      if (matches == null) {
        return;
      }

      for (let k = 0; k < matches.length; k++) {
        snippetCount++;

        const match = matches[k];
        const lines = match.split('\n');
        const evalLines: string[] = [];
        for (let j = 0; j < lines.length; j++) {
          let line = lines[j];
          if (line.startsWith('```js')) {
            line = line.substring('```js'.length);
          }
          if (line.endsWith('```')) {
            line = line.substring(0, line.length - '```'.length);
          }
          line = line.trim();
          if (line.startsWith('*')) {
            line = line.substring(1).trim();
          }
          evalLines.push(line);
        }

        const srcCode = evalLines.join('\n');

        const reportError = (e: string|Error) => {
          console.log(symbol.name, jsdoc);
          console.log(srcCode);
          if (e instanceof Error) {
            throw (e);
          }
          throw new Error(e);
        };

        const evalString = '(async function runner() { try { ' + srcCode +
            '} catch (e) { reportError(e); } })()';

        const oldLog = [console.log, console.info];

        // Overrwrite console.log so we don't spam the console.
        console.log = (msg: string) => {};
        console.warn = (msg: string) => {};
        try {
          await eval(evalString).catch((e: Error) => {
            reportError(e);
          });
        } catch (e) {
          reportError(e);
        }
        console.log = oldLog[0];
        console.warn = oldLog[1];
      }
    }
  }
}

interface JSDoc {
  namespace?: string;
  ignoreCI?: boolean;
}

function getJSDoc(symbol: ts.Symbol): JSDoc {
  const tags = symbol.getJsDocTags();
  for (let i = 0; i < tags.length; i++) {
    const jsdocTag = tags[i];
    if (jsdocTag.name === 'doc' && jsdocTag.text != null) {
      const json = convertDocStringToDocInfoObject(jsdocTag.text.trim());
      return json;
    }
  }
  return null;
}

function convertDocStringToDocInfoObject(docString: string): JSDoc {
  const jsonString =
      docString.replace(/([a-zA-Z0-9]+):/g, '"$1":').replace(/\'/g, '"');
  return JSON.parse(jsonString);
}
main();
