foam.CLASS({
    package: 'wasm.ins',
    name: 'OpInstruction',

    properties: [
        { class: 'Int', name: 'opcode' },
        { class: 'Int', name: 'binarySize', value: 1 }
    ],

    methods: [
        function outputWASM(bufferView) {
            bufferView[0] = this.opcode;
            return 1;
        }
    ]
})

foam.CLASS({
    package: 'wasm.ins',
    name: 'VariableInstruction',
    extends: 'wasm.ins.OpInstruction',
    mixins: ['wasm.Mixin'],

    properties: [
        {
            class: 'FObjectProperty',
            of: 'wasm.IntegerValue',
            name: 'value',
            preSet: function (_, v) {
                this.assert(() => v?.bitWidth === 32, v);
                return v;
            }
        },
        { class: 'Int', name: 'binarySize', expression: function (value) {
            return value.binarySize + 1;
        } }
    ],
        
    methods: [
        function outputWASM (bufferView) {
            bufferView[0] = this.opcode;
            const out = this.Outputter.create({ bufferView, pos: 1 });
            out.output(this.value);
            this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize]);
            return out.pos;
        }
    ]
})

foam.DEF_MACRO({
    package: 'wasm.ins',
    name: 'InstructionMacro',

    code: function (spec) {
        const properties = [
            { class: 'Int', name: 'opcode', value: spec[0] },
        ];
        const binaryProperties = [];
        for ( const propSpec of spec.slice(2) ) {
            const [name, propType] = propSpec.split(':');
            properties.push({
                ...(
                    propType === 'u32' ? {
                        class: 'FObjectProperty',
                        of: 'wasm.IntegerValue',
                        postSet: function (_, v) {
                            this.assert(() => v?.bitWidth === 32, v);
                            return v;
                        }
                    } : { class: 'Int' }
                ),
                name
            });
            binaryProperties.push(name);
        }

        properties.push({
            class: 'Int',
            name: 'binarySize',
            expression: foam.Function.spoofArgNames(function (...args) {
                let size = 1;
                for ( const arg of args ) {
                    console.log('arg', arg)
                    size += arg.binarySize;
                }
                return size;
            }, binaryProperties)
        });

        let o;
        foam.CLASS(o = {
            package: 'wasm.ins',
            name: spec[1].split('.').map(foam.String.capitalize).join('') +
                'Instruction',
            extends: 'wasm.ins.OpInstruction',
            mixins: ['wasm.Mixin'],

            properties,

            methods: [
                function outputWASM (bufferView) {
                    bufferView[0] = this.opcode;
                    const out = this.Outputter.create({ bufferView, pos: 1 });
                    for ( const p of binaryProperties ) {
                        out.output(this[p]);
                    }
                    this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize]);
                    return out.pos;
                }
            ]
        });
    }
});

foam.APPLY_MACRO("wasm.ins.InstructionMacro", [
    [0x20, 'local.get', 'idx:u32'],
    [0x21, 'local.set', 'idx:u32'],
    [0x22, 'local.tee', 'idx:u32'],
    [0x23, 'global.get', 'idx:u32'],
    [0x24, 'global.set', 'idx:u32'],
]);

foam.CLASS({
    package: 'wasm.ins',
    name: 'ConstInt32',
    mixins: ['wasm.Mixin'],

    'meta.wasm.name': 'int32.const',

    properties: [
        {
            class: 'FObjectProperty',
            of: 'wasm.IntegerValue',
            name: 'value',
            preSet: function (_, v) {
                this.assert(() => v?.bitWidth === 32, v);
                return v;
            }
        },
        {
            class: 'Int',
            name: 'binarySize',
            value: 2
        }
    ],

    methods: [
        function outputWASM (bufferView) {
            bufferView[0] = 0x41;
            const out = this.Outputter.create({ bufferView, pos: 1 });
            out.output(this.value);
            this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize]);
            return out.pos;
        }
    ]

});
