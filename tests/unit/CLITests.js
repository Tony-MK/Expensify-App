"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
var CLI_1 = require("../../scripts/utils/CLI");
var StringUtils_1 = require("../../src/libs/StringUtils");
describe('CLI', function () {
    var ORIGINAL_ARGV = process.argv;
    var mockExit;
    var mockLog;
    var mockError;
    var mockWarn;
    beforeEach(function () {
        process.argv = ['ts-node', 'script.ts'];
        mockExit = jest.spyOn(process, 'exit').mockImplementation(function () {
            throw new Error('exit');
        });
        mockLog = jest.spyOn(console, 'log').mockImplementation(function () { });
        mockError = jest.spyOn(console, 'error').mockImplementation(function () { });
        mockWarn = jest.spyOn(console, 'warn').mockImplementation(function () { });
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    afterAll(function () {
        process.argv = ORIGINAL_ARGV;
    });
    it('parses boolean flags with default false', function () {
        var cli = new CLI_1.default({
            flags: {
                verbose: { description: 'Enable verbose mode' },
            },
        });
        expect(cli.flags.verbose).toBe(false);
    });
    it('sets boolean flag when present', function () {
        process.argv.push('--verbose');
        var cli = new CLI_1.default({
            flags: {
                verbose: { description: 'Enable verbose mode' },
            },
        });
        expect(cli.flags.verbose).toBe(true);
    });
    it('parses named arg with default', function () {
        var cli = new CLI_1.default({
            namedArgs: {
                name: { description: 'Your name', default: 'Guest' },
            },
        });
        expect(cli.namedArgs.name).toBe('Guest');
    });
    it('uses named arg value from command line', function () {
        process.argv.push('--name=Alice');
        var cli = new CLI_1.default({
            namedArgs: {
                name: { description: 'Your name', default: 'Guest' },
            },
        });
        expect(cli.namedArgs.name).toBe('Alice');
    });
    it('supports "--arg value" syntax', function () {
        process.argv.push('--name', 'Bob');
        var cli = new CLI_1.default({
            namedArgs: {
                name: { description: 'Your name' },
            },
        });
        expect(cli.namedArgs.name).toBe('Bob');
    });
    it('throws if required named arg is missing', function () {
        expect(function () {
            return new CLI_1.default({
                namedArgs: {
                    name: { description: 'Required arg' },
                },
            });
        }).toThrow();
        expect(mockError).toHaveBeenCalledWith('Missing required named argument --name');
    });
    it('throws on invalid named arg value from parse function', function () {
        process.argv.push('--count', 'abc');
        expect(function () {
            return new CLI_1.default({
                namedArgs: {
                    count: {
                        description: 'Numeric value',
                        parse: function (val) {
                            var num = Number(val);
                            if (Number.isNaN(num)) {
                                throw new Error('Must be a number');
                            }
                            return num;
                        },
                    },
                },
            });
        }).toThrow();
        expect(mockError).toHaveBeenCalledWith('Invalid value for --count: Must be a number');
    });
    it('parses required positional arg', function () {
        process.argv.push('Hello');
        var cli = new CLI_1.default({
            positionalArgs: [{ name: 'greeting', description: 'Greeting' }],
        });
        expect(cli.positionalArgs.greeting).toBe('Hello');
    });
    it('uses default for optional positional arg', function () {
        var cli = new CLI_1.default({
            positionalArgs: [{ name: 'greeting', description: 'Greeting', default: 'Hi' }],
        });
        expect(cli.positionalArgs.greeting).toBe('Hi');
    });
    it('throws for missing required positional arg', function () {
        expect(function () {
            return new CLI_1.default({
                positionalArgs: [{ name: 'greeting', description: 'Greeting' }],
            });
        }).toThrow();
        expect(mockError).toHaveBeenCalledWith('Missing required positional argument --greeting');
    });
    it('parses custom type with parse function', function () {
        process.argv.push('--locales', 'en,fr,es');
        var cli = new CLI_1.default({
            namedArgs: {
                locales: {
                    description: 'Languages',
                    parse: function (val) { return val.split(','); },
                },
            },
        });
        expect(cli.namedArgs.locales).toEqual(['en', 'fr', 'es']);
    });
    it('prints help message and exits with --help flag', function () {
        process.argv.push('--help');
        expect(function () {
            return new CLI_1.default({
                flags: {
                    verbose: { description: 'Enable verbose logging' },
                },
                namedArgs: {
                    time: {
                        description: 'Time of day to greet (morning or evening)',
                        default: 'morning',
                        parse: function (val) {
                            if (val !== 'morning' && val !== 'evening') {
                                throw new Error('Must be "morning" or "evening"');
                            }
                            return val;
                        },
                    },
                },
                positionalArgs: [
                    {
                        name: 'firstName',
                        description: 'First name to greet',
                    },
                    {
                        name: 'lastName',
                        description: 'Last name to greet',
                        default: '',
                    },
                ],
            });
        }).toThrow('exit');
        var scriptName = 'script.ts'; // Adjust if your tests override process.argv[1]
        var expectedOutput = StringUtils_1.default.dedent("\n            Usage: npx ts-node ".concat(scriptName, " [--verbose] [--time <value>] <firstName> [lastName]\n\n            Flags:\n              --verbose              Enable verbose logging\n\n            Named Arguments:\n              --time                 Time of day to greet (morning or evening) (default: morning)\n\n            Positional Arguments:\n              firstName              First name to greet\n              lastName               Last name to greet (default: )\n        ")).trim();
        // Join lines and strip indentation before comparison
        var actualOutput = mockLog.mock.calls.flat().join('\n').trim();
        expect(actualOutput).toBe(expectedOutput);
        expect(mockExit).toHaveBeenCalledWith(0);
    });
    it('handles supersession when superseding arg is provided', function () {
        process.argv.push('--paths', 'common.save,errors.generic');
        var cli = new CLI_1.default({
            namedArgs: {
                compareRef: {
                    description: 'Compare reference',
                    default: 'main',
                },
                paths: {
                    description: 'Specific paths to process',
                    parse: function (val) { return val.split(','); },
                    supersedes: ['compareRef'],
                    required: false,
                },
            },
        });
        expect(cli.namedArgs.paths).toEqual(['common.save', 'errors.generic']);
        expect(cli.namedArgs.compareRef).toBeUndefined();
    });
    it('uses default value when superseding arg is not provided', function () {
        var cli = new CLI_1.default({
            namedArgs: {
                compareRef: {
                    description: 'Compare reference',
                    default: 'main',
                },
                paths: {
                    description: 'Specific paths to process',
                    parse: function (val) { return val.split(','); },
                    supersedes: ['compareRef'],
                    required: false,
                },
            },
        });
        expect(cli.namedArgs.paths).toBeUndefined();
        expect(cli.namedArgs.compareRef).toBe('main');
    });
    it('shows supersession information in help message', function () {
        process.argv.push('--help');
        expect(function () {
            return new CLI_1.default({
                namedArgs: {
                    compareRef: {
                        description: 'Compare reference',
                        default: 'main',
                    },
                    paths: {
                        description: 'Specific paths to process',
                        supersedes: ['compareRef'],
                        required: false,
                    },
                },
            });
        }).toThrow('exit');
        var actualOutput = mockLog.mock.calls.flat().join('\n');
        expect(actualOutput).toContain('(supersedes: compareRef)');
        expect(mockExit).toHaveBeenCalledWith(0);
    });
    it('handles multiple superseded args', function () {
        process.argv.push('--priority', 'high');
        var cli = new CLI_1.default({
            namedArgs: {
                lowPriority: {
                    description: 'Low priority mode',
                    default: 'enabled',
                },
                mediumPriority: {
                    description: 'Medium priority mode',
                    default: 'enabled',
                },
                priority: {
                    description: 'Priority level',
                    supersedes: ['lowPriority', 'mediumPriority'],
                    required: false,
                },
            },
        });
        expect(cli.namedArgs.priority).toBe('high');
        expect(cli.namedArgs.lowPriority).toBeUndefined();
        expect(cli.namedArgs.mediumPriority).toBeUndefined();
    });
    it('requires superseded args when superseding arg is not provided', function () {
        expect(function () {
            return new CLI_1.default({
                namedArgs: {
                    compareRef: {
                        description: 'Compare reference',
                        // No default value
                    },
                    paths: {
                        description: 'Specific paths to process',
                        supersedes: ['compareRef'],
                        required: false,
                    },
                },
            });
        }).toThrow();
        expect(mockError).toHaveBeenCalledWith('Missing required named argument --compareRef');
    });
    it('warns when superseded arg is provided alongside superseding arg', function () {
        process.argv.push('--paths', 'common.save', '--compare-ref', 'main');
        /* eslint-disable @typescript-eslint/naming-convention */
        var cli = new CLI_1.default({
            namedArgs: {
                'compare-ref': {
                    description: 'Compare reference',
                    default: 'main',
                },
                paths: {
                    description: 'Specific paths to process',
                    parse: function (val) { return val.split(','); },
                    supersedes: ['compare-ref'],
                    required: false,
                },
            },
        });
        /* eslint-enable @typescript-eslint/naming-convention */
        expect(mockWarn).toHaveBeenCalledWith('⚠️  Warning: --compare-ref is superseded by --paths and will be ignored.');
        expect(cli.namedArgs.paths).toEqual(['common.save']);
        expect(cli.namedArgs['compare-ref']).toBeUndefined();
    });
    it('warns for multiple superseded args when provided', function () {
        process.argv.push('--priority', 'high', '--low-priority', 'disabled', '--medium-priority', 'enabled');
        /* eslint-disable @typescript-eslint/naming-convention */
        var cli = new CLI_1.default({
            namedArgs: {
                'low-priority': {
                    description: 'Low priority mode',
                    default: 'enabled',
                },
                'medium-priority': {
                    description: 'Medium priority mode',
                    default: 'enabled',
                },
                priority: {
                    description: 'Priority level',
                    supersedes: ['low-priority', 'medium-priority'],
                    required: false,
                },
            },
        });
        /* eslint-enable @typescript-eslint/naming-convention */
        expect(mockWarn).toHaveBeenCalledWith('⚠️  Warning: --low-priority is superseded by --priority and will be ignored.');
        expect(mockWarn).toHaveBeenCalledWith('⚠️  Warning: --medium-priority is superseded by --priority and will be ignored.');
        expect(cli.namedArgs.priority).toBe('high');
        expect(cli.namedArgs['low-priority']).toBeUndefined();
        expect(cli.namedArgs['medium-priority']).toBeUndefined();
    });
    it('does not warn when only superseding arg is provided', function () {
        process.argv.push('--paths', 'common.save');
        /* eslint-disable @typescript-eslint/naming-convention */
        var cli = new CLI_1.default({
            namedArgs: {
                'compare-ref': {
                    description: 'Compare reference',
                    default: 'main',
                },
                paths: {
                    description: 'Specific paths to process',
                    parse: function (val) { return val.split(','); },
                    supersedes: ['compare-ref'],
                    required: false,
                },
            },
        });
        /* eslint-enable @typescript-eslint/naming-convention */
        expect(mockWarn).not.toHaveBeenCalled();
        expect(cli.namedArgs.paths).toEqual(['common.save']);
        expect(cli.namedArgs['compare-ref']).toBeUndefined();
    });
});
