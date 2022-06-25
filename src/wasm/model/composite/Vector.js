foam.APPLY_MACRO('wasm.model.composite.meta.Macro', {
    id: 'wasm.model.composite.Vector',
    seq: [
        'FObject', {
            name: 'vectorSize',
            getter: function () {
                return this.IntegerValue.create({
                    value: this.contents.length
                });
            }
        },
        'FObjectArray', { name: 'contents' }
    ]
});
