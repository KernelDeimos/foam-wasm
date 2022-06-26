# WebAssembly models for FOAM

WebAssembly models for FOAM. Still a work-in-progress.

### Generate the demo `.wasm` file
```
node wasm.js -input=example.json5
```

### Run the output file
```
node run.js example.wasm
```

### Architecture

- #### `/src/wasm/foam`

  Contains extensions to the FOAM Framework, most notably adding explicit macro
support.

- #### `/src/wasm/outputter`

  Defines the interface for models that can output WASM bytecode.

- #### `/src/wasm/model`

  Contains models representing symbols in the WASM bytecode's grammar. The
  package is split into two subpackages to differentiate primitive values from
  symbols composed of them.

  - #### `/src/wasm/model/primitive`

    Defines Byte, Name, and IntegerValue.
    - IntegerValue is meant to output any LEB128-encoded integers, as specified by
  its properties 'bitWidth' and 'signed'
    - Name can be used in place of Vector(Byte) for better memory efficiency.

  - #### `/src/wasm/model/composite`

    Models in here all use `./meta/Macro` to describe a composite WASM outputter.

  - #### `/src/wasm/model/ins`

    All instructions extend OpInstruction. Instructions are defined in `instructions.js`
    using the macro `wasm.model.ins.InstructionModel`.
