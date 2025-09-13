"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORMULA_PART_TYPES = void 0;
exports.compute = compute;
exports.extract = extract;
exports.parse = parse;
var CONST_1 = require("@src/CONST");
var CurrencyUtils_1 = require("./CurrencyUtils");
var ReportActionsUtils_1 = require("./ReportActionsUtils");
var ReportUtils_1 = require("./ReportUtils");
var TransactionUtils_1 = require("./TransactionUtils");
var FORMULA_PART_TYPES = {
    REPORT: 'report',
    FIELD: 'field',
    USER: 'user',
    FREETEXT: 'freetext',
};
exports.FORMULA_PART_TYPES = FORMULA_PART_TYPES;
/**
 * Extract formula parts from a formula string, handling nested braces and escapes
 * Based on OldDot Formula.extract method
 */
function extract(formula, opener, closer) {
    if (opener === void 0) { opener = '{'; }
    if (closer === void 0) { closer = '}'; }
    if (!formula || typeof formula !== 'string') {
        return [];
    }
    var letters = formula.split('');
    var sections = [];
    var nesting = 0;
    var start = 0;
    for (var i = 0; i < letters.length; i++) {
        // Found an escape character, skip the next character
        if (letters.at(i) === '\\') {
            i++;
            continue;
        }
        // Found an opener, save the spot
        if (letters.at(i) === opener) {
            if (nesting === 0) {
                start = i;
            }
            nesting++;
        }
        // Found a closer, decrement the nesting and possibly extract it
        if (letters.at(i) === closer && nesting > 0) {
            nesting--;
            if (nesting === 0) {
                sections.push(formula.substring(start, i + 1));
            }
        }
    }
    return sections;
}
/**
 * Parse a formula string into an array of formula parts
 * Based on OldDot Formula.parse method
 */
function parse(formula) {
    if (!formula || typeof formula !== 'string') {
        return [];
    }
    var parts = [];
    var formulaParts = extract(formula);
    // If no formula parts found, treat the entire string as free text
    if (formulaParts.length === 0) {
        if (formula.trim()) {
            parts.push({
                definition: formula,
                type: FORMULA_PART_TYPES.FREETEXT,
                fieldPath: [],
                functions: [],
            });
        }
        return parts;
    }
    // Process the formula by splitting on formula parts to preserve free text
    var lastIndex = 0;
    formulaParts.forEach(function (part) {
        var partIndex = formula.indexOf(part, lastIndex);
        // Add any free text before this formula part
        if (partIndex > lastIndex) {
            var freeText = formula.substring(lastIndex, partIndex);
            if (freeText) {
                parts.push({
                    definition: freeText,
                    type: FORMULA_PART_TYPES.FREETEXT,
                    fieldPath: [],
                    functions: [],
                });
            }
        }
        // Add the formula part
        parts.push(parsePart(part));
        lastIndex = partIndex + part.length;
    });
    // Add any remaining free text after the last formula part
    if (lastIndex < formula.length) {
        var freeText = formula.substring(lastIndex);
        if (freeText) {
            parts.push({
                definition: freeText,
                type: FORMULA_PART_TYPES.FREETEXT,
                fieldPath: [],
                functions: [],
            });
        }
    }
    return parts;
}
/**
 * Parse a single formula part definition into a FormulaPart object
 * Based on OldDot Formula.parsePart method
 */
function parsePart(definition) {
    var _a, _b;
    var part = {
        definition: definition,
        type: FORMULA_PART_TYPES.FREETEXT,
        fieldPath: [],
        functions: [],
    };
    // If it doesn't start and end with braces, it's free text
    if (!definition.startsWith('{') || !definition.endsWith('}')) {
        return part;
    }
    // Remove the braces and trim
    var cleanDefinition = definition.slice(1, -1).trim();
    if (!cleanDefinition) {
        return part;
    }
    // Split on | to separate functions
    var segments = cleanDefinition.split('|');
    var fieldSegment = segments.at(0);
    var functions = segments.slice(1);
    // Split the field segment on : to get the field path
    var fieldPath = fieldSegment === null || fieldSegment === void 0 ? void 0 : fieldSegment.split(':');
    var type = (_a = fieldPath === null || fieldPath === void 0 ? void 0 : fieldPath.at(0)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    // Determine the formula part type
    if (type === 'report') {
        part.type = FORMULA_PART_TYPES.REPORT;
    }
    else if (type === 'field') {
        part.type = FORMULA_PART_TYPES.FIELD;
    }
    else if (type === 'user') {
        part.type = FORMULA_PART_TYPES.USER;
    }
    // Set field path (excluding the type)
    part.fieldPath = (_b = fieldPath === null || fieldPath === void 0 ? void 0 : fieldPath.slice(1)) !== null && _b !== void 0 ? _b : [];
    part.functions = functions;
    return part;
}
/**
 * Compute the value of a formula given a context
 */
function compute(formula, context) {
    if (!formula || typeof formula !== 'string') {
        return '';
    }
    var parts = parse(formula);
    var result = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        var value = '';
        switch (part.type) {
            case FORMULA_PART_TYPES.REPORT:
                value = computeReportPart(part, context);
                value = value === '' ? part.definition : value;
                break;
            case FORMULA_PART_TYPES.FIELD:
                value = computeFieldPart(part);
                break;
            case FORMULA_PART_TYPES.USER:
                value = computeUserPart(part);
                break;
            case FORMULA_PART_TYPES.FREETEXT:
                value = part.definition;
                break;
            default:
                // If we don't recognize the part type, use the original definition
                value = part.definition;
        }
        // Apply any functions to the computed value
        value = applyFunctions(value, part.functions);
        result += value;
    }
    return result;
}
/**
 * Compute the value of a report formula part
 */
