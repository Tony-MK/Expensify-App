"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMarkdown = void 0;
// From: https://raw.githubusercontent.com/callstack/reassure/main/packages/reassure-compare/src/output/markdown.ts
const promises_1 = require("node:fs/promises");
const path_1 = require("path");
const Logger = require("../../utils/logger");
const format = require("./format");
const markdownTable_1 = require("./markdownTable");
const MAX_CHARACTERS_PER_FILE = 65536;
const FILE_SIZE_SAFETY_MARGIN = 1000;
const MAX_CHARACTERS_PER_FILE_WITH_SAFETY_MARGIN = MAX_CHARACTERS_PER_FILE - FILE_SIZE_SAFETY_MARGIN;
const tableHeader = ['Name', 'Duration'];
const collapsibleSection = (title, content) => `<details>\n<summary>${title}</summary>\n\n${content}\n</details>\n\n`;
const buildDurationDetails = (title, entry, unit) => {
    const relativeStdev = entry.stdev / entry.mean;
    return [
        `**${title}**`,
        `Mean: ${format.formatMetric(entry.mean, unit)}`,
        `Stdev: ${format.formatMetric(entry.stdev, unit)} (${format.formatPercent(relativeStdev)})`,
        entry.entries ? `Runs: ${entry.entries.join(' ')}` : '',
    ]
        .filter(Boolean)
        .join('<br/>');
};
const buildDurationDetailsEntry = (entry) => ['baseline' in entry ? buildDurationDetails('Baseline', entry.baseline, entry.unit) : '', 'current' in entry ? buildDurationDetails('Current', entry.current, entry.unit) : '']
    .filter(Boolean)
    .join('<br/><br/>');
const formatEntryDuration = (entry) => {
    if ('baseline' in entry && 'current' in entry) {
        return format.formatMetricDiffChange(entry);
    }
    if ('baseline' in entry) {
        return format.formatMetric(entry.baseline.mean, entry.unit);
    }
    if ('current' in entry) {
        return format.formatMetric(entry.current.mean, entry.unit);
    }
    return '';
};
const buildDetailsTable = (entries, numberOfTables = 1) => {
    if (!entries.length) {
        return [''];
    }
    // We always need at least one table
    const safeNumberOfTables = numberOfTables === 0 ? 1 : numberOfTables;
    const entriesPerTable = Math.floor(entries.length / safeNumberOfTables);
    const tables = [];
    for (let i = 0; i < safeNumberOfTables; i++) {
        const start = i * entriesPerTable;
        const end = i === safeNumberOfTables - 1 ? entries.length : start + entriesPerTable;
        const tableEntries = entries.slice(start, end);
        const rows = tableEntries.map((entry) => [entry.name, buildDurationDetailsEntry(entry)]);
        const content = (0, markdownTable_1.default)([tableHeader, ...rows]);
        const tableMarkdown = collapsibleSection('Show details', content);
        tables.push(tableMarkdown);
    }
    return tables;
};
const buildSummaryTable = (entries, collapse = false) => {
    if (!entries.length) {
        return '_There are no entries_';
    }
    const rows = entries.map((entry) => [entry.name, formatEntryDuration(entry)]);
    const content = (0, markdownTable_1.default)([tableHeader, ...rows]);
    return collapse ? collapsibleSection('Show entries', content) : content;
};
const buildMarkdown = (data, skippedTests, numberOfExtraFiles) => {
    let singleFileOutput;
    let nExtraFiles = numberOfExtraFiles ?? 0;
    // If the user didn't specify the number of extra files, calculate it based on the size of the single file
    if (numberOfExtraFiles === undefined) {
        singleFileOutput = buildMarkdown(data, skippedTests, 0)[0];
        const totalCharacters = singleFileOutput.length ?? 0;
        // If the single file is small enough, return it
        if (totalCharacters <= MAX_CHARACTERS_PER_FILE_WITH_SAFETY_MARGIN) {
            return [singleFileOutput];
        }
        // Otherwise, calculate the number of extra files needed
        nExtraFiles = Math.ceil(totalCharacters / MAX_CHARACTERS_PER_FILE_WITH_SAFETY_MARGIN);
    }
    let mainFile = '## Performance Comparison Report 📊';
    mainFile += nExtraFiles > 0 ? ` (1/${nExtraFiles + 1})` : '';
    if (data.errors?.length) {
        mainFile += '\n\n### Errors\n';
        data.errors.forEach((message) => {
            mainFile += ` 1. 🛑 ${message}\n`;
        });
    }
    if (data.warnings?.length) {
        mainFile += '\n\n### Warnings\n';
        data.warnings.forEach((message) => {
            mainFile += ` 1. 🟡 ${message}\n`;
        });
    }
    if (skippedTests.length > 0) {
        mainFile += `\n\n⚠️ Some tests did not pass successfully, so some results are omitted from final report: ${skippedTests.join(', ')}`;
    }
    mainFile += '\n\n### Significant Changes To Duration';
    mainFile += `\n${buildSummaryTable(data.significance)}`;
    mainFile += `\n${buildDetailsTable(data.significance, 1).at(0)}`;
    // We always need at least one table
    const numberOfMeaninglessDetailsTables = nExtraFiles === 0 ? 1 : nExtraFiles;
    const meaninglessDetailsTables = buildDetailsTable(data.meaningless, numberOfMeaninglessDetailsTables);
    if (nExtraFiles === 0) {
        mainFile += '\n\n### Meaningless Changes To Duration';
        mainFile += `\n${buildSummaryTable(data.meaningless, true)}`;
        mainFile += `\n${meaninglessDetailsTables.at(0)}`;
        return [mainFile];
    }
    const extraFiles = [];
    for (let i = 0; i < nExtraFiles; i++) {
        let extraFile = '## Performance Comparison Report 📊';
        extraFile += ` (${i + 2}/${nExtraFiles + 1})`;
        extraFile += '\n\n### Meaningless Changes To Duration';
        extraFile += nExtraFiles >= 2 ? ` (${i + 1}/${nExtraFiles})` : '';
        extraFile += `\n${buildSummaryTable(data.meaningless, true)}`;
        extraFile += `\n${meaninglessDetailsTables.at(i)}`;
        extraFile += '\n';
        extraFiles.push(extraFile);
    }
    return [mainFile, ...extraFiles];
};
exports.buildMarkdown = buildMarkdown;
const writeToFile = (filePath, content) => promises_1.default
    .writeFile(filePath, content)
    .then(() => {
    Logger.info(`✅  Written output markdown output file ${filePath}`);
    Logger.info(`🔗 ${path_1.default.resolve(filePath)}\n`);
})
    .catch((error) => {
    Logger.info(`❌  Could not write markdown output file ${filePath}`);
    Logger.info(`🔗 ${path_1.default.resolve(filePath)}`);
    console.error(error);
    throw error;
});
const writeToMarkdown = (outputDir, data, skippedTests) => {
    const markdownFiles = buildMarkdown(data, skippedTests);
    const filesString = markdownFiles.join('\n\n');
    Logger.info('Markdown was built successfully, writing to file...', filesString);
    if (markdownFiles.length === 1) {
        return writeToFile(path_1.default.join(outputDir, 'output1.md'), markdownFiles[0]);
    }
    return Promise.all(markdownFiles.map((file, index) => {
        const filePath = `${outputDir}/output${index + 1}.md`;
        return writeToFile(filePath, file).catch((error) => {
            console.error(error);
            throw error;
        });
    }));
};
exports.default = writeToMarkdown;
