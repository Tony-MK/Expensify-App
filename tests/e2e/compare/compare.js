"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareResults = compareResults;
const math_1 = require("../measure/math");
const math = require("./math");
const console_1 = require("./output/console");
const markdown_1 = require("./output/markdown");
/*
 * base implementation from: https://github.com/callstack/reassure/blob/main/packages/reassure-compare/src/compare.ts
 * This module reads from the baseline and compare files and compares the results.
 * It has a few different output formats:
 * - console: prints the results to the console
 * - markdown: Writes the results in markdown format to a file
 */
/**
 * Probability threshold for considering given difference significant.
 */
const PROBABILITY_CONSIDERED_SIGNIFICANCE = 0.02;
/**
 * Duration threshold (in ms) for treating given difference as significant.
 *
 * This is additional filter, in addition to probability threshold above.
 * Too small duration difference might be result of measurement grain of 1 ms.
 */
const DURATION_DIFF_THRESHOLD_SIGNIFICANCE = 100;
const LowerIsBetter = {
    ms: true,
    MB: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '%': true,
    renders: true,
    FPS: false,
};
function buildCompareEntry(name, compare, baseline, unit) {
    const diff = compare.mean - baseline.mean;
    const relativeDurationDiff = diff / baseline.mean;
    const z = math.computeZ(baseline.mean, baseline.stdev, compare.mean, compare.runs);
    const prob = math.computeProbability(z);
    const isDurationDiffOfSignificance = prob < PROBABILITY_CONSIDERED_SIGNIFICANCE && Math.abs(diff) >= DURATION_DIFF_THRESHOLD_SIGNIFICANCE;
    return {
        unit,
        name,
        baseline,
        current: compare,
        diff,
        relativeDurationDiff: LowerIsBetter[unit] ? relativeDurationDiff : -relativeDurationDiff,
        isDurationDiffOfSignificance,
    };
}
/**
 * Compare results between baseline and current entries and categorize.
 */
function compareResults(baselineEntries, compareEntries = baselineEntries, metricForTest = {}) {
    // Unique test scenario names
    const baselineKeys = Object.keys(baselineEntries ?? {});
    const names = Array.from(new Set([...baselineKeys]));
    const compared = [];
    if (typeof compareEntries !== 'string' && typeof baselineEntries !== 'string') {
        names.forEach((name) => {
            const current = compareEntries[name];
            const baseline = baselineEntries[name];
            const currentStats = (0, math_1.default)(baseline);
            const deltaStats = (0, math_1.default)(current);
            if (baseline && current) {
                compared.push(buildCompareEntry(name, deltaStats, currentStats, metricForTest[name]));
            }
        });
    }
    const significance = compared.filter((item) => item.isDurationDiffOfSignificance);
    const meaningless = compared.filter((item) => !item.isDurationDiffOfSignificance);
    return {
        significance,
        meaningless,
    };
}
exports.default = (main, delta, { outputDir, outputFormat = 'all', metricForTest = {}, skippedTests }) => {
    // IMPORTANT NOTE: make sure you are passing the main/baseline results first, then the delta/compare results:
    const outputData = compareResults(main, delta, metricForTest);
    if (outputFormat === 'console' || outputFormat === 'all') {
        (0, console_1.default)(outputData, skippedTests);
    }
    if (outputFormat === 'markdown' || outputFormat === 'all') {
        return (0, markdown_1.default)(outputDir, outputData, skippedTests);
    }
};
