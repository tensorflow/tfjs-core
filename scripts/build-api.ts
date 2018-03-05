import * as path from 'path';
import * as shell from 'shelljs';

const targetScriptPath = './node_modules/deeplearn-docs/src/make-api.ts';

const input = path.resolve('./src/index.ts');
const pkg = path.resolve('./package.json');
const src = path.resolve('./src/');
const repo = path.resolve('./');
const bundle = path.resolve('./dist/deeplearn.js');
const github = 'https://github.com/PAIR-code/deeplearnjs';

const out = path.resolve('./api-dist/deeplearn.json');

// tslint:disable-next-line:max-line-length
shell.exec(`ts-node ${targetScriptPath} --in ${input} --package ${pkg} --src ${
    src} --bundle ${bundle} --github ${github} --out ${out} --repo ${repo}`);
