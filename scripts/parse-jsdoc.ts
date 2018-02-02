import * as fs from 'fs';
import * as ts from 'typescript';

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
}

interface DocMethod {
  name: string;
  docstring: string;
  parameters: DocMethodParam[];
}

interface DocMethodParam {
  name: string;
  type: string;
  documentation: string;
}

const DOCUMENTATION_DECORATOR = 'doc';

/** Generate documentation for all classes in a set of .ts files */
function generateDocumentation(
    fileNames: string[], options: ts.CompilerOptions): void {
  const program = ts.createProgram(fileNames, options);
  const checker = program.getTypeChecker();

  const docs = {};

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      ts.forEachChild(sourceFile, visit);
    }
  }

  const json = JSON.stringify(docs, undefined, 2);
  fs.writeFileSync('docs.json', json);
  console.log(json);

  return;

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    if (ts.isMethodDeclaration(node)) {
      if (node.decorators != null) {
        let hasOpdoc = false;
        let headings: string[];
        node.decorators.map(decorator => {
          if (startsWith(decorator.getText(), '@' + DOCUMENTATION_DECORATOR)) {
            // console.log(decorator.getText());
            ts.forEachChild(decorator, child => {
              //  console.log('child: ' + child.getText());
              // TODO: Maybe don't use a regex.
              const re = /doc\('([a-zA-Z ]+)', '([a-zA-Z ]+)'\)/i;
              headings = child.getText().match(re).slice(1, 3);
            });

            hasOpdoc = true;
            return;
          }
        });

        if (hasOpdoc) {
          const symbol = checker.getSymbolAtLocation(node.name);
          const details = serializeSymbol(symbol);

          const name = node.name.getText();

          const type = checker.getTypeOfSymbolAtLocation(
              symbol, symbol.valueDeclaration!);
          const callSignatures =
              type.getCallSignatures().map(serializeSignature)[0];

          const parameters: DocMethodParam[] =
              callSignatures.parameters.map(param => {
                return {
                  name: param.name,
                  type: param.type,
                  documentation: param.documentation
                };
              });
          const method: DocMethod = {
            name,
            docstring: callSignatures.documentation,
            parameters
          };

          const [heading, subheading] = headings;

          if (docs[headings[0]] == null) {
            docs[heading] = {};
          }
          if (docs[heading][subheading] == null) {
            docs[heading][subheading] = [];
          }

          docs[heading][subheading].push(method);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol): DocEntry {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(
          checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol: ts.Symbol) {
    const details = serializeSymbol(symbol);

    // Get the construct signatures
    const constructorType =
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    details.constructors =
        constructorType.getConstructSignatures().map(serializeSignature);
    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation:
          ts.displayPartsToString(signature.getDocumentationComment())
    };
  }

  function serializeDecorator(decorator: ts.Decorator) {
    const symbol = checker.getSymbolAtLocation(decorator);
    // const decoratorType =
    //     checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
    const details = serializeSymbol(symbol);
    // console.log(details);
    // details.constructors =
    //    decoratorType.getCallSignatures().map(serializeSignature);
    return details;
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !==
        0 ||
        (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
  }
}

const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
generateDocumentation(process.argv.slice(2), tsconfig.compilerOptions);

function startsWith(str, search, pos = 0) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
}
