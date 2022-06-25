foam.CLASS({
    package: 'wasm',
    name: 'Byte',

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
