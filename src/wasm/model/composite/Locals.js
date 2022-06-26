foam.APPLY_MACRO('wasm.model.composite.meta.Macro', {
    id: 'wasm.model.composite.Locals',
    seq: [
        'FObject', {
            of: 'wasm.model.primitive.IntegerValue',
            name: 'count'
        },
        'Byte', { name: 'valueType' }
    ]
});
