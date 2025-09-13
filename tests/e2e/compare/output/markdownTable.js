"use strict";
// copied from https://raw.githubusercontent.com/wooorm/markdown-table/main/index.js, turned into cmjs
Object.defineProperty(exports, "__esModule", { value: true });
function serialize(value) {
    return value === null || value === undefined ? '' : String(value);
}
function defaultStringLength(value) {
    return value.length;
}
function toAlignment(value) {
    const code = typeof value === 'string' ? value.codePointAt(0) : 0;
    if (code === 67 /* `C` */ || code === 99 /* `c` */) {
        return 99; /* `c` */
    }
    if (code === 76 /* `L` */ || code === 108 /* `l` */) {
        return 108; /* `l` */
    }
    if (code === 82 /* `R` */ || code === 114 /* `r` */) {
        return 114; /* `r` */
    }
    return 0;
}
/** Generate a markdown ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables)) table.. */
function markdownTable(table, options = {}) {
    const align = (options.align ?? []).concat();
    const stringLength = options.stringLength ?? defaultStringLength;
    /** Character codes as symbols for alignment per column. */
    const alignments = [];
    /** Cells per row. */
    const cellMatrix = [];
    /** Sizes of each cell per row. */
    const sizeMatrix = [];
    const longestCellByColumn = [];
    let mostCellsPerRow = 0;
    let rowIndex = -1;
    // This is a superfluous loop if we don’t align delimiters, but otherwise we’d
    // do superfluous work when aligning, so optimize for aligning.
    while (++rowIndex < table.length) {
        const row = [];
        const sizes = [];
        let columnIndex = -1;
        const rowData = table.at(rowIndex) ?? [];
        if (rowData.length > mostCellsPerRow) {
            mostCellsPerRow = rowData.length;
        }
        while (++columnIndex < rowData.length) {
            const cell = serialize(rowData.at(columnIndex));
            if (options.alignDelimiters !== false) {
                const size = stringLength(cell);
                sizes[columnIndex] = size;
                if (longestCellByColumn.at(columnIndex) === undefined || size > (longestCellByColumn.at(columnIndex) ?? 0)) {
                    longestCellByColumn[columnIndex] = size;
                }
            }
            row.push(cell);
        }
        cellMatrix[rowIndex] = row;
        sizeMatrix[rowIndex] = sizes;
    }
    // Figure out which alignments to use.
    let columnIndex = -1;
    if (typeof align === 'object' && 'length' in align) {
        while (++columnIndex < mostCellsPerRow) {
            alignments[columnIndex] = toAlignment(align.at(columnIndex));
        }
    }
    else {
        const code = toAlignment(align);
        while (++columnIndex < mostCellsPerRow) {
            alignments[columnIndex] = code;
        }
    }
    // Inject the alignment row.
    columnIndex = -1;
    const row = [];
    const sizes = [];
    while (++columnIndex < mostCellsPerRow) {
        const code = alignments.at(columnIndex);
        let before = '';
        let after = '';
        if (code === 99 /* `c` */) {
            before = ':';
            after = ':';
        }
        else if (code === 108 /* `l` */) {
            before = ':';
        }
        else if (code === 114 /* `r` */) {
            after = ':';
        }
        // There *must* be at least one hyphen-minus in each alignment cell.
        let size = options.alignDelimiters === false ? 1 : Math.max(1, (longestCellByColumn.at(columnIndex) ?? 0) - before.length - after.length);
        const cell = before + '-'.repeat(size) + after;
        if (options.alignDelimiters !== false) {
            size = before.length + size + after.length;
            if (size > (longestCellByColumn.at(columnIndex) ?? 0)) {
                longestCellByColumn[columnIndex] = size;
            }
            sizes[columnIndex] = size;
        }
        row[columnIndex] = cell;
    }
    // Inject the alignment row.
    cellMatrix.splice(1, 0, row);
    sizeMatrix.splice(1, 0, sizes);
    rowIndex = -1;
    const lines = [];
    while (++rowIndex < cellMatrix.length) {
        const matrixRow = cellMatrix.at(rowIndex);
        const matrixSizes = sizeMatrix.at(rowIndex);
        columnIndex = -1;
        const line = [];
        while (++columnIndex < mostCellsPerRow) {
            const cell = matrixRow?.at(columnIndex) ?? '';
            let before = '';
            let after = '';
            if (options.alignDelimiters !== false) {
                const size = (longestCellByColumn.at(columnIndex) ?? 0) - (matrixSizes?.at(columnIndex) ?? 0);
                const code = alignments.at(columnIndex);
                if (code === 114 /* `r` */) {
                    before = ' '.repeat(size);
                }
                else if (code === 99 /* `c` */) {
                    if (size % 2) {
                        before = ' '.repeat(size / 2 + 0.5);
                        after = ' '.repeat(size / 2 - 0.5);
                    }
                    else {
                        before = ' '.repeat(size / 2);
                        after = before;
                    }
                }
                else {
                    after = ' '.repeat(size);
                }
            }
            if (options.delimiterStart !== false && !columnIndex) {
                line.push('|');
            }
            if (options.padding !== false &&
                // Don’t add the opening space if we’re not aligning and the cell is
                // empty: there will be a closing space.
                !(options.alignDelimiters === false && cell === '') &&
                (options.delimiterStart !== false || columnIndex)) {
                line.push(' ');
            }
            if (options.alignDelimiters !== false) {
                line.push(before);
            }
            line.push(cell);
            if (options.alignDelimiters !== false) {
                line.push(after);
            }
            if (options.padding !== false) {
                line.push(' ');
            }
            if (options.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) {
                line.push('|');
            }
        }
        lines.push(options.delimiterEnd === false ? line.join('').replace(/ +$/, '') : line.join(''));
    }
    return lines.join('\n');
}
exports.default = markdownTable;
