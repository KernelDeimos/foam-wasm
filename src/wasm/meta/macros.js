foam.LIB({
    name: 'foam.Array',

    methods: [
        function* chunk (a, sz) {
            for ( let i = 0; i < a.length; i += sz ) {
                yield a.slice(i, i + sz);
            }
        }
    ]
});

foam.CLASS({
    package: 'wasm.meta', name: 'ByteLiteralOutputStep',
    properties: [ { class: 'Int', name: 'value' } ],
    methods: [
        function output (_, out) { out.outputByte(this.value); },
        function calculateSize () { return 1 }
    ]
});

foam.CLASS({
    package: 'wasm.meta', name: 'FObjectOutputStep',
    properties: [ { class: 'String', name: 'property' } ],
    methods: [
        function output (obj, out) { out.output(obj[this.property]); },
        function calculateSize (obj) { return obj[this.property].binarySize }
    ]
});

foam.CLASS({
    package: 'wasm.meta', name: 'FObjectArrayOutputStep',
    properties: [ { class: 'String', name: 'property' } ],
    methods: [
        function output (obj, out) {
            for ( let item of obj[this.property] ) out.output(item);
        },
        function calculateSize (obj) {
            return obj[this.property].reduce((sum, item) =>
                sum + item.binarySize, 0);
        }
    ]
});

foam.DEF_MACRO({
    package: 'wasm.meta',
    name: 'Outputable',

    code: function (spec) {
        const outputSteps = [];
        const properties = [];

        for ( const [type, config] of foam.Array.chunk(spec.seq, 2) ) {
            const prefixName = 'binary' + foam.String.capitalize(config.name);
            if ( type === 'ByteLiteral' ) {
                outputSteps.push({
                    class: 'wasm.meta.ByteLiteralOutputStep',
                    value: config
                });
                continue;
            }
            if ( type === 'FObjectArray' ) {
                outputSteps.push({
                    class: 'wasm.meta.FObjectArrayOutputStep',
                    property: config.name
                });
                properties.push({ class: 'FObjectArray', of: 'FObject', ...config });
                continue
            }
            if ( type === 'Byte' ) {
                config.of = config.of || 'wasm.Byte';
                properties.push({ class: 'Int', name: config.name });
                config.expression = foam.Function.spoofArgNames(function (v) {
                    return wasm.Byte.create({ value: v })
                }, [config.name]);
                config.name = prefixName;
            }
            if ( type === 'Name' ) {
                config.of = config.of || 'wasm.Name';
                properties.push({ class: 'String', name: config.name });
                config.expression = foam.Function.spoofArgNames(function (v) {
                    return wasm.Name.create({ value: v })
                }, [config.name]);
                config.name = prefixName;
            }
            outputSteps.push({
                class: 'wasm.meta.FObjectOutputStep',
                property: config.name
            });
            properties.push({ class: 'FObjectProperty', ...config });
        }

        foam.CLASS({
            package: spec.id.split('.').slice(0, -1).join('.'),
            name: spec.id.split('.').slice(-1)[0],
            extends: 'wasm.meta.AbstractOutputable',

            properties: [
                { name: 'outputSteps_', factory: () => outputSteps },
                ...properties
            ],
        });
    }
});