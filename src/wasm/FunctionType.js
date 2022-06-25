foam.APPLY_MACRO('wasm.meta.Outputable', {
    id: 'wasm.FunctionType',
    seq: [
        'ByteLiteral', 0x60,
        'FObject', {
            of: 'wasm.Vector',
            name: 'parameters'
        },
        'FObject', {
            of: 'wasm.Vector',
            name: 'results'
        }
    ]
});
