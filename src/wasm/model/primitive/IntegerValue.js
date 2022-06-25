foam.CLASS({
    package: 'wasm.model.primitive',
    name: 'IntegerValue',
    mixins: ['wasm.model.primitive.BinaryValueToOutputter'],

    documentation: `
        Implements LEB128 variable-length integer encoding.
    `,

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
