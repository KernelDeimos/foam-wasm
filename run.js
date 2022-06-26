const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);

const main = async function () {
    if ( argv.length < 1 ) {
        argv.push('example.wasm');
    }
    const wasmBuffer = fs.readFileSync(path.resolve(argv[0]));
    const wasmModule = await WebAssembly.instantiate(wasmBuffer);
    const { helloWorld } = wasmModule.instance.exports;
    console.log('' + helloWorld());
}

main();
