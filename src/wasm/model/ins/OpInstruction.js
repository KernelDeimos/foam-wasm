foam.CLASS({
    package: 'wasm.model.ins',
    name: 'OpInstruction',

    documentation: `
        Models an instruction with just an opcode and no operands.
    `,

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
