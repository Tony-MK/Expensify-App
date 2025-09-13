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
var CLI = /** @class */ (function () {
    function CLI(config) {
        var _a, _b, _c, _d, _e, _f;
        this.config = config;
        var rawArgs = process.argv.slice(2);
        // Handle help command
        if (rawArgs.includes('help') || rawArgs.includes('--help')) {
            this.printHelp();
            process.exit(0);
        }
        try {
            // Initialize all flags to false by default
            this.flags = Object.fromEntries(Object.keys((_a = config.flags) !== null && _a !== void 0 ? _a : {}).map(function (key) { return [key, false]; }));
            var parsedNamedArgs = {};
            var parsedPositionalArgs = {};
            var providedNamedArgs = new Set();
            var positionalIndex = 0;
            for (var i = 0; i < rawArgs.length; i++) {
                var rawArg = rawArgs.at(i);
                if (rawArg === undefined) {
                    continue;
                }
                if (rawArg.startsWith('--')) {
                    // Either a flag or a named param
                    var _g = rawArg.slice(2).split('='), rawArgName = _g[0], rawArgValue = _g[1];
                    if (rawArgName in this.flags) {
                        // Arg is a flag
                        this.flags[rawArgName] = true;
                    }
                    else if (config.namedArgs && rawArgName in config.namedArgs) {
                        // Arg is a named arg
                        providedNamedArgs.add(rawArgName);
                        // Grab the value from the split token, otherwise go for the next token
                        var argValueBeforeParse = '';
                        if (rawArgValue) {
                            argValueBeforeParse = rawArgValue;
                        }
                        else {
                            argValueBeforeParse = (_b = rawArgs.at(++i)) !== null && _b !== void 0 ? _b : '';
                            if (!argValueBeforeParse || argValueBeforeParse.startsWith('--')) {
                                throw new Error("Missing value for --".concat(rawArgName));
                            }
                        }
                        var spec = config.namedArgs[rawArgName];
                        parsedNamedArgs[rawArgName] = CLI.parseStringArg(argValueBeforeParse, rawArgName, spec);
                    }
                    else {
                        console.error("Unknown flag: --".concat(rawArgName));
                        process.exit(1);
                    }
                }
                else {
                    // Arg is a positional arg
                    var spec = (_c = config.positionalArgs) === null || _c === void 0 ? void 0 : _c.at(positionalIndex);
                    if (spec === undefined) {
                        throw new Error("Unexpected arg: ".concat(rawArg));
                    }
                    parsedPositionalArgs[spec.name] = CLI.parseStringArg(rawArg, spec.name, spec);
                    positionalIndex++;
                }
            }
            // Handle supersession logic
            var supersededArgs = new Set();
            for (var _i = 0, _h = Object.entries((_d = config.namedArgs) !== null && _d !== void 0 ? _d : {}); _i < _h.length; _i++) {
                var _j = _h[_i], name_1 = _j[0], spec = _j[1];
                if (providedNamedArgs.has(name_1) && spec.supersedes) {
                    for (var _k = 0, _l = spec.supersedes; _k < _l.length; _k++) {
                        var supersededArg = _l[_k];
                        supersededArgs.add(supersededArg);
                        if (providedNamedArgs.has(supersededArg)) {
                            console.warn("\u26A0\uFE0F  Warning: --".concat(supersededArg, " is superseded by --").concat(name_1, " and will be ignored."));
                        }
                    }
                }
            }
            // Validate that all required args are present, assign defaults where values are not parsed
            for (var _m = 0, _o = Object.entries((_e = config.namedArgs) !== null && _e !== void 0 ? _e : {}); _m < _o.length; _m++) {
                var _p = _o[_m], name_2 = _p[0], spec = _p[1];
                if (name_2 in parsedNamedArgs) {
                    if (supersededArgs.has(name_2)) {
                        parsedNamedArgs[name_2] = undefined;
                    }
                }
                else if (supersededArgs.has(name_2)) {
                    // This arg was superseded, so don't require it and don't assign a default
                    continue;
                }
                else if (spec.default !== undefined) {
                    parsedNamedArgs[name_2] = spec.default;
                }
                else if (spec.required === false) {
                    // Explicitly marked as optional, leave undefined
                    continue;
                }
                else {
                    // Arguments without defaults are required by default (unless explicitly marked as optional)
                    throw new Error("Missing required named argument --".concat(name_2));
                }
            }
            for (var _q = 0, _r = (_f = config.positionalArgs) !== null && _f !== void 0 ? _f : []; _q < _r.length; _q++) {
                var spec = _r[_q];
                if (!(spec.name in parsedPositionalArgs)) {
                    if (spec.default !== undefined) {
                        parsedPositionalArgs[spec.name] = spec.default;
                    }
                    else {
                        throw new Error("Missing required positional argument --".concat(spec.name));
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
    CLI.prototype.printHelp = function () {
        var _a;
        var _b = this.config, _c = _b.flags, flags = _c === void 0 ? {} : _c, _d = _b.namedArgs, namedArgs = _d === void 0 ? {} : _d, _e = _b.positionalArgs, positionalArgs = _e === void 0 ? [] : _e;
        var scriptName = (_a = process.argv.at(1)) !== null && _a !== void 0 ? _a : 'script.ts';
        var positionalUsage = positionalArgs.map(function (arg) { return (arg.default === undefined ? "<".concat(arg.name, ">") : "[".concat(arg.name, "]")); }).join(' ');
        var namedArgUsage = Object.keys(namedArgs)
            .map(function (key) { return "[--".concat(key, " <value>]"); })
            .join(' ');
        var flagUsage = Object.keys(flags)
            .map(function (key) { return "[--".concat(key, "]"); })
            .join(' ');
        console.log("\nUsage: npx ts-node ".concat(scriptName, " ").concat(flagUsage, " ").concat(namedArgUsage, " ").concat(positionalUsage, "\n"));
        if (Object.keys(flags).length > 0) {
            console.log('Flags:');
            for (var _i = 0, _f = Object.entries(flags); _i < _f.length; _i++) {
                var _g = _f[_i], name_3 = _g[0], spec = _g[1];
                console.log("  --".concat(name_3.padEnd(20), " ").concat(spec.description));
            }
            console.log('');
        }
        if (Object.keys(namedArgs).length > 0) {
            console.log('Named Arguments:');
            for (var _h = 0, _j = Object.entries(namedArgs); _h < _j.length; _h++) {
                var _k = _j[_h], name_4 = _k[0], spec = _k[1];
                var defaultLabel = spec.default !== undefined ? " (default: ".concat(String(spec.default), ")") : '';
                var supersededLabel = spec.supersedes && spec.supersedes.length > 0 ? " (supersedes: ".concat(spec.supersedes.join(', '), ")") : '';
                console.log("  --".concat(name_4.padEnd(20), " ").concat(spec.description).concat(defaultLabel).concat(supersededLabel));
            }
            console.log('');
        }
        if (positionalArgs.length > 0) {
            console.log('Positional Arguments:');
            for (var _l = 0, positionalArgs_1 = positionalArgs; _l < positionalArgs_1.length; _l++) {
                var arg = positionalArgs_1[_l];
                var defaultLabel = arg.default !== undefined ? " (default: ".concat(String(arg.default), ")") : '';
                console.log("  ".concat(arg.name.padEnd(22), " ").concat(arg.description).concat(defaultLabel));
            }
            console.log('');
        }
    };
    CLI.parseStringArg = function (rawString, paramName, spec) {
        if ('parse' in spec && !!spec.parse) {
            try {
                return spec.parse(rawString);
            }
            catch (error) {
                var errorMessage = '';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                console.error("Invalid value for --".concat(paramName, ": ").concat(errorMessage));
                process.exit(1);
            }
        }
        else {
            return rawString;
        }
    };
    return CLI;
}());
exports.default = CLI;
