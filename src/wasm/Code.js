foam.APPLY_MACRO('wasm.meta.Outputable', {
    id: 'wasm.Code',
    seq: [
        'FObject', {
            of: 'wasm.IntegerValue',
            name: 'funcSize',
            expression: function (locals, expr) {
                return this.IntegerValue.create({
                    value: this.locals.binarySize + this.expr.binarySize
                });
            }
        },
        'FObject', {
            of: 'wasm.Vector', name: 'locals',
            factory: function () { return wasm.Vector.create(); }
        },
        'FObject', { of: 'wasm.Expr', name: 'expr' }
    ]
});
