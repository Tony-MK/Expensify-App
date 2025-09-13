"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("@styles/variables");
const ITEM_HEIGHTS = {
    // Constants for wide screen layout
    WIDE: {
        STANDARD: variables_1.default.optionRowWideItemHeight + variables_1.default.optionRowListItemPadding,
    },
    // Constants for narrow screen with drawer
    NARROW_WITH_DRAWER: {
        STANDARD: variables_1.default.optionRowNarrowWithDrawerItemHeight + variables_1.default.optionRowListItemPadding,
        WITH_BUTTON: variables_1.default.optionRowNarrowWithDrawerItemHeightWithButton + variables_1.default.optionRowListItemPadding,
    },
    // Constants for narrow screen without drawer (mobile-like)
    NARROW_WITHOUT_DRAWER: {
        STANDARD: variables_1.default.optionRowNarrowWithoutDrawerItemHeight + variables_1.default.optionRowListItemPadding,
        WITH_BUTTON: variables_1.default.optionRowNarrowWithoutDrawerItemHeightWithButton + variables_1.default.optionRowListItemPadding,
    },
    // Chat-specific heights
    CHAT: {
        REPORT_PREVIEW: variables_1.default.searchChatReportPreviewHeight + variables_1.default.searchItemBasePadding,
        // Standard chat item heights (ADDCOMMENT, POLICYCHANGELOG_ADD_EMPLOYEE, etc.)
        STANDARD: variables_1.default.searchChatStandardItemHeight + variables_1.default.searchItemBasePadding,
    },
    HEADER: variables_1.default.optionRowSearchHeaderHeight,
};
exports.default = ITEM_HEIGHTS;
