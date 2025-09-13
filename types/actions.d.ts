declare module '@actions/core' {
    export function getInput(name: string): string;
    export function setOutput(name: string, value: string): void;
    export function setFailed(message: string): void;
    export function info(message: string): void;
    export function warning(message: string): void;
    export function error(message: string): void;
}

declare module '@actions/github' {
    export const context: {
        payload: any;
        repo: {
            owner: string;
            repo: string;
        };
    };
    export function getOctokit(token: string): any;
}

declare module 'lodash/escapeRegExp' {
    function escapeRegExp(str: string): string;
    export = escapeRegExp;
}

declare module 'lodash/throttle' {
    function throttle<T extends (...args: any[]) => any>(
        func: T,
        wait?: number,
        options?: any
    ): T;
    export = throttle;
}