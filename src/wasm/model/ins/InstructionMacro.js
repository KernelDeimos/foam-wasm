foam.DEF_MACRO({
    package: 'wasm.model.ins',
    name: 'InstructionMacro',

    code: function (spec) {
        const properties = [
            { class: 'Int', name: 'opcode', value: spec[0] },
        ];
        const binaryProperties = [];
        for ( const propSpec of spec.slice(2) ) {
            const [name, propType] = propSpec.split(':');
            properties.push({
                ...(
                    propType === 'u32' ? {
                        class: 'FObjectProperty',
                        of: 'wasm.model.primitive.IntegerValue',
                        postSet: function (_, v) {
                            this.assert(() => v?.bitWidth === 32, v);
                            return v;
                        }
                    } : { class: 'Int' }
                ),
                name
            });
            binaryProperties.push(name);
        }

        properties.push({
            class: 'Int',
            name: 'binarySize',
            expression: foam.Function.spoofArgNames(function (...args) {
                let size = 1;
                for ( const arg of args ) {
                    console.log('arg', arg)
                    size += arg.binarySize;
                }
                return size;
            }, binaryProperties)
        });

        let o;
        foam.CLASS(o = {
            package: 'wasm.model.ins',
            name: spec[1].split('.').map(foam.String.capitalize).join('') +
                'Instruction',
            extends: 'wasm.model.ins.OpInstruction',
            mixins: ['wasm.meta.Mixin'],

            properties,

            methods: [
                function outputWASM (bufferView) {
                    bufferView[0] = this.opcode;
                    const out = this.Outputter.create({ bufferView, pos: 1 });
                    for ( const p of binaryProperties ) {
                        out.output(this[p]);
                    }
                    this.assert(() => out.pos == this.binarySize, [out.pos, this.binarySize]);
                    return out.pos;
                }
            ]
        });
    }
});
