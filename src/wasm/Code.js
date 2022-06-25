foam.CLASS({
    package: 'wasm',
    name: 'Code',

    mixins: ['wasm.Mixin'],
    requires: [
        'wasm.Vector'
    ],

    properties: [
        {
            class: 'Int',
            name: 'binarySize',
            getter: function () {
                size = this.funcSize.binarySize;
                size += this.locals.binarySize;
                size += this.expr.binarySize;
                return size;
            }
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.IntegerValue',
            name: 'funcSize',
            expression: function (locals, expr) {
                return this.IntegerValue.create({
                    value: this.locals.binarySize + this.expr.binarySize
                });
            }
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.Vector',
            name: 'locals',
            factory: function () {
                return this.Vector.create();
            }
        },
        {
            class: 'FObjectProperty',
            of: 'wasm.Expr',
            name: 'expr'
        }
    ],

    methods: [
        function outputWASM(bufferView) {
            const out = this.Outputter.create({ bufferView });
            out.output(this.funcSize);
            out.output(this.locals);
            out.output(this.expr);
            this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize])
            return out.pos;
        }
    ]
});
