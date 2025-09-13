"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getHistoryParamParse = (historyParamName) => ({
    [historyParamName]: (value) => value === 'true',
});
exports.default = getHistoryParamParse;
