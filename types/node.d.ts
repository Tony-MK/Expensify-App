declare namespace NodeJS {
    interface Global {
        Buffer: typeof Buffer;
        require: NodeRequire;
        module: NodeModule;
        process: Process;
    }
    interface Process {
        env: { [key: string]: string | undefined };
        exit(code?: number): never;
        cwd(): string;
        platform: string;
        arch: string;
        stdout: any;
        stderr: any;
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
declare var process: NodeJS.Process;

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

// Node.js built-in modules
declare module 'http' {
    export interface IncomingMessage {
        url?: string;
        method?: string;
        headers: { [key: string]: string | string[] };
        pipe(destination: any): any;
    }
    export interface ServerResponse {
        writeHead(statusCode: number, headers?: any): void;
        write(chunk: any): void;
        end(chunk?: any): void;
        setHeader(name: string, value: string): void;
    }
    export function createServer(callback: (req: IncomingMessage, res: ServerResponse) => void): any;
    export function request(options: any, callback?: (res: any) => void): any;
}

declare module 'https' {
    export interface IncomingMessage {
        url?: string;
        method?: string;
        headers: { [key: string]: string | string[] };
        pipe(destination: any): any;
    }
    export interface ServerResponse {
        writeHead(statusCode: number, headers?: any): void;
        write(chunk: any): void;
        end(chunk?: any): void;
        setHeader(name: string, value: string): void;
    }
    export function createServer(callback: (req: IncomingMessage, res: ServerResponse) => void): any;
    export function request(options: any, callback?: (res: any) => void): any;
}

declare module 'dotenv' {
    export interface DotenvConfigOptions {
        path?: string;
        encoding?: string;
        debug?: boolean;
    }
    export function config(options?: DotenvConfigOptions): { parsed?: any; error?: Error };
}

declare module 'react-native-config' {
    const Config: { [key: string]: string };
    export default Config;
}

declare module 'react' {
    export const Component: any;
    export const createElement: any;
    export default any;
}

declare module '@welldone-software/why-did-you-render' {
    function whyDidYouRender(React: any, options?: any): void;
    export default whyDidYouRender;
}

declare module 'react-native-onyx' {
    export default any;
    export const connect: any;
    export const connectWithoutView: any;
}