foam.CLASS({
    package: 'wasm',
    name: 'Name',
    mixins: ['wasm.Mixin'],
    
    properties: [
        {
            class: 'String',
            name: 'value'
        },
        {
            name: 'binaryStringValue',
            expression: function (value) {
                return new TextEncoder("UTF-8").encode(value);
            }
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.IntegerValue',
            name: 'nameSize',
            expression: function (binaryStringValue) {
                return this.IntegerValue.create({
                    value: binaryStringValue.byteLength
                });
            }
        },
        {
            class: 'Int',
            name: 'binarySize',
            expression: function (binaryStringValue) {
                return binaryStringValue.byteLength + 1;
            }
        }
    ],


    methods: [
        function outputWASM (bufferView) {
            const out = this.Outputter.create({ bufferView });
            out.output(this.nameSize);
            for ( let i = 0 ; i < this.binaryStringValue.byteLength ; i++ ) {
                bufferView[out.pos + i] = this.binaryStringValue[i];
            }
            out.pos += this.binaryStringValue.byteLength;
            this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize])
            return out.pos;
        }
    ],
});
