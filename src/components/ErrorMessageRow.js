"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapValues_1 = require("lodash/mapValues");
const react_1 = require("react");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const MessagesRow_1 = require("./MessagesRow");
function ErrorMessageRow({ errors, errorRowStyles, onClose, canDismissError = true, dismissError }) {
    // Some errors have a null message. This is used to apply opacity only and to avoid showing redundant messages.
    const errorEntries = Object.entries(errors ?? {});
    const filteredErrorEntries = errorEntries.filter((errorEntry) => errorEntry[1] !== null);
    const errorMessages = (0, mapValues_1.default)(Object.fromEntries(filteredErrorEntries), (error) => error);
    const hasErrorMessages = !(0, EmptyObject_1.isEmptyObject)(errorMessages);
    return hasErrorMessages ? (<MessagesRow_1.default messages={errorMessages} type="error" onClose={onClose} containerStyles={errorRowStyles} canDismiss={canDismissError} dismissError={dismissError}/>) : null;
}
ErrorMessageRow.displayName = 'ErrorMessageRow';
exports.default = ErrorMessageRow;
