foam.APPLY_MACRO('wasm.model.composite.meta.Macro', {
    id: 'wasm.model.composite.FunctionType',
    seq: [
        'ByteLiteral', 0x60,
        'FObject', {
            of: 'wasm.model.composite.Vector',
            name: 'parameters'
        },
        'FObject', {
            of: 'wasm.model.composite.Vector',
            name: 'results'
        }
    ]
});
