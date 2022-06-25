foam.CLASS({
    package: 'wasm.meta',
    name: 'UtilityMixin',

    methods: [
        function assert(cond, data, msg) {
            if ( typeof cond === 'function' ) {
                if ( ! msg ) msg = cond.toString();
                else msg += ' ' + cond.toString();
                cond = cond();
            }
            if ( ! cond ) {
                console.log(`Assertion failed (${this.cls_.id}): ${msg}; ` +
                    foam.json.stringify(data));
                throw new Error(msg);
            }
        }
    ]
});

foam.CLASS({
    package: 'wasm.meta',
    name: 'Mixin',

    requires: [
        'wasm.outputter.Outputter',
        'wasm.model.primitive.IntegerValue'
    ],

    methods: [
        function assert(cond, data, msg) {
            if ( typeof cond === 'function' ) {
                if ( ! msg ) msg = cond.toString();
                else msg += ' ' + cond.toString();
                cond = cond();
            }
            if ( ! cond ) {
                console.log(`Assertion failed (${this.cls_.id}): ${msg}; ` +
                    foam.json.stringify(data));
                throw new Error(msg);
            }
        }
    ]
});