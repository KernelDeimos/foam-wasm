foam.APPLY_MACRO('wasm.meta.Outputable', {
    id: 'wasm.Export',
    seq: [
        'Name', {
            name: 'name'
        },
        'Byte', {
            name: 'idxClass'
        },
        'FObject', {
            of: 'wasm.IntegerValue',
            name: 'idxValue'
        }
    ]
})