require('./node_modules/foam3/src/foam_node');

globalThis.assert = function (cond, msg, data) {
    foam.assert(cond, msg);
    if ( ! cond ) {
        console.log('info: ' + JSON.stringify(data));
        throw new Error(msg);
    }
}

foam.require('./node_modules/foam3/src/pom');

const SECTION_TYPES = {
    type: 1,
    func: 3,
    export: 7,
    code: 10
};

foam.CLASS({
    package: 'wasm',
    name: 'Outputter',

    properties: [
        { class: 'Int', name: 'pos' },
        'bufferView'
    ],

    methods: [
        function output (obj) {
            const view = this.bufferView.subarray(this.pos, this.pos + obj.binarySize);
            this.pos += obj.outputWASM(view);
        },
        function outputByte (val) {
            this.bufferView[this.pos++] = val;
        }
    ]
})

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

foam.INTERFACE({
    package: 'wasm',
    name: 'Binary',

    properties: [
        {
            class: 'Int',
            name: 'binarySize'
        }
    ]
});

// rqs
require('./src/wasm/foam/Array.js');
require('./src/wasm/foam/Macro.js');
require('./src/wasm/outputter/Outputter');
require('./src/wasm/outputter/AbstractOutputable');
require('./src/wasm/meta/Mixin');
require('./src/wasm/model/primitive/BinaryValueToOutputter');
require('./src/wasm/model/primitive/IntegerValue');
require('./src/wasm/model/primitive/Byte');
require('./src/wasm/model/primitive/Name');
require('./src/wasm/model/composite/meta/Macro.js');
require('./src/wasm/model/composite/Vector.js');
require('./src/wasm/model/composite/Code.js');
require('./src/wasm/model/composite/Export.js');
require('./src/wasm/model/composite/Expr.js');
require('./src/wasm/model/composite/FunctionType.js');
require('./src/wasm/model/composite/Section.js');
require('./src/wasm/instructions.js');
// end

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
        value: 0,
        bitWidth: 32
    });
    console.log('testVal1 ' + wasm.Debug.buf2hex(testVal1.binaryValue))

    const sec = SECTION_TYPES;

    let testVal2 = foam.json.parse({
        class: 'wasm.Module',
        sections: [
            {
                class: 'wasm.model.composite.Section',
                sectionId: sec.type,
                contents: {
                    class: 'wasm.model.composite.Vector',
                    contents: [
                        {
                            class: 'wasm.model.composite.FunctionType',
                            parameters: { class: 'wasm.model.composite.Vector' },
                            results: {
                                class: 'wasm.model.composite.Vector',
                                contents: [
                                    { class: 'wasm.model.primitive.Byte', value: 0x7F }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                class: 'wasm.model.composite.Section',
                sectionId: sec.func,
                contents: {
                    class: 'wasm.model.composite.Vector',
                    contents: [
                        { class: 'wasm.model.primitive.Byte', value: 0 }
                    ]
                }
            },
            {
                class: 'wasm.model.composite.Section',
                sectionId: sec.export,
                contents: {
                    class: 'wasm.model.composite.Vector',
                    contents: [
                        {
                            class: 'wasm.model.composite.Export',
                            name: 'helloWorld',
                            idxClass: 0, // function
                            idxValue: {
                                class: 'wasm.model.primitive.IntegerValue',
                                value: 0
                            }
                        }
                    ]
                }
            },
            {
                class: 'wasm.model.composite.Section',
                sectionId: sec.code,
                contents: {
                    class: 'wasm.model.composite.Vector',
                    contents: [
                        {
                            class: 'wasm.model.composite.Code',
                            name: 'helloWorld',
                            expr: {
                                class: 'wasm.model.composite.Expr',
                                instructions: [
                                    {
                                        class: 'wasm.ins.ConstInt32',
                                        value: {
                                            class: 'wasm.model.primitive.IntegerValue',
                                            value: 42
                                        }
                                    }
                                    // {
                                    //     class: 'wasm.ins.ConstInt32',
                                    //     value: {
                                    //         class: 'wasm.model.primitive.IntegerValue',
                                    //         value: 42
                                    //     }
                                    // }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    })

    let buffer2 = new ArrayBuffer(testVal2.binarySize);
    buffer2View = new Uint8Array(buffer2);
    testVal2.outputWASM(buffer2View);

    const fs_ = require('fs');
    fs_.writeFileSync('./test.wasm', buffer2View);

    console.log('testVal2 ' + wasm.Debug.buf2hex(buffer2))

}

main();