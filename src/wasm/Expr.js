foam.CLASS({
    package: 'wasm',
    name: 'Expr',
    mixins: ['wasm.Mixin'],

    properties: [
        {
            class: 'FObjectArray',
            of: 'FObject',
            name: 'instructions'
        },
        {
            class: 'Int',
            name: 'binarySize',
            expression: function (instructions) {
                let size = 0;
                for ( const ins of this.instructions ) size += ins.binarySize;
                return size + 1;
            }
        }
    ],

    methods: [
        function outputWASM (bufferView) {
            const out = this.Outputter.create({ bufferView });
            for ( let ins of this.instructions ) {
                out.output(ins);
            }
            bufferView[out.pos++] = 0x0B;
            this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize])
            return out.pos;
        }
    ]
});