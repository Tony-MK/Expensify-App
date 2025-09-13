"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMetricDiffChange = exports.getDurationSymbols = exports.formatChange = exports.formatMetricChange = exports.formatMetric = exports.formatPercentChange = exports.formatPercent = void 0;
const formatPercent = (value) => {
    const valueAsPercent = value * 100;
    return `${valueAsPercent.toFixed(1)}%`;
};
exports.formatPercent = formatPercent;
const formatPercentChange = (value) => {
    const absValue = Math.abs(value);
    // Round to zero
    if (absValue < 0.005) {
        return '±0.0%';
    }
    return `${value >= 0 ? '+' : '-'}${formatPercent(absValue)}`;
};
exports.formatPercentChange = formatPercentChange;
const formatMetric = (duration, unit) => `${duration.toFixed(3)} ${unit}`;
exports.formatMetric = formatMetric;
const formatMetricChange = (value, unit) => {
    if (value > 0) {
        return `+${formatMetric(value, unit)}`;
    }
    if (value < 0) {
        return `${formatMetric(value, unit)}`;
    }
    return `0 ${unit}`;
};
exports.formatMetricChange = formatMetricChange;
const formatChange = (value) => {
    if (value > 0) {
        return `+${value}`;
    }
    if (value < 0) {
        return `${value}`;
    }
    return '0';
};
exports.formatChange = formatChange;
const getDurationSymbols = (entry) => {
    if (!entry.isDurationDiffOfSignificance) {
        if (entry.relativeDurationDiff > 0.15) {
            return '🟡';
        }
        if (entry.relativeDurationDiff < -0.15) {
            return '🟢';
        }
        return '';
    }
    if (entry.relativeDurationDiff > 0.33) {
        return '🔴🔴';
    }
    if (entry.relativeDurationDiff > 0.05) {
        return '🔴';
    }
    if (entry.relativeDurationDiff < -0.33) {
        return '🟢🟢';
    }
    if (entry.relativeDurationDiff < -0.05) {
        return ' 🟢';
    }
    return '';
};
exports.getDurationSymbols = getDurationSymbols;
const formatMetricDiffChange = (entry) => {
    const { baseline, current } = entry;
    let output = `${formatMetric(baseline.mean, entry.unit)} → ${formatMetric(current.mean, entry.unit)}`;
    if (baseline.mean !== current.mean) {
        output += ` (${formatMetricChange(entry.diff, entry.unit)}, ${formatPercentChange(entry.relativeDurationDiff)})`;
    }
    output += ` ${getDurationSymbols(entry)}`;
    return output;
};
exports.formatMetricDiffChange = formatMetricDiffChange;
