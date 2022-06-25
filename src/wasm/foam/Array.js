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
