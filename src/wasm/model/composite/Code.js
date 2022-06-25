foam.APPLY_MACRO('wasm.model.composite.meta.Macro', {
    id: 'wasm.model.composite.Code',
    seq: [
        'FObject', {
            of: 'wasm.model.primitive.IntegerValue',
            name: 'funcSize',
            expression: function (locals, expr) {
                return this.IntegerValue.create({
                    value: this.locals.binarySize + this.expr.binarySize
                });
            }
        },
        'FObject', {
            of: 'wasm.model.composite.Vector', name: 'locals',
            factory: function () { return wasm.model.composite.Vector.create(); }
        },
        'FObject', { of: 'wasm.model.composite.Expr', name: 'expr' }
    ]
});
