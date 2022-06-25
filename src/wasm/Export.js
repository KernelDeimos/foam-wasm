foam.CLASS({
    package: 'wasm',
    name: 'Export',

    mixins: ['wasm.Mixin'],
    requires: ['wasm.Name'],

    properties: [
        {
            class: 'String',
            name: 'name'
        },
        {
            class: 'Int',
            name: 'idxClass'
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.IntegerValue',
            name: 'idxValue'
        },
        {
            class: 'FObjectProperty',
            name: 'binaryName',
            expression: function (name) {
                return this.Name.create({
                    value: name
                });
            }
        },
        {
            class: 'Int',
            name: 'binarySize',
            expression: function (binaryName) {
                return this.binaryName.binarySize + 2;
            }
        }
    ],

    methods: [
        function outputWASM(bufferView) {
            const out = this.Outputter.create({ bufferView });
            out.output(this.binaryName);
            bufferView[out.pos++] = this.idxClass;
            out.output(this.idxValue);
            this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize])
            return out.pos;
        }
    ]
})