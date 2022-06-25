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

foam.CLASS({
    package: 'wasm',
    name: 'Mixin',

    requires: [
        'wasm.Outputter',
        'wasm.IntegerValue'
    ],

    methods: [
        function assert(cond, data, msg) {
            if ( typeof cond === 'function' ) {
                if ( ! msg ) msg = cond.toString();
                else msg += ' ' + cond.toString();
                cond = cond();
            }
            if ( ! cond ) {
                console.log(`Assertion failed (${this.cls_.id}): ${msg}; ` +
                    foam.json.stringify(data));
                throw new Error(msg);
            }
        }
    ]
});

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
    name: 'BinaryValueToOutputter',

    properties: [
        'binaryValue',
        {
            class: 'Int',
            name: 'binarySize',
            getter: function () {
                return this.binaryValue.byteLength;
            }
        }
    ],

    methods: [
        function outputWASM (dstBufferView) {
            const srcBufferView = this.binaryValue instanceof ArrayBuffer
                ? new Uint8Array(this.binaryValue)
                : this.binaryValue;
            for ( let i = 0 ; i < this.binarySize ; i++ ) {
                dstBufferView[i] = srcBufferView[i];
            }
            return this.binarySize;
        }
    ]
});

foam.CLASS({
    package: 'wasm',
    name: 'IntegerValue',
    mixins: ['wasm.BinaryValueToOutputter'],

    properties: [
        {
            class: 'Int',
            name: 'value'
        },
        {
            class: 'Boolean',
            name: 'signed'
        },
        {
            class: 'Int',
            name: 'bitWidth',
            value: 32
        },
        {
            name: 'binaryValue',
            expression: function (value, signed) {
                const buffer = new ArrayBuffer(Math.ceil(this.bitWidth / 7));
                const bufferView = new Uint8Array(buffer);
                let nBytes = 0;
                while ( value !== 0 ) {
                    bufferView[nBytes] = value & 0x7F;
                    value = value >>> 7;
                    nBytes++;
                }
                if ( nBytes == 0 ) nBytes = 1;
                for ( let i = 0 ; i < nBytes - 1 ; i++ ) {
                    bufferView[i] = bufferView[i] | 0x80;
                }
                return buffer.slice(0, nBytes);
            }
        }
    ],
})

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

foam.CLASS({
    package: 'wasm',
    name: 'Vector',
    mixins: ['wasm.Mixin'],
    requires: ['wasm.IntegerValue'],

    properties: [
        {
            class: 'FObjectArray',
            of: 'foam.core.FObject',
            name: 'contents'
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.IntegerValue',
            name: 'vectorSize',
            getter: function () {
                return this.IntegerValue.create({
                    value: this.contents.length
                });
            }
        },
        {
            class: 'Int',
            name: 'binarySize',
            expression: function (vectorSize, contents) {
                let size = vectorSize.binarySize;
                for ( const item of this.contents ) {
                    size += item.binarySize;
                }
                return size;
            }
        }
    ],

    methods: [
        function outputWASM(bufferView) {
            let pos = 0;
            const output = (obj) => {
                const view = bufferView.subarray(pos, pos + obj.binarySize);
                pos += obj.outputWASM(view);
                console.log(obj.cls_.name, '' + pos)
            };
            output(this.vectorSize);
            for ( const item of this.contents ) {
                output(item);
            }
            this.assert(() => pos == this.binarySize, [pos, this.binarySize])
            return pos;
        }
    ]
});

// rqs
require('./src/wasm/model.js');
require('./src/wasm/meta/macros');
require('./src/wasm/meta/AbstractOutputable');
require('./src/wasm/FunctionType.js');
require('./src/wasm/Byte.js');
require('./src/wasm/Name.js');
require('./src/wasm/Export.js');
require('./src/wasm/Code.js');
require('./src/wasm/Expr.js');
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
            of: 'wasm.Section',
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

foam.APPLY_MACRO('wasm.meta.Outputable', {
    id: 'wasm.Section',
    seq: [
        'Byte', { name: 'sectionId' },
        'FObject', {
            of: 'wasm.IntegerValue',
            name: 'sectionSize',
            getter: function () {
                return this.IntegerValue.create({
                    value: this.contents.binarySize
                });
            }
        },
        'FObject', {
            name: 'contents'
        },
    ]
});

const main = async function () {
    let testVal1 = wasm.IntegerValue.create({
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
                class: 'wasm.Section',
                sectionId: sec.type,
                contents: {
                    class: 'wasm.Vector',
                    contents: [
                        {
                            class: 'wasm.FunctionType',
                            parameters: { class: 'wasm.Vector' },
                            results: {
                                class: 'wasm.Vector',
                                contents: [
                                    { class: 'wasm.Byte', value: 0x7F }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                class: 'wasm.Section',
                sectionId: sec.func,
                contents: {
                    class: 'wasm.Vector',
                    contents: [
                        { class: 'wasm.Byte', value: 0 }
                    ]
                }
            },
            {
                class: 'wasm.Section',
                sectionId: sec.export,
                contents: {
                    class: 'wasm.Vector',
                    contents: [
                        {
                            class: 'wasm.Export',
                            name: 'helloWorld',
                            idxClass: 0, // function
                            idxValue: {
                                class: 'wasm.IntegerValue',
                                value: 0
                            }
                        }
                    ]
                }
            },
            {
                class: 'wasm.Section',
                sectionId: sec.code,
                contents: {
                    class: 'wasm.Vector',
                    contents: [
                        {
                            class: 'wasm.Code',
                            name: 'helloWorld',
                            expr: {
                                class: 'wasm.Expr',
                                instructions: [
                                    {
                                        class: 'wasm.ins.ConstInt32',
                                        value: {
                                            class: 'wasm.IntegerValue',
                                            value: 42
                                        }
                                    }
                                    // {
                                    //     class: 'wasm.ins.ConstInt32',
                                    //     value: {
                                    //         class: 'wasm.IntegerValue',
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