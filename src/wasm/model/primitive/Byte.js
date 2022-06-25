foam.CLASS({
    package: 'wasm.model.primitive',
    name: 'Byte',
    implements: ['wasm.outputter.Outputable'],

    properties: [
        {
            class: 'Int',
            name: 'value'
        },
        {
            class: 'Int',
            name: 'binarySize',
            getter: function () {
                return 1;
            }
        }
    ],

    methods: [
        function outputWASM(bufferView) {
            bufferView[0] = this.value;
            return 1;
        }
    ]
});
