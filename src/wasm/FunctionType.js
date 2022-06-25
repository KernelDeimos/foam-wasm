foam.CLASS({
    package: 'wasm',
    name: 'FunctionType',

    mixins: ['wasm.Mixin'],

    properties: [
        {
            class: 'Int',
            name: 'binarySize',
            getter: function () {
                let size = 1;
                size += this.parameters.binarySize;
                size += this.results.binarySize;
                return size;
            }
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.Vector',
            name: 'parameters'
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.Vector',
            name: 'results'
        }
    ],

    methods: [
        function outputWASM(bufferView) {
            bufferView[0] = 0x60;
            let pos = 1;
            const output = (obj) => {
                const view = bufferView.subarray(pos, pos + obj.binarySize);
                pos += obj.outputWASM(view);
            };
            output(this.parameters);
            output(this.results);
            this.assert(() => pos == this.binarySize, [pos, this.binarySize])
            return pos;
        }
    ]
});