function computeReportPart(part, context) {
    var _a, _b, _c, _d;
    var report = context.report, policy = context.policy;
    var _e = part.fieldPath, field = _e[0], format = _e[1];
    if (!field) {
        return part.definition;
    }
    switch (field.toLowerCase()) {
        case 'type':
            return formatType(report.type);
        case 'startdate':
            return formatDate(getOldestTransactionDate(report.reportID, context), format);
        case 'total':
            return formatAmount(report.total, (_b = (0, CurrencyUtils_1.getCurrencySymbol)((_a = report.currency) !== null && _a !== void 0 ? _a : '')) !== null && _b !== void 0 ? _b : report.currency);
        case 'currency':
            return (_c = report.currency) !== null && _c !== void 0 ? _c : '';
        case 'policyname':
        case 'workspacename':
            return (_d = policy === null || policy === void 0 ? void 0 : policy.name) !== null && _d !== void 0 ? _d : '';
        case 'created':
            // Backend will always return at least one report action (of type created) and its date is equal to report's creation date
            // We can make it slightly more efficient in the future by ensuring report.created is always present in backend's responses
            return formatDate(getOldestReportActionDate(report.reportID), format);
        default:
            return part.definition;
    }
}
/**
 * Compute the value of a field formula part
 */
function computeFieldPart(part) {
    // Field computation will be implemented later
    return part.definition;
}
/**
 * Compute the value of a user formula part
 */
function computeUserPart(part) {
    // User computation will be implemented later
    return part.definition;
}
/**
 * Apply functions to a computed value
 */
function applyFunctions(value, functions) {
    var result = value;
    for (var _i = 0, functions_1 = functions; _i < functions_1.length; _i++) {
        var func = functions_1[_i];
        var _a = func.split(':'), functionName = _a[0], args = _a.slice(1);
        switch (functionName.toLowerCase()) {
            case 'frontpart':
                result = getFrontPart(result);
                break;
            case 'substr':
                result = getSubstring(result, args);
                break;
            case 'domain':
                result = getDomainName(result);
                break;
            default:
                // Unknown function, leave value as is
                break;
        }
    }
    return result;
}
/**
 * Get the front part of an email or first word of a string
 */
function getFrontPart(value) {
    var _a, _b;
    var trimmed = value.trim();
    // If it's an email, return the part before @
    if (trimmed.includes('@')) {
        return (_a = trimmed.split('@').at(0)) !== null && _a !== void 0 ? _a : '';
    }
    // Otherwise, return the first word
    return (_b = trimmed.split(' ').at(0)) !== null && _b !== void 0 ? _b : '';
}
/**
 * Get the domain name of an email or URL
 */
function getDomainName(value) {
    var _a;
    var trimmed = value.trim();
    // If it's an email, return the part after @
    if (trimmed.includes('@')) {
        return (_a = trimmed.split('@').at(1)) !== null && _a !== void 0 ? _a : '';
    }
    return '';
}
/**
 * Get substring of a value
 */
function getSubstring(value, args) {
    var _a, _b;
    var start = parseInt((_a = args.at(0)) !== null && _a !== void 0 ? _a : '', 10) || 0;
    var length = args.at(1) ? parseInt((_b = args.at(1)) !== null && _b !== void 0 ? _b : '', 10) : undefined;
    if (length !== undefined) {
        return value.substring(start, start + length);
    }
    return value.substring(start);
}
/**
 * Format a date value with support for multiple date formats
 */
function formatDate(dateString, format) {
    if (format === void 0) { format = 'yyyy-MM-dd'; }
    if (!dateString) {
        return '';
    }
    try {
        var date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        switch (format) {
            case 'M/dd/yyyy':
                return "".concat(month, "/").concat(day.toString().padStart(2, '0'), "/").concat(year);
            case 'MMMM dd, yyyy':
                return "".concat(monthNames.at(month - 1), " ").concat(day.toString().padStart(2, '0'), ", ").concat(year);
            case 'dd MMM yyyy':
                return "".concat(day.toString().padStart(2, '0'), " ").concat(shortMonthNames.at(month - 1), " ").concat(year);
            case 'yyyy/MM/dd':
                return "".concat(year, "/").concat(month.toString().padStart(2, '0'), "/").concat(day.toString().padStart(2, '0'));
            case 'MMMM, yyyy':
                return "".concat(monthNames.at(month - 1), ", ").concat(year);
            case 'yy/MM/dd':
                return "".concat(year.toString().slice(-2), "/").concat(month.toString().padStart(2, '0'), "/").concat(day.toString().padStart(2, '0'));
            case 'dd/MM/yy':
                return "".concat(day.toString().padStart(2, '0'), "/").concat(month.toString().padStart(2, '0'), "/").concat(year.toString().slice(-2));
            case 'yyyy':
                return year.toString();
            case 'MM/dd/yyyy':
                return "".concat(month.toString().padStart(2, '0'), "/").concat(day.toString().padStart(2, '0'), "/").concat(year);
            case 'yyyy-MM-dd':
            default:
                return "".concat(year, "-").concat(month.toString().padStart(2, '0'), "-").concat(day.toString().padStart(2, '0'));
        }
    }
    catch (_a) {
        return '';
    }
}
/**
 * Format an amount value
 */
function formatAmount(amount, currency) {
    if (amount === undefined) {
        return '';
    }
    var absoluteAmount = Math.abs(amount);
    var formattedAmount = (absoluteAmount / 100).toFixed(2);
    if (currency) {
        return "".concat(currency).concat(formattedAmount);
    }
    return formattedAmount;
}
/**
 * Get the date of the oldest report action for a given report
 */
function getOldestReportActionDate(reportID) {
    if (!reportID) {
        return undefined;
    }
    var reportActions = (0, ReportActionsUtils_1.getAllReportActions)(reportID);
    if (!reportActions || Object.keys(reportActions).length === 0) {
        return undefined;
    }
    var oldestDate;
    Object.values(reportActions).forEach(function (action) {
        if (!(action === null || action === void 0 ? void 0 : action.created)) {
            return;
        }
        if (oldestDate && action.created > oldestDate) {
            return;
        }
        oldestDate = action.created;
    });
    return oldestDate;
}
/**
 * Format a report type to its human-readable string
 */
function formatType(type) {
    var _a;
    if (!type) {
        return '';
    }
    var typeMapping = (_a = {},
        _a[CONST_1.default.REPORT.TYPE.EXPENSE] = 'Expense Report',
        _a[CONST_1.default.REPORT.TYPE.INVOICE] = 'Invoice',
        _a[CONST_1.default.REPORT.TYPE.CHAT] = 'Chat',
        _a[CONST_1.default.REPORT.UNSUPPORTED_TYPE.BILL] = 'Bill',
        _a[CONST_1.default.REPORT.UNSUPPORTED_TYPE.PAYCHECK] = 'Paycheck',
        _a[CONST_1.default.REPORT.TYPE.IOU] = 'IOU',
        _a[CONST_1.default.REPORT.TYPE.TASK] = 'Task',
        _a.trip = 'Trip',
        _a);
    return typeMapping[type.toLowerCase()] || type;
}
/**
 * Get the date of the oldest transaction for a given report
 */
function getOldestTransactionDate(reportID, context) {
    if (!reportID) {
        return undefined;
    }
    var transactions = (0, ReportUtils_1.getReportTransactions)(reportID);
    if (!transactions || transactions.length === 0) {
        return new Date().toISOString();
    }
    var oldestDate;
    transactions.forEach(function (transaction) {
        // Use updated transaction data if available and matches this transaction
        var currentTransaction = (context === null || context === void 0 ? void 0 : context.transaction) && transaction.transactionID === context.transaction.transactionID ? context.transaction : transaction;
        var created = (0, TransactionUtils_1.getCreated)(currentTransaction);
        if (!created) {
            return;
        }
        if (oldestDate && created >= oldestDate) {
            return;
        }
        if ((0, TransactionUtils_1.isPartialTransaction)(currentTransaction)) {
            return;
        }
        oldestDate = created;
    });
    return oldestDate;
}
