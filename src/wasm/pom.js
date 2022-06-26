foam.POM({
    name: 'wasm-src',
    version: 1,
    files: [
        'foam/Array',
        'foam/Macro',
        'outputter/Outputter',
        'outputter/AbstractOutputable',
        'meta/Mixin',
        'model/primitive/BinaryValueToOutputter',
        'model/primitive/Byte',
        'model/primitive/IntegerValue',
        'model/primitive/Name',
        'model/composite/meta/Macro',
        'model/composite/Vector',
        'model/composite/Code',
        'model/composite/Export',
        'model/composite/Expr',
        'model/composite/FunctionType',
        'model/composite/Section',
        'model/composite/Locals',
        'model/ins/OpInstruction',
        'model/ins/InstructionMacro',
        'model/ins/instructions'
    ].map(name => ({ name, flags: 'js' }))
});
