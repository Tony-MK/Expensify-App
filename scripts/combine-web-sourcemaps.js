"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/await-thenable */
const fs_1 = require("fs");
const path_1 = require("path");
const source_map_1 = require("source-map");
const parseCommandLineArguments_1 = require("./utils/parseCommandLineArguments");
const argsMap = (0, parseCommandLineArguments_1.default)();
const distDir = path_1.default.resolve(__dirname, '..', argsMap.path ?? 'dist');
const outputFile = path_1.default.join(distDir, 'merged-source-map.js.map');
async function mergeSourceMaps() {
    // Read all .map files in the dist directory
    const sourceMapFiles = fs_1.default
        .readdirSync(distDir)
        .filter((file) => file.endsWith('.map'))
        .map((file) => path_1.default.join(distDir, file));
    const mergedGenerator = new source_map_1.SourceMapGenerator();
    for (const file of sourceMapFiles) {
        const sourceMapContent = JSON.parse(fs_1.default.readFileSync(file, 'utf8'));
        const consumer = await new source_map_1.SourceMapConsumer(sourceMapContent);
        consumer.eachMapping((mapping) => {
            if (!mapping.source) {
                return;
            }
            mergedGenerator.addMapping({
                generated: {
                    line: mapping.generatedLine,
                    column: mapping.generatedColumn,
                },
                original: {
                    line: mapping.originalLine,
                    column: mapping.originalColumn,
                },
                source: mapping.source,
                name: mapping.name,
            });
        });
        // Add the sources content
        consumer.sources.forEach((sourceFile) => {
            const content = consumer.sourceContentFor(sourceFile);
            if (content) {
                mergedGenerator.setSourceContent(sourceFile, content);
            }
        });
        consumer.destroy();
    }
    // Write the merged source map to a file
    fs_1.default.writeFileSync(outputFile, mergedGenerator.toString());
    console.log(`Merged source map written to ${outputFile}`);
}
mergeSourceMaps().catch(console.error);
