"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrickRoadForPolicy = void 0;
exports.getChatTabBrickRoadReportID = getChatTabBrickRoadReportID;
exports.getChatTabBrickRoad = getChatTabBrickRoad;
exports.getUnitTranslationKey = getUnitTranslationKey;
exports.getOwnershipChecksDisplayText = getOwnershipChecksDisplayText;
var CONST_1 = require("@src/CONST");
var CurrencyUtils_1 = require("./CurrencyUtils");
/**
 * @returns BrickRoad for the given reportID using reportAttributes
 */
var getBrickRoadForPolicy = function (reportID, reportAttributes) {
    var _a;
    return (_a = reportAttributes === null || reportAttributes === void 0 ? void 0 : reportAttributes[reportID]) === null || _a === void 0 ? void 0 : _a.brickRoadStatus;
};
exports.getBrickRoadForPolicy = getBrickRoadForPolicy;
function getChatTabBrickRoadReportID(orderedReportIDs, reportAttributes) {
    if (!orderedReportIDs.length) {
        return undefined;
    }
    var reportIDWithGBR;
    for (var _i = 0, orderedReportIDs_1 = orderedReportIDs; _i < orderedReportIDs_1.length; _i++) {
        var reportID = orderedReportIDs_1[_i];
        var brickRoad = getBrickRoadForPolicy(reportID, reportAttributes);
        if (brickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO) {
            reportIDWithGBR = reportID;
        }
        if (brickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR) {
            return reportID;
        }
    }
    return reportIDWithGBR;
}
function getChatTabBrickRoad(orderedReportIDs, reportAttributes) {
    var reportID = getChatTabBrickRoadReportID(orderedReportIDs, reportAttributes);
    return reportID ? getBrickRoadForPolicy(reportID, reportAttributes) : undefined;
}
/**
 * @param unit Unit
 * @returns translation key for the unit
 */
function getUnitTranslationKey(unit) {
    var _a;
    var unitTranslationKeysStrategy = (_a = {},
        _a[CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS] = 'common.kilometers',
        _a[CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES] = 'common.miles',
        _a);
    return unitTranslationKeysStrategy[unit];
}
/**
 * @param error workspace change owner error
 * @param translate translation function
 * @param policy policy object
 * @param accountLogin account login/email
 * @returns ownership change checks page display text's
 */
function getOwnershipChecksDisplayText(error, translate, policy, accountLogin) {
    var _a, _b, _c;
    var title;
    var text;
    var buttonText;
    var changeOwner = (_a = policy === null || policy === void 0 ? void 0 : policy.errorFields) === null || _a === void 0 ? void 0 : _a.changeOwner;
    var subscription = changeOwner === null || changeOwner === void 0 ? void 0 : changeOwner.subscription;
    var ownerOwesAmount = changeOwner === null || changeOwner === void 0 ? void 0 : changeOwner.ownerOwesAmount;
    switch (error) {
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.AMOUNT_OWED:
            title = translate('workspace.changeOwner.amountOwedTitle');
            text = translate('workspace.changeOwner.amountOwedText');
            buttonText = translate('workspace.changeOwner.amountOwedButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.OWNER_OWES_AMOUNT:
            title = translate('workspace.changeOwner.ownerOwesAmountTitle');
            text = translate('workspace.changeOwner.ownerOwesAmountText', {
                email: ownerOwesAmount === null || ownerOwesAmount === void 0 ? void 0 : ownerOwesAmount.ownerEmail,
                amount: (0, CurrencyUtils_1.convertToDisplayString)(ownerOwesAmount === null || ownerOwesAmount === void 0 ? void 0 : ownerOwesAmount.amount, ownerOwesAmount === null || ownerOwesAmount === void 0 ? void 0 : ownerOwesAmount.currency),
            });
            buttonText = translate('workspace.changeOwner.ownerOwesAmountButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.SUBSCRIPTION:
            title = translate('workspace.changeOwner.subscriptionTitle');
            text = translate('workspace.changeOwner.subscriptionText', {
                usersCount: subscription === null || subscription === void 0 ? void 0 : subscription.ownerUserCount,
                finalCount: subscription === null || subscription === void 0 ? void 0 : subscription.totalUserCount,
            });
            buttonText = translate('workspace.changeOwner.subscriptionButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.DUPLICATE_SUBSCRIPTION:
            title = translate('workspace.changeOwner.duplicateSubscriptionTitle');
            text = translate('workspace.changeOwner.duplicateSubscriptionText', {
                email: (_b = changeOwner === null || changeOwner === void 0 ? void 0 : changeOwner.duplicateSubscription) !== null && _b !== void 0 ? _b : '',
                workspaceName: (_c = policy === null || policy === void 0 ? void 0 : policy.name) !== null && _c !== void 0 ? _c : '',
            });
            buttonText = translate('workspace.changeOwner.duplicateSubscriptionButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.HAS_FAILED_SETTLEMENTS:
            title = translate('workspace.changeOwner.hasFailedSettlementsTitle');
            text = translate('workspace.changeOwner.hasFailedSettlementsText', { email: accountLogin !== null && accountLogin !== void 0 ? accountLogin : '' });
            buttonText = translate('workspace.changeOwner.hasFailedSettlementsButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.FAILED_TO_CLEAR_BALANCE:
            title = translate('workspace.changeOwner.failedToClearBalanceTitle');
            text = translate('workspace.changeOwner.failedToClearBalanceText');
            buttonText = translate('workspace.changeOwner.failedToClearBalanceButtonText');
            break;
        default:
            title = '';
            text = '';
            buttonText = '';
            break;
    }
    return { title: title, text: text, buttonText: buttonText };
}
