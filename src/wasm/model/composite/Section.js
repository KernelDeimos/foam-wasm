foam.APPLY_MACRO('wasm.model.composite.meta.Macro', {
    id: 'wasm.model.composite.Section',
    seq: [
        'Byte', { name: 'sectionId' },
        'FObject', {
            of: 'wasm.model.primitive.IntegerValue',
            name: 'sectionSize',
            getter: function () {
                return this.IntegerValue.create({
                    value: this.contents.binarySize
                });
            }
        },
        'FObject', {
            name: 'contents'
        },
    ]
});
