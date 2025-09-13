#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const parseCommandLineArguments_1 = require("./utils/parseCommandLineArguments");
// Function to find .cpuprofile files in the current directory
function findCpuProfileFiles() {
    const files = fs_1.default.readdirSync(process.cwd());
    return files.filter((file) => file.endsWith('.cpuprofile'));
}
const argsMap = (0, parseCommandLineArguments_1.default)();
// Determine sourcemapPath based on the platform flag passed
let sourcemapPath;
if (argsMap.platform === 'ios') {
    sourcemapPath = 'main.jsbundle.map';
}
else if (argsMap.platform === 'android') {
    sourcemapPath = 'android/app/build/generated/sourcemaps/react/productionRelease/index.android.bundle.map';
}
else if (argsMap.platform === 'web') {
    sourcemapPath = 'dist/merged-source-map.js.map';
}
else {
    console.error('Please specify the platform using --platform=ios or --platform=android');
    process.exit(1);
}
// Attempt to find .cpuprofile files
const cpuProfiles = findCpuProfileFiles();
if (cpuProfiles.length === 0) {
    console.error('No .cpuprofile files found in the root directory.');
    process.exit(1);
}
else if (cpuProfiles.length > 1) {
    console.error('Multiple .cpuprofile files found. Please specify which one to use by placing only one .cpuprofile in the root or specifying the filename as an argument.');
    process.exit(1);
}
else {
    // Construct the command
    const cpuprofileName = cpuProfiles.at(0);
    const command = `npx react-native-release-profiler --local "${cpuprofileName}" --sourcemap-path "${sourcemapPath}"`;
    console.log(`Executing: ${command}`);
    // Execute the command
    try {
        const output = (0, child_process_1.execSync)(command, { stdio: 'inherit' });
        console.log(output.toString());
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error executing command: ${error.toString()}`);
        }
        process.exit(1);
    }
}
