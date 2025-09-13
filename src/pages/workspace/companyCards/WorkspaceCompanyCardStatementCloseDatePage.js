"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const WorkspaceCompanyCardStatementCloseDateSelectionList_1 = require("./WorkspaceCompanyCardStatementCloseDateSelectionList");
function WorkspaceCompanyCardStatementCloseDatePage({ route: { params: { policyID }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const [lastSelectedFeed, lastSelectedFeedResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`, { canBeMissing: true });
    const [cardFeeds, cardFeedsResult] = (0, useCardFeeds_1.default)(policyID);
    const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeeds);
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const selectedFeedData = selectedFeed ? companyFeeds[selectedFeed] : undefined;
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, selectedFeedData);
    const statementPeriodEndDay = selectedFeedData?.statementPeriodEndDay;
    const [defaultStatementPeriodEnd, defaultStatementPeriodEndDay] = (0, react_1.useMemo)(() => {
        if (!statementPeriodEndDay) {
            return [undefined, undefined];
        }
        if (typeof statementPeriodEndDay === 'number') {
            return [undefined, statementPeriodEndDay];
        }
        return [statementPeriodEndDay, undefined];
    }, [statementPeriodEndDay]);
    const submit = (0, react_1.useCallback)((newStatementPeriodEnd, newStatementPeriodEndDay) => {
        const isChangedValue = (newStatementPeriodEndDay ?? newStatementPeriodEnd) !== statementPeriodEndDay;
        if (selectedFeed && isChangedValue) {
            (0, CompanyCards_1.setFeedStatementPeriodEndDay)(policyID, selectedFeed, domainOrWorkspaceAccountID, newStatementPeriodEnd, newStatementPeriodEndDay, statementPeriodEndDay);
        }
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS.getRoute(policyID));
    }, [policyID, selectedFeed, statementPeriodEndDay, domainOrWorkspaceAccountID]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack();
    }, []);
    const clearError = (0, react_1.useCallback)(() => {
        if (!selectedFeed) {
            return;
        }
        (0, CompanyCards_1.clearErrorField)(selectedFeed, domainOrWorkspaceAccountID, 'statementPeriodEndDay');
    }, [selectedFeed, domainOrWorkspaceAccountID]);
    if ((0, isLoadingOnyxValue_1.default)(cardFeedsResult) || (0, isLoadingOnyxValue_1.default)(lastSelectedFeedResult)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <WorkspaceCompanyCardStatementCloseDateSelectionList_1.default confirmText={translate('common.apply')} onSubmit={submit} onBackButtonPress={goBack} enabledWhenOffline defaultStatementPeriodEnd={defaultStatementPeriodEnd} defaultStatementPeriodEndDay={defaultStatementPeriodEndDay} pendingAction={selectedFeedData?.pendingFields?.statementPeriodEndDay} errors={selectedFeedData?.errorFields?.statementPeriodEndDay} onCloseError={clearError}/>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCompanyCardStatementCloseDatePage.displayName = 'WorkspaceCompanyCardStatementCloseDatePage';
exports.default = WorkspaceCompanyCardStatementCloseDatePage;
