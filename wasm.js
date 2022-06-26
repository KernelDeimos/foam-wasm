require('./node_modules/foam3/src/foam_node');

globalThis.assert = function (cond, msg, data) {
    foam.assert(cond, msg);
    if ( ! cond ) {
        console.log('info: ' + JSON.stringify(data));
        throw new Error(msg);
    }
}

foam.require('pom')

const SECTION_TYPES = {
    type: 1,
    func: 3,
    export: 7,
    code: 10
};

foam.LIB({
    name: 'wasm.Debug',
    methods: [
        // shamelessy copied from SO#40031688
        function buf2hex(buffer) {
            return [...new Uint8Array(buffer)]
                .map(x => x.toString(16).padStart(2, '0'))
                .join(' ');
        }
    ]
});

foam.CLASS({
    package: 'wasm',
    name: 'Module',

    constants: {
        MAGIC: [0x00, 0x61, 0x73, 0x6D],
        VERSION: [0x01, 0x00, 0x00, 0x00],
    },

    properties: [
        {
            class: 'FObjectArray',
            of: 'wasm.model.composite.Section',
            name: 'sections'
        },
        {
            class: 'Int',
            name: 'binarySize',
            expression: function (sections) {
                size = 8;
                for ( const section of sections ) {
                    size += section.binarySize;
                }
                return size;
            }
        }
    ],

    methods: [
        function outputWASM(bufferView) {
            let top = [...this.MAGIC, ...this.VERSION];
            let pos = 0;
            for ( ; pos < top.length ; pos++ ) bufferView[pos] = top[pos];
            for ( let section of this.sections ) {
                const sectionBuffer = bufferView.subarray(pos, pos + section.binarySize);
                section.outputWASM(sectionBuffer);
                pos += section.binarySize;
            }
        }
    ]
});


const main = async function () {
    let testVal1 = wasm.model.primitive.IntegerValue.create({
        signed: false,
        value: 127,
        bitWidth: 32
    });
    console.log('testVal1 ' + wasm.Debug.buf2hex(testVal1.binaryValue))

    const sec = SECTION_TYPES;

    const [argv, x, flags] = require('./node_modules/foam3/tools/processArgs.js')(
        '',
        { input: 'example.json5' },
        {}
    );

    const fs_ = require('fs');
    const path_ = require('path');
    const json5_ = require('json5');
    const data = json5_.parse(fs_.readFileSync(path_.resolve(x.input)));

    let testVal2 = foam.json.parse(data)

    let buffer2 = new ArrayBuffer(testVal2.binarySize);
    buffer2View = new Uint8Array(buffer2);
    testVal2.outputWASM(buffer2View);

    fs_.writeFileSync('./example.wasm', buffer2View);

    console.log('testVal2 ' + wasm.Debug.buf2hex(buffer2))

}

main();