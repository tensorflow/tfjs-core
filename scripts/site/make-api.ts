/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

// To run this script, use make-api.sh.
import * as fs from 'fs';
import * as mustache from 'mustache';
import * as ts from 'typescript';
import {DocHeading, DocMethod, DocMethodParam, Docs, DocSubheading} from './view-api';
var argv = require('minimist')(process.argv.slice(2));

const DOCUMENTATION_DECORATOR = 'doc';
const API_TEMPLATE_PATH = './website/api/index.html';
const SRC_ROOT = 'src/';
const PROGRAM_ROOT = SRC_ROOT + 'index.ts';
const GITHUB_ROOT = 'https://github.com/PAIR-code/deeplearnjs/';

if (argv.htmlOutPath == null) {
  throw new Error(
      `No htmlOutPath provided. Please provide an output path with --htmlOutPath.`);
}
if (argv.rootPath == null) {
  throw new Error(
      `No rootPath provided. Please provide a github root path with --rootPath.`);
}
const htmlOutPath = argv.htmlOutPath;
const rootPath = argv.rootPath;

// Initialize the doc headings so we control sort order.
const docHeadings: DocHeading[] = [
  {
    name: 'Tensors',
    subheadings: [
      {name: 'Creation'}, {name: 'Transformations'},
      {name: 'Slicing and Joining'}
    ]
  },
  {
    name: 'Operations',
    subheadings: [
      {name: 'Arithmetic'}, {name: 'Basic math'}, {name: 'Matrices'},
      {name: 'Convolution'}, {name: 'Reduction'}, {name: 'Normalization'},
      {name: 'Images'}, {name: 'RNN'}, {name: 'Classification'},
      {name: 'Logical'}
    ]
  }
];

// Use the same compiler options that we use to compile the library here.
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

console.log(`Parsing AST from program root ${PROGRAM_ROOT}`);
const program = ts.createProgram([PROGRAM_ROOT], tsconfig.compilerOptions);
const checker = program.getTypeChecker();

// Visit all the nodes that are transitively linked from the source root.
for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    ts.forEachChild(sourceFile, node => visitNode(node, sourceFile));
  }
}

const docs: Docs = {
  headings: docHeadings
};

// Write the HTML.
const mustacheTemplate = fs.readFileSync(API_TEMPLATE_PATH, 'utf8');
const html = mustache.render(mustacheTemplate, docs);
fs.writeFileSync(htmlOutPath, html);

const {headingsCount, subheadingsCount, methodCount} = computeStatistics(docs);
console.log(
    `API reference written to ${htmlOutPath}\n` +
    `Found: \n` +
    `  ${docHeadings.length} headings\n` +
    `  ${subheadingsCount} subheadings\n` +
    `  ${methodCount} methods`);

function visitNode(node: ts.Node, sourceFile: ts.SourceFile) {
  if (ts.isMethodDeclaration(node)) {
    if (node.decorators != null) {
      let hasOpdoc = false;
      let headingNames: string[];
      node.decorators.map(decorator => {
        if (decorator.getText().startsWith('@' + DOCUMENTATION_DECORATOR)) {
          ts.forEachChild(decorator, child => {
            // Parse out the parameters to the decorator.
            // TODO: Don't use a regex.
            headingNames = child.getText()
                               .match(/doc\('([a-zA-Z ]+)', '([a-zA-Z ]+)'\)/i)
                               .slice(1, 3);
          });

          hasOpdoc = true;
          return;
        }
      });

      if (hasOpdoc) {
        const methodName = node.name.getText();
        const [headingName, subheadingName] = headingNames;

        const docMethod = serializeMethod(methodName, node, sourceFile);

        // Find the heading.
        let heading: DocHeading;
        for (let i = 0; i < docHeadings.length; i++) {
          if (docHeadings[i].name === headingName) {
            heading = docHeadings[i];
          }
        }
        if (heading == null) {
          heading = {name: headingName, subheadings: []};
          docHeadings.push(heading);
        }

        // Find the subheading.
        let subheading: DocSubheading;
        for (let i = 0; i < heading.subheadings.length; i++) {
          if (heading.subheadings[i].name === subheadingName) {
            subheading = heading.subheadings[i];
          }
        }
        if (subheading == null) {
          subheading = {name: subheadingName, methods: []};
          heading.subheadings.push(subheading);
        }
        if (subheading.methods == null) {
          subheading.methods = [];
        }

        subheading.methods.push(docMethod);
      }
    }
  }

  ts.forEachChild(node, node => visitNode(node, sourceFile));
}

function serializeParameter(symbol: ts.Symbol): DocMethodParam {
  return {
    name: symbol.getName(),
    documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
    type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
  };
}

function serializeMethod(
    name: string, node: ts.MethodDeclaration,
    sourceFile: ts.SourceFile): DocMethod {
  const symbol = checker.getSymbolAtLocation(node.name);
  const type =
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
  const signature = type.getCallSignatures()[0];

  if (!sourceFile.fileName.startsWith(rootPath)) {
    throw new Error(
        `Error: source file ${sourceFile.fileName} ` +
        `does not start with srcPath provided ${rootPath}.`);
  }
  const fileName = sourceFile.fileName.substring(rootPath.length);
  // Line numbers are 0-indexed.
  const lineNumber =
      sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;

  const githubUrl = `${GITHUB_ROOT}blob/master${fileName}#L${lineNumber}`;
  return {
    name,
    parameters: signature.parameters.map(serializeParameter),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(signature.getDocumentationComment()),
    fileName,
    githubUrl
  };
}

function computeStatistics(docs: Docs):
    {headingsCount: number, subheadingsCount: number, methodCount: number} {
  let subheadingsCount = 0;
  let methodCount = 0;
  for (let i = 0; i < docs.headings.length; i++) {
    const heading = docs.headings[i];
    subheadingsCount += heading.subheadings.length;
    for (let j = 0; j < heading.subheadings.length; j++) {
      methodCount += heading.subheadings[j].methods.length;
    }
  }
  return {headingsCount: docs.headings.length, subheadingsCount, methodCount};
}
