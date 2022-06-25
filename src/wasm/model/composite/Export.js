foam.APPLY_MACRO('wasm.model.composite.meta.Macro', {
    id: 'wasm.model.composite.Export',
    seq: [
        'Name', {
            name: 'name'
        },
        'Byte', {
            name: 'idxClass'
        },
        'FObject', {
            of: 'wasm.model.primitive.IntegerValue',
            name: 'idxValue'
        }
    ]
})