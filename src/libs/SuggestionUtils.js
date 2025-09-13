"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimLeadingSpace = trimLeadingSpace;
exports.hasEnoughSpaceForLargeSuggestionMenu = hasEnoughSpaceForLargeSuggestionMenu;
exports.getSortedPersonalDetails = getSortedPersonalDetails;
var CONST_1 = require("@src/CONST");
var ReportUtils_1 = require("./ReportUtils");
/**
 * Trims first character of the string if it is a space
 */
function trimLeadingSpace(str) {
    return str.startsWith(' ') ? str.slice(1) : str;
}
/**
 * Checks if space is available to render large suggestion menu
 */
function hasEnoughSpaceForLargeSuggestionMenu(listHeight, composerHeight, totalSuggestions) {
    var maxSuggestions = CONST_1.default.AUTO_COMPLETE_SUGGESTER.MAX_AMOUNT_OF_VISIBLE_SUGGESTIONS_IN_CONTAINER;
    var chatFooterHeight = CONST_1.default.CHAT_FOOTER_SECONDARY_ROW_HEIGHT + 2 * CONST_1.default.CHAT_FOOTER_SECONDARY_ROW_PADDING;
    var availableHeight = listHeight - composerHeight - chatFooterHeight;
    var menuHeight = (!totalSuggestions || totalSuggestions > maxSuggestions ? maxSuggestions : totalSuggestions) * CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT +
        CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTER_INNER_PADDING * 2;
    return availableHeight > menuHeight;
}
function getDisplayName(details) {
    var _a;
    var displayNameFromAccountID = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: details.accountID });
    if (!displayNameFromAccountID) {
        return ((_a = details.login) === null || _a === void 0 ? void 0 : _a.length) ? details.login : '';
    }
    return displayNameFromAccountID;
}
/**
 * Function to sort users. It compares weights, display names, and accountIDs in that order
 */
function getSortedPersonalDetails(personalDetails, localeCompare) {
    return personalDetails.sort(function (first, second) {
        if (first.weight !== second.weight) {
            return first.weight - second.weight;
        }
        var displayNameLoginOrder = localeCompare(getDisplayName(first), getDisplayName(second));
        if (displayNameLoginOrder !== 0) {
            return displayNameLoginOrder;
        }
        return first.accountID - second.accountID;
    });
}
