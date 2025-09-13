"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility to parse command-line arguments to a script.
 *
 * @example
 * ```
 * const cli = new CLI({
 *     flags: {
 *         verbose: {
 *             description: 'Enable verbose logging',
 *         },
 *     },
 *     namedArgs: {
 *         time: {
 *             description: 'Time of day to greet (morning or evening)',
 *             default: 'morning',
 *             parse: (val) => {
 *                 if (val !== 'morning' && val !== 'evening') {
 *                     throw new Error('Must be "morning" or "evening"');
 *                 }
 *                 return val as 'morning' | 'evening';
 *             },
 *         },
 *     },
 *     positionalArgs: [
 *         {
 *             name: 'firstName'
 *             description: 'First name to greet',
 *         },
 *         {
 *             name: 'lastName',
 *             description: 'Last name to greet',
 *             default: '',
 *         },
 *     ],
 * });
 *
 * let fullName = cli.positionalArgs.firstName;
 * if (cli.flags.verbose) {
 *     fullName += cli.positionalArgs.lastName;
 * }
 * console.log(fullName);
 * console.log(cli.namedArgs.time);
 * ```
 */
class CLI {
    constructor(config) {
        this.config = config;
        const rawArgs = process.argv.slice(2);
        // Handle help command
        if (rawArgs.includes('help') || rawArgs.includes('--help')) {
            this.printHelp();
            process.exit(0);
        }
        try {
            // Initialize all flags to false by default
            this.flags = Object.fromEntries(Object.keys(config.flags ?? {}).map((key) => [key, false]));
            const parsedNamedArgs = {};
            const parsedPositionalArgs = {};
            const providedNamedArgs = new Set();
            let positionalIndex = 0;
            for (let i = 0; i < rawArgs.length; i++) {
                const rawArg = rawArgs.at(i);
                if (rawArg === undefined) {
                    continue;
                }
                if (rawArg.startsWith('--')) {
                    // Either a flag or a named param
                    const [rawArgName, rawArgValue] = rawArg.slice(2).split('=');
                    if (rawArgName in this.flags) {
                        // Arg is a flag
                        this.flags[rawArgName] = true;
                    }
                    else if (config.namedArgs && rawArgName in config.namedArgs) {
                        // Arg is a named arg
                        providedNamedArgs.add(rawArgName);
                        // Grab the value from the split token, otherwise go for the next token
                        let argValueBeforeParse = '';
                        if (rawArgValue) {
                            argValueBeforeParse = rawArgValue;
                        }
                        else {
                            argValueBeforeParse = rawArgs.at(++i) ?? '';
                            if (!argValueBeforeParse || argValueBeforeParse.startsWith('--')) {
                                throw new Error(`Missing value for --${rawArgName}`);
                            }
                        }
                        const spec = config.namedArgs[rawArgName];
                        parsedNamedArgs[rawArgName] = CLI.parseStringArg(argValueBeforeParse, rawArgName, spec);
                    }
                    else {
                        console.error(`Unknown flag: --${rawArgName}`);
                        process.exit(1);
                    }
                }
                else {
                    // Arg is a positional arg
                    const spec = config.positionalArgs?.at(positionalIndex);
                    if (spec === undefined) {
                        throw new Error(`Unexpected arg: ${rawArg}`);
                    }
                    parsedPositionalArgs[spec.name] = CLI.parseStringArg(rawArg, spec.name, spec);
                    positionalIndex++;
                }
            }
            // Handle supersession logic
            const supersededArgs = new Set();
            for (const [name, spec] of Object.entries(config.namedArgs ?? {})) {
                if (providedNamedArgs.has(name) && spec.supersedes) {
                    for (const supersededArg of spec.supersedes) {
                        supersededArgs.add(supersededArg);
                        if (providedNamedArgs.has(supersededArg)) {
                            console.warn(`⚠️  Warning: --${supersededArg} is superseded by --${name} and will be ignored.`);
                        }
                    }
                }
            }
            // Validate that all required args are present, assign defaults where values are not parsed
            for (const [name, spec] of Object.entries(config.namedArgs ?? {})) {
                if (name in parsedNamedArgs) {
                    if (supersededArgs.has(name)) {
                        parsedNamedArgs[name] = undefined;
                    }
                }
                else if (supersededArgs.has(name)) {
                    // This arg was superseded, so don't require it and don't assign a default
                    continue;
                }
                else if (spec.default !== undefined) {
                    parsedNamedArgs[name] = spec.default;
                }
                else if (spec.required === false) {
                    // Explicitly marked as optional, leave undefined
                    continue;
                }
                else {
                    // Arguments without defaults are required by default (unless explicitly marked as optional)
                    throw new Error(`Missing required named argument --${name}`);
                }
            }
            for (const spec of config.positionalArgs ?? []) {
                if (!(spec.name in parsedPositionalArgs)) {
                    if (spec.default !== undefined) {
                        parsedPositionalArgs[spec.name] = spec.default;
                    }
                    else {
                        throw new Error(`Missing required positional argument --${spec.name}`);
                    }
                }
            }
            this.namedArgs = parsedNamedArgs;
            this.positionalArgs = parsedPositionalArgs;
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                this.printHelp();
            }
            else {
                console.error('An unexpected error occurred initializing the CLI.');
            }
            process.exit(1);
        }
    }
    printHelp() {
        const { flags = {}, namedArgs = {}, positionalArgs = [] } = this.config;
        const scriptName = process.argv.at(1) ?? 'script.ts';
        const positionalUsage = positionalArgs.map((arg) => (arg.default === undefined ? `<${arg.name}>` : `[${arg.name}]`)).join(' ');
        const namedArgUsage = Object.keys(namedArgs)
            .map((key) => `[--${key} <value>]`)
            .join(' ');
        const flagUsage = Object.keys(flags)
            .map((key) => `[--${key}]`)
            .join(' ');
        console.log(`\nUsage: npx ts-node ${scriptName} ${flagUsage} ${namedArgUsage} ${positionalUsage}\n`);
        if (Object.keys(flags).length > 0) {
            console.log('Flags:');
            for (const [name, spec] of Object.entries(flags)) {
                console.log(`  --${name.padEnd(20)} ${spec.description}`);
            }
            console.log('');
        }
        if (Object.keys(namedArgs).length > 0) {
            console.log('Named Arguments:');
            for (const [name, spec] of Object.entries(namedArgs)) {
                const defaultLabel = spec.default !== undefined ? ` (default: ${String(spec.default)})` : '';
                const supersededLabel = spec.supersedes && spec.supersedes.length > 0 ? ` (supersedes: ${spec.supersedes.join(', ')})` : '';
                console.log(`  --${name.padEnd(20)} ${spec.description}${defaultLabel}${supersededLabel}`);
            }
            console.log('');
        }
        if (positionalArgs.length > 0) {
            console.log('Positional Arguments:');
            for (const arg of positionalArgs) {
                const defaultLabel = arg.default !== undefined ? ` (default: ${String(arg.default)})` : '';
                console.log(`  ${arg.name.padEnd(22)} ${arg.description}${defaultLabel}`);
            }
            console.log('');
        }
    }
    static parseStringArg(rawString, paramName, spec) {
        if ('parse' in spec && !!spec.parse) {
            try {
                return spec.parse(rawString);
            }
            catch (error) {
                let errorMessage = '';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                console.error(`Invalid value for --${paramName}: ${errorMessage}`);
                process.exit(1);
            }
        }
        else {
            return rawString;
        }
    }
}
exports.default = CLI;
