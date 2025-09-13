"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useOnyx_1 = require("react-native-onyx/dist/useOnyx");
var useCardFeeds_1 = require("@hooks/useCardFeeds");
var useLocalize_1 = require("@hooks/useLocalize");
var usePermissions_1 = require("@hooks/usePermissions");
var CompanyCards_1 = require("@libs/actions/CompanyCards");
var Navigation_1 = require("@libs/Navigation/Navigation");
var WorkspaceCompanyCardStatementCloseDateSelectionList_1 = require("@pages/workspace/companyCards/WorkspaceCompanyCardStatementCloseDateSelectionList");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function StatementCloseDateStep(_a) {
    var _b;
    var policyID = _a.policyID;
    var translate = (0, useLocalize_1.default)().translate;
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var addNewCard = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: false })[0];
    var lastSelectedFeed = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED).concat(policyID), { canBeMissing: true })[0];
    var cardFeeds = (0, useCardFeeds_1.default)(policyID)[0];
    var isPlaid = isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) && !!((_b = addNewCard === null || addNewCard === void 0 ? void 0 : addNewCard.data) === null || _b === void 0 ? void 0 : _b.publicToken);
    var submit = (0, react_1.useCallback)(function (statementPeriodEnd, statementPeriodEndDay) {
        if (isPlaid) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: CONST_1.default.COMPANY_CARDS.STEP.BANK_CONNECTION,
                // Fallback to null to clear old value (if any) because `undefined` is a no-op in Onyx.merge
                data: { statementPeriodEnd: statementPeriodEnd !== null && statementPeriodEnd !== void 0 ? statementPeriodEnd : null, statementPeriodEndDay: statementPeriodEndDay !== null && statementPeriodEndDay !== void 0 ? statementPeriodEndDay : null },
            });
            return;
        }
        if (addNewCard === null || addNewCard === void 0 ? void 0 : addNewCard.data.feedDetails) {
            (0, CompanyCards_1.addNewCompanyCardsFeed)(policyID, addNewCard.data.feedType, addNewCard.data.feedDetails, cardFeeds, statementPeriodEnd, statementPeriodEndDay, lastSelectedFeed);
            Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID));
        }
    }, [policyID, addNewCard, cardFeeds, lastSelectedFeed, isPlaid]);
    var goBack = (0, react_1.useCallback)(function () {
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: isPlaid ? CONST_1.default.COMPANY_CARDS.STEP.PLAID_CONNECTION : CONST_1.default.COMPANY_CARDS.STEP.CARD_DETAILS });
    }, [isPlaid]);
    return (<WorkspaceCompanyCardStatementCloseDateSelectionList_1.default confirmText={translate('common.submit')} onSubmit={submit} onBackButtonPress={goBack} enabledWhenOffline={false} defaultStatementPeriodEnd={CONST_1.default.COMPANY_CARDS.STATEMENT_CLOSE_DATE.LAST_DAY_OF_MONTH}/>);
}
StatementCloseDateStep.displayName = 'StatementCloseDateStep';
exports.default = StatementCloseDateStep;
