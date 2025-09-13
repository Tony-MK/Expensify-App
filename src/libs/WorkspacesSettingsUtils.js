"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrickRoadForPolicy = void 0;
exports.getChatTabBrickRoadReportID = getChatTabBrickRoadReportID;
exports.getChatTabBrickRoad = getChatTabBrickRoad;
exports.getUnitTranslationKey = getUnitTranslationKey;
exports.getOwnershipChecksDisplayText = getOwnershipChecksDisplayText;
const CONST_1 = require("@src/CONST");
const CurrencyUtils_1 = require("./CurrencyUtils");
/**
 * @returns BrickRoad for the given reportID using reportAttributes
 */
const getBrickRoadForPolicy = (reportID, reportAttributes) => {
    return reportAttributes?.[reportID]?.brickRoadStatus;
};
exports.getBrickRoadForPolicy = getBrickRoadForPolicy;
function getChatTabBrickRoadReportID(orderedReportIDs, reportAttributes) {
    if (!orderedReportIDs.length) {
        return undefined;
    }
    let reportIDWithGBR;
    for (const reportID of orderedReportIDs) {
        const brickRoad = getBrickRoadForPolicy(reportID, reportAttributes);
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
    const reportID = getChatTabBrickRoadReportID(orderedReportIDs, reportAttributes);
    return reportID ? getBrickRoadForPolicy(reportID, reportAttributes) : undefined;
}
/**
 * @param unit Unit
 * @returns translation key for the unit
 */
function getUnitTranslationKey(unit) {
    const unitTranslationKeysStrategy = {
        [CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS]: 'common.kilometers',
        [CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES]: 'common.miles',
    };
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
    let title;
    let text;
    let buttonText;
    const changeOwner = policy?.errorFields?.changeOwner;
    const subscription = changeOwner?.subscription;
    const ownerOwesAmount = changeOwner?.ownerOwesAmount;
    switch (error) {
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.AMOUNT_OWED:
            title = translate('workspace.changeOwner.amountOwedTitle');
            text = translate('workspace.changeOwner.amountOwedText');
            buttonText = translate('workspace.changeOwner.amountOwedButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.OWNER_OWES_AMOUNT:
            title = translate('workspace.changeOwner.ownerOwesAmountTitle');
            text = translate('workspace.changeOwner.ownerOwesAmountText', {
                email: ownerOwesAmount?.ownerEmail,
                amount: (0, CurrencyUtils_1.convertToDisplayString)(ownerOwesAmount?.amount, ownerOwesAmount?.currency),
            });
            buttonText = translate('workspace.changeOwner.ownerOwesAmountButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.SUBSCRIPTION:
            title = translate('workspace.changeOwner.subscriptionTitle');
            text = translate('workspace.changeOwner.subscriptionText', {
                usersCount: subscription?.ownerUserCount,
                finalCount: subscription?.totalUserCount,
            });
            buttonText = translate('workspace.changeOwner.subscriptionButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.DUPLICATE_SUBSCRIPTION:
            title = translate('workspace.changeOwner.duplicateSubscriptionTitle');
            text = translate('workspace.changeOwner.duplicateSubscriptionText', {
                email: changeOwner?.duplicateSubscription ?? '',
                workspaceName: policy?.name ?? '',
            });
            buttonText = translate('workspace.changeOwner.duplicateSubscriptionButtonText');
            break;
        case CONST_1.default.POLICY.OWNERSHIP_ERRORS.HAS_FAILED_SETTLEMENTS:
            title = translate('workspace.changeOwner.hasFailedSettlementsTitle');
            text = translate('workspace.changeOwner.hasFailedSettlementsText', { email: accountLogin ?? '' });
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
    return { title, text, buttonText };
}
