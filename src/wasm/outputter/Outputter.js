foam.CLASS({
    package: 'wasm.outputter',
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

foam.INTERFACE({
    package: 'wasm.outputter',
    name: 'Outputable',

    properties: [
        { class: 'Int', name: 'binarySize' }
    ],

    methods: [
        {
            name: 'outputWASM',
            args: [
                {
                    type: 'Uint8Array',
                    name: 'bufferView'
                }
            ]
        }
    ]
})
