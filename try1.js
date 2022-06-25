const fs = require('fs');

const main = async function () {
    const wasmBuffer = fs.readFileSync('./test.wasm');
    // const wasmBuffer = fs.readFileSync('./handmade.wasm');
    const wasmModule = await WebAssembly.instantiate(wasmBuffer);
    const { helloWorld } = wasmModule.instance.exports;
    // const { helloWorld, mathyFunc } = wasmModule.instance.exports;
    console.log('' + helloWorld());
    // console.log('' + mathyFunc(10, 2));
}

main();