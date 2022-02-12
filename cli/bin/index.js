#! /usr/bin/env node

const cli_scope = require('./scope.js');
const fun = require('./fun.js');

const yargs = require('yargs');

async function main() {
    let scope = await cli_scope.scope(yargs.argv._[0]);
    let res = await fun.switch_fun(scope, yargs.argv);
    console.log("\nStatus code: " + res);
}

main();