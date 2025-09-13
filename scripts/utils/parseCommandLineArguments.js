"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseCommandLineArguments;
// Function to parse command-line arguments into a key-value object
function parseCommandLineArguments() {
    const args = process.argv.slice(2); // Skip node and script paths
    const argsMap = {};
    args.forEach((arg) => {
        const [key, value] = arg.split('=');
        if (key.startsWith('--')) {
            const name = key.substring(2);
            argsMap[name] = value;
            // User may provide a help arg without any value
            if (name.toLowerCase() === 'help' && !value) {
                argsMap[name] = 'true';
            }
        }
    });
    return argsMap;
}
