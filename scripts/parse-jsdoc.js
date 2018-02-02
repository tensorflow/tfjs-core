"use strict";
exports.__esModule = true;
var fs = require("fs");
var ts = require("typescript");
var DOCUMENTATION_DECORATOR = 'doc';
/** Generate documentation for all classes in a set of .ts files */
function generateDocumentation(fileNames, options) {
    var program = ts.createProgram(fileNames, options);
    var checker = program.getTypeChecker();
    var docs = {};
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        if (!sourceFile.isDeclarationFile) {
            ts.forEachChild(sourceFile, visit);
        }
    }
    var json = JSON.stringify(docs, undefined, 2);
    fs.writeFileSync('docs.json', json);
    console.log(json);
    return;
    /** visit nodes finding exported classes */
    function visit(node) {
        if (ts.isMethodDeclaration(node)) {
            if (node.decorators != null) {
                var hasOpdoc_1 = false;
                var headings_1;
                node.decorators.map(function (decorator) {
                    if (startsWith(decorator.getText(), '@' + DOCUMENTATION_DECORATOR)) {
                        // console.log(decorator.getText());
                        ts.forEachChild(decorator, function (child) {
                            //  console.log('child: ' + child.getText());
                            // TODO: Maybe don't use a regex.
                            var re = /doc\('([a-zA-Z ]+)', '([a-zA-Z ]+)'\)/i;
                            headings_1 = child.getText().match(re).slice(1, 3);
                        });
                        hasOpdoc_1 = true;
                        return;
                    }
                });
                if (hasOpdoc_1) {
                    var symbol = checker.getSymbolAtLocation(node.name);
                    var details = serializeSymbol(symbol);
                    var name_1 = node.name.getText();
                    var type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    var callSignatures = type.getCallSignatures().map(serializeSignature)[0];
                    var parameters = callSignatures.parameters.map(function (param) {
                        return {
                            name: param.name,
                            type: param.type,
                            documentation: param.documentation
                        };
                    });
                    var method = {
                        name: name_1,
                        docstring: callSignatures.documentation,
                        parameters: parameters
                    };
                    var heading = headings_1[0], subheading = headings_1[1];
                    if (docs[headings_1[0]] == null) {
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
    function serializeSymbol(symbol) {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    }
    /** Serialize a class symbol information */
    function serializeClass(symbol) {
        var details = serializeSymbol(symbol);
        // Get the construct signatures
        var constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors =
            constructorType.getConstructSignatures().map(serializeSignature);
        return details;
    }
    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }
    function serializeDecorator(decorator) {
        var symbol = checker.getSymbolAtLocation(decorator);
        // const decoratorType =
        //     checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        var details = serializeSymbol(symbol);
        // console.log(details);
        // details.constructors =
        //    decoratorType.getCallSignatures().map(serializeSignature);
        return details;
    }
    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
        return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !==
            0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
}
var tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
generateDocumentation(process.argv.slice(2), tsconfig.compilerOptions);
function startsWith(str, search, pos) {
    if (pos === void 0) { pos = 0; }
    return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
}
