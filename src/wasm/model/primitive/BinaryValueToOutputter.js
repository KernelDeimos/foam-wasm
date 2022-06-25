foam.CLASS({
    package: 'wasm.model.primitive',
    name: 'BinaryValueToOutputter',
    implements: ['wasm.outputter.Outputable'],

    documentation: `
        Convenience model to implement outputWASM and the binarySize property
        on a model that produces its own ArrayBuffer.
    `,

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