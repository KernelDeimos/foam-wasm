foam.CLASS({
    package: 'wasm.meta',
    name: 'AbstractOutputable',
    mixins: ['wasm.Mixin'],

    properties: [
        {
            class: 'FObjectArray',
            of: 'foam.core.FObject',
            name: 'outputSteps_'
        },
        {
            class: 'Int',
            name: 'binarySize',
            getter: function () {
                return this.outputSteps_.reduce((sum, step) =>
                    sum + step.calculateSize(this), 0)
            }
        }
    ],
    
    methods: [
        function outputWASM(bufferView) {
            const out = this.Outputter.create({ bufferView });
            for ( const outputStep of this.outputSteps_ ) {
                outputStep.output(this, out);
            }
            this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize])
            return out.pos;
        }
    ]
});