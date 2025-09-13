"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const getChatFSClass = (context, report) => {
    if ((0, ReportUtils_1.isConciergeChatReport)(report)) {
        return CONST_1.default.FULLSTORY.CLASS.UNMASK;
    }
    if ((0, ReportUtils_1.shouldUnmaskChat)(context, report)) {
        return CONST_1.default.FULLSTORY.CLASS.UNMASK;
    }
    return CONST_1.default.FULLSTORY.CLASS.MASK;
};
exports.default = getChatFSClass;
