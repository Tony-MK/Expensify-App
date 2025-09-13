"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("react-native-onyx/dist/useOnyx");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const usePermissions_1 = require("@hooks/usePermissions");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const Navigation_1 = require("@libs/Navigation/Navigation");
const WorkspaceCompanyCardStatementCloseDateSelectionList_1 = require("@pages/workspace/companyCards/WorkspaceCompanyCardStatementCloseDateSelectionList");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function StatementCloseDateStep({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: false });
    const [lastSelectedFeed] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`, { canBeMissing: true });
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const isPlaid = isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) && !!addNewCard?.data?.publicToken;
    const submit = (0, react_1.useCallback)((statementPeriodEnd, statementPeriodEndDay) => {
        if (isPlaid) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: CONST_1.default.COMPANY_CARDS.STEP.BANK_CONNECTION,
                // Fallback to null to clear old value (if any) because `undefined` is a no-op in Onyx.merge
                data: { statementPeriodEnd: statementPeriodEnd ?? null, statementPeriodEndDay: statementPeriodEndDay ?? null },
            });
            return;
        }
        if (addNewCard?.data.feedDetails) {
            (0, CompanyCards_1.addNewCompanyCardsFeed)(policyID, addNewCard.data.feedType, addNewCard.data.feedDetails, cardFeeds, statementPeriodEnd, statementPeriodEndDay, lastSelectedFeed);
            Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID));
        }
    }, [policyID, addNewCard, cardFeeds, lastSelectedFeed, isPlaid]);
    const goBack = (0, react_1.useCallback)(() => {
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: isPlaid ? CONST_1.default.COMPANY_CARDS.STEP.PLAID_CONNECTION : CONST_1.default.COMPANY_CARDS.STEP.CARD_DETAILS });
    }, [isPlaid]);
    return (<WorkspaceCompanyCardStatementCloseDateSelectionList_1.default confirmText={translate('common.submit')} onSubmit={submit} onBackButtonPress={goBack} enabledWhenOffline={false} defaultStatementPeriodEnd={CONST_1.default.COMPANY_CARDS.STATEMENT_CLOSE_DATE.LAST_DAY_OF_MONTH}/>);
}
StatementCloseDateStep.displayName = 'StatementCloseDateStep';
exports.default = StatementCloseDateStep;
