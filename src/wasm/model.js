foam.CLASS({
    package: 'foam.core',
    name: 'MacroModel',
    extends: 'foam.core.Model',

    documentation: 'Metaprogramming construct to create FOAM models from data',

    properties: [
        {
            class: 'Function',
            name: 'code'
        }
    ]
});

foam.LIB({
    name: 'foam',

    methods: [
        function DEF_MACRO(m) {
            m.class = m.class || 'foam.core.MacroModel';
            foam.CLASS(m);
        },
        function APPLY_MACRO(macroCls, data) {
            const macro = foam.lookup(macroCls).model_;
            const realFoamDotClass = foam.CLASS;
            foam.CLASS = function (m) {
                m.genTransient = true;
                realFoamDotClass.call(foam, m);
            };
            if ( foam.Array.isInstance(data) ) {
                for ( const datum of data ) {
                    macro.code.call(macro, datum);
                }
            } else {
                macro.code.call(macro, data);
            }

            foam.CLASS = realFoamDotClass;
        }
    ]
});

foam.LIB({
    name: 'foam.Function',

    methods: [
        function spoofArgNames(fn, newNames) {
            const oldToString = fn.toString;
            const argStr = newNames.join(', ');

            fn.toString = function () {
                return oldToString.call(this).replace(/^.*?\)/, `function (${argStr})`);
            };

            return fn;
        }
    ]
});