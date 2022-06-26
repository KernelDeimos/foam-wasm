foam.APPLY_MACRO('wasm.model.ins.InstructionMacro', [
    // Variable instructions
    [0x20, 'local.get', 'idx:u32'],
    [0x21, 'local.set', 'idx:u32'],
    [0x22, 'local.tee', 'idx:u32'],
    [0x23, 'global.get', 'idx:u32'],
    [0x24, 'global.set', 'idx:u32'],

    // Numeric instructions
    [0x41, 'i32.const', 'value:u32'], // TODO: should be i32, not u32
]);
