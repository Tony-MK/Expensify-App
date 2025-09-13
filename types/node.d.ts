declare namespace NodeJS {
    interface Global {
        Buffer: typeof Buffer;
        require: NodeRequire;
        module: NodeModule;
    }
}

declare var Buffer: {
    new (size: number): Buffer;
    new (array: Uint8Array): Buffer;
    new (str: string, encoding?: string): Buffer;
    from(data: string, encoding?: string): Buffer;
    from(data: Uint8Array): Buffer;
    from(data: any, encoding?: string): Buffer;
};

declare var require: NodeRequire;
declare var module: NodeModule;

interface Buffer {
    toString(encoding?: string): string;
}

interface NodeRequire {
    (id: string): any;
    main?: NodeModule;
}

interface NodeModule {
    exports: any;
    filename?: string;
}