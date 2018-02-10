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
import * as ts from 'typescript';

// tslint:disable-next-line:max-line-length
import {DocClass, DocFunction, DocHeading, Docs, DocSubheading} from '../api/view';

const GITHUB_ROOT = 'https://github.com/PAIR-code/deeplearnjs/';

// Mirrors the info argument to @doc in decorators.ts.
export interface DocInfo {
  heading: string;
  subheading: string;
  namespace?: string;
  subclasses?: string[];
}

export function getDocDecorator(node: ts.Node, decoratorName: string): DocInfo {
  let docInfo: DocInfo;
  if (node.decorators != null) {
    docInfo = parseDocDecorators(node.decorators, decoratorName);
  }
  return docInfo;
}

/**
 * Parses the @doc annotation and returns the typed DocInfo object.
 */
export function parseDocDecorators(
    decorators: ts.NodeArray<ts.Decorator>, decoratorName: string): DocInfo {
  let docInfo: DocInfo = null;
  decorators.map(decorator => {
    const decoratorStr = decorator.getText();
    if (decoratorStr.startsWith(decoratorName)) {
      const decoratorConfigStr = decoratorStr.substring(decoratorName.length);
      docInfo = eval(decoratorConfigStr);
      if (docInfo.subheading == null) {
        docInfo.subheading = '';
      }
    }
  });
  return docInfo;
}

export function addSubclassMethods(
    docHeadings: DocHeading[],
    subclassMethodMap: {[subclass: string]: DocFunction[]}) {
  const subclasses = Object.keys(subclassMethodMap);
  subclasses.forEach(subclass => {
    const methods = subclassMethodMap[subclass];
    // Find the class.
    for (let i = 0; i < docHeadings.length; i++) {
      const heading = docHeadings[i];
      for (let j = 0; j < heading.subheadings.length; j++) {
        const subheading = heading.subheadings[j];
        for (let k = 0; k < subheading.symbols.length; k++) {
          const symbol = subheading.symbols[k];
          if (symbol['isClass'] != null && symbol.symbolName === subclass) {
            const classSymbol = symbol as DocClass;
            methods.forEach(method => classSymbol.methods.push(method));
          }
        }
      }
    }
  });
}

// Parse the file info, github URL and filename from a node.
export function getFileInfo(
    node: ts.Node, sourceFile: ts.SourceFile, repoPath: string,
    srcRoot: string): {displayFilename: string, githubUrl: string} {
  // Line numbers are 0-indexed.
  const startLine =
      sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
  const endLine =
      sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1;
  const fileName = sourceFile.fileName.substring(repoPath.length + '/'.length);
  const displayFilename = fileName.substring(srcRoot.length) + '#' + startLine;

  const githubUrl =
      `${GITHUB_ROOT}blob/master/${fileName}#L${startLine}-L${endLine}`;
  return {displayFilename, githubUrl};
}

// Given a newly seen docInfo from a @doc annotation, fill in headings /
// subheadings and return the subheading.
export function fillHeadingsAndGetSubheading(
    docInfo: DocInfo, docHeadings: DocHeading[]): DocSubheading {
  // Find the heading.
  let heading: DocHeading;
  for (let i = 0; i < docHeadings.length; i++) {
    if (docHeadings[i].name === docInfo.heading) {
      heading = docHeadings[i];
    }
  }
  if (heading == null) {
    heading = {name: docInfo.heading, description: '', subheadings: []};
    docHeadings.push(heading);
  }

  // Find the subheading.
  let subheading: DocSubheading;
  for (let i = 0; i < heading.subheadings.length; i++) {
    if (heading.subheadings[i].name === docInfo.subheading) {
      subheading = heading.subheadings[i];
    }
  }
  if (subheading == null) {
    subheading = {name: docInfo.subheading, symbols: []};
    heading.subheadings.push(subheading);
  }
  if (subheading.symbols == null) {
    subheading.symbols = [];
  }
  return subheading;
}

export function computeStatistics(docs: Docs):
    {headingsCount: number, subheadingsCount: number, methodCount: number} {
  let subheadingsCount = 0;
  let methodCount = 0;
  for (let i = 0; i < docs.headings.length; i++) {
    const heading = docs.headings[i];
    subheadingsCount += heading.subheadings.length;
    for (let j = 0; j < heading.subheadings.length; j++) {
      methodCount += heading.subheadings[j].symbols.length;
    }
  }
  return {headingsCount: docs.headings.length, subheadingsCount, methodCount};
}

// Sorts the doc headings.
export function sortMethods(docHeadings: DocHeading[]) {
  // Sort the methods by name.
  for (let i = 0; i < docHeadings.length; i++) {
    const heading = docHeadings[i];
    for (let j = 0; j < heading.subheadings.length; j++) {
      const subheading = heading.subheadings[j];

      // Pin the symbols in order of the pins.
      const pinnedSymbols = [];
      if (subheading.pin != null) {
        subheading.pin.forEach(pinnedSymbolName => {
          // Loop backwards so we remove symbols.
          for (let k = subheading.symbols.length - 1; k >= 0; k--) {
            const symbol = subheading.symbols[k];
            if (symbol.displayName === pinnedSymbolName) {
              pinnedSymbols.push(symbol);
              subheading.symbols.splice(k, 1);
            }
          }
        });
      }

      // Sort non-pinned symbols by name.
      subheading.symbols.sort((a, b) => {
        if (a.displayName < b.displayName) {
          return -1;
        } else if (a.displayName > b.displayName) {
          return 1;
        }
        return 0;
      });

      subheading.symbols = pinnedSymbols.concat(subheading.symbols);
    }
  }
}

// Returns display names like 'dl.train.Optimizer'.
export function getDisplayName(docInfo: DocInfo, name: string) {
  return (docInfo.namespace != null ? docInfo.namespace + '.' : '') + name;
}

export function kind(node: ts.Node): string {
  const keys = Object.keys(ts.SyntaxKind);
  for (let i = 0; i < keys.length; i++) {
    if (ts.SyntaxKind[keys[i]] === node.kind) {
      return keys[i];
    }
  }
}

export function isStatic(node: ts.MethodDeclaration): boolean {
  let isStatic = false;
  node.forEachChild(child => {
    if (child.kind === ts.SyntaxKind.StaticKeyword) {
      isStatic = true;
    }
  });
  return isStatic;
}

/**
 * Gets a doc alias, e.g. @docalias, from a interface / type alias.
 */
export function getDocAlias(
    checker: ts.TypeChecker,
    node: ts.InterfaceDeclaration|ts.TypeAliasDeclaration,
    docTypeAlias: string) {
  const symbol = checker.getSymbolAtLocation(node.name);
  const docs = symbol.getDocumentationComment();
  return getJsDocTag(symbol, docTypeAlias);
}

/**
 * Finds a jsdoc tag by a given tag name for a symbol. e.g. @docalias number[]
 * => number[].
 */
export function getJsDocTag(symbol: ts.Symbol, tag: string): string {
  const tags = symbol.getJsDocTags();
  for (let i = 0; i < tags.length; i++) {
    const jsdocTag = tags[i];
    if (jsdocTag.name === tag) {
      return jsdocTag.text;
    }
  }
}

/**
 * Converts a function parameter symbol to its string type value.
 */
export function parameterTypeToString(
    checker: ts.TypeChecker, symbol: ts.Symbol,
    identifierGenericMap: {[identifier: string]: string}): string {
  const valueDeclaration = symbol.valueDeclaration;
  let typeStr = checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!));

  if (typeStr === 'any' && valueDeclaration != null &&
      (valueDeclaration as any).type != null &&
      ts.isUnionTypeNode((valueDeclaration as any).type)) {
    // tslint:disable-next-line:no-any
    const valueDeclarationType = (valueDeclaration as any).type;

    // If 'any' comes out of the typeToString method, and this is a deep union
    // type, try to parse out each of the unions manually. For some reason te
    // typescript compiler returns "any" for complex union types, e.g.
    // TypedArray|number|number[]|number[][]...
    const types = [];

    if (valueDeclarationType.types != null) {
      valueDeclarationType.types.forEach(
          type => types.push(
              sanitizeTypeString(type.getText(), identifierGenericMap)));
    }

    return types.join(' | ');
  } else {
    typeStr = sanitizeTypeString(typeStr, identifierGenericMap);

    return typeStr;
  }
}

/**
 * Sanitizes a type string by removing generics and replacing generics.
 *   e.g. Tensor<R> => Tensor
 *   e.g. T => Tensor
 */
export function sanitizeTypeString(
    typeString: string, identifierGenericMap: {[identifier: string]: string}) {
  // If the return type is part of the generic map, use the mapped
  // type. For example, <T extends Tensor> will replace "T" with
  // "Tensor".
  if (identifierGenericMap[typeString] != null) {
    typeString = identifierGenericMap[typeString];
  }

  // Remove generics.
  typeString = removeGenerics(typeString);
  return typeString;
}

// Remove generics from a string. e.g. Tensor<R> => Tensor.
export function removeGenerics(typeStr: string) {
  return typeStr.replace(/(<.*>)/, '');
}
/**
 * Computes a mapping of identifier to their generic type. For example:
 *   method<T extends Tensor>() {}
 * In this example, this method will return {'T': 'Tensor'}.
 */
export function getIdentifierGenericMap(node: ts.MethodDeclaration):
    {[generic: string]: string} {
  const identifierGenericMap = {};
  let identifier;
  let generic;
  node.forEachChild(child => {
    if (ts.isTypeParameterDeclaration(child)) {
      child.forEachChild(cc => {
        if (ts.isTypeNode(cc)) {
          generic = cc.getText();
        } else if (ts.isIdentifier(cc)) {
          identifier = cc.getText();
        }
      });
    }
  });
  if (identifier != null && generic != null) {
    identifierGenericMap[identifier] = generic;
  }
  return identifierGenericMap;
}

/**
 * Iterate over all functions in the docs.
 */
export function foreachDocFunction(
    docHeadings: DocHeading[], fn: (docFunction: DocFunction) => void) {
  docHeadings.forEach(heading => {
    heading.subheadings.forEach(subheading => {
      subheading.symbols.forEach(untypedSymbol => {
        if (untypedSymbol['isClass']) {
          const symbol = untypedSymbol as DocClass;
          symbol.methods.forEach(method => {
            fn(method);
          });
        } else {
          fn(untypedSymbol as DocFunction);
        }
      });
    });
  });
}

/**
 * Replace all types with their aliases. e.g. ShapeMap[R2] => number[]
 */
export function replaceDocTypeAliases(
    docHeadings: DocHeading[], docTypeAliases: {[type: string]: string}) {
  foreachDocFunction(docHeadings, docFunction => {
    docFunction.parameters.forEach(param => {
      Object.keys(docTypeAliases).forEach(type => {
        if (param.type.indexOf(type) !== -1) {
          const re = new RegExp(type + '(\\[.*\\])?', 'g');
          param.type = param.type.replace(re, docTypeAliases[type]);
        }
      });
    });
  });
}
