"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DecisionModal_1 = require("@components/DecisionModal");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const Illustrations = require("@components/Icon/Illustrations");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCardsList_1 = require("@hooks/useCardsList");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const WorkspacePageWithSections_1 = require("@pages/workspace/WorkspacePageWithSections");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const WorkspaceCompanyCardPageEmptyState_1 = require("./WorkspaceCompanyCardPageEmptyState");
const WorkspaceCompanyCardsFeedPendingPage_1 = require("./WorkspaceCompanyCardsFeedPendingPage");
const WorkspaceCompanyCardsList_1 = require("./WorkspaceCompanyCardsList");
const WorkspaceCompanyCardsListHeaderButtons_1 = require("./WorkspaceCompanyCardsListHeaderButtons");
function WorkspaceCompanyCardsPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const policyID = route.params.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [lastSelectedFeed] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}`, { canBeMissing: true });
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeeds);
    const [cardsList] = (0, useCardsList_1.default)(policyID, selectedFeed);
    const [countryByIp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY, { canBeMissing: false });
    const [currencyList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const hasNoAssignedCard = Object.keys(cardsList ?? {}).length === 0;
    const { cardList, ...cards } = cardsList ?? {};
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const filteredCardList = (0, CardUtils_1.getFilteredCardList)(cardsList, selectedFeed ? cardFeeds?.settings?.oAuthAccountDetails?.[selectedFeed] : undefined, workspaceCardFeeds);
    const companyCards = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const selectedFeedData = selectedFeed && companyCards[selectedFeed];
    const isNoFeed = !selectedFeedData;
    const isPending = !!selectedFeedData?.pending;
    const isFeedAdded = !isPending && !isNoFeed;
    const isFeedConnectionBroken = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(cards);
    const [shouldShowOfflineModal, setShouldShowOfflineModal] = (0, react_1.useState)(false);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, selectedFeedData);
    const fetchCompanyCards = (0, react_1.useCallback)(() => {
        (0, CompanyCards_1.openPolicyCompanyCardsPage)(policyID, domainOrWorkspaceAccountID);
    }, [policyID, domainOrWorkspaceAccountID]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchCompanyCards });
    const isLoading = !isOffline && (!cardFeeds || (!!cardFeeds.isLoading && (0, EmptyObject_1.isEmptyObject)(cardsList)));
    const isGB = countryByIp === CONST_1.default.COUNTRY.GB;
    const shouldShowGBDisclaimer = isGB && isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) && (isNoFeed || hasNoAssignedCard);
    (0, react_1.useEffect)(() => {
        fetchCompanyCards();
    }, [fetchCompanyCards]);
    (0, react_1.useEffect)(() => {
        if (isLoading || !selectedFeed || isPending) {
            return;
        }
        (0, CompanyCards_1.openPolicyCompanyCardsFeed)(domainOrWorkspaceAccountID, policyID, selectedFeed);
    }, [selectedFeed, isLoading, policyID, isPending, domainOrWorkspaceAccountID]);
    const handleAssignCard = () => {
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        if (!selectedFeed) {
            return;
        }
        const isCommercialFeed = (0, CardUtils_1.isCustomFeed)(selectedFeed);
        // If the feed is a direct feed (not a commercial feed) and the user is offline,
        // show the offline alert modal to inform them of the connectivity issue.
        if (!isCommercialFeed && isOffline) {
            setShouldShowOfflineModal(true);
            return;
        }
        const data = {
            bankName: selectedFeed,
        };
        let currentStep = CONST_1.default.COMPANY_CARD.STEP.ASSIGNEE;
        const employeeList = Object.values(policy?.employeeList ?? {}).filter((employee) => !(0, PolicyUtils_1.isDeletedPolicyEmployee)(employee, isOffline));
        const isFeedExpired = (0, CardUtils_1.isSelectedFeedExpired)(selectedFeed ? cardFeeds?.settings?.oAuthAccountDetails?.[selectedFeed] : undefined);
        if (employeeList.length === 1) {
            const userEmail = Object.keys(policy?.employeeList ?? {}).at(0) ?? '';
            data.email = userEmail;
            const personalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(userEmail);
            const memberName = personalDetails?.firstName ? personalDetails.firstName : personalDetails?.login;
            data.cardName = `${memberName}'s card`;
            currentStep = CONST_1.default.COMPANY_CARD.STEP.CARD;
            if ((0, CardUtils_1.hasOnlyOneCardToAssign)(filteredCardList)) {
                currentStep = CONST_1.default.COMPANY_CARD.STEP.TRANSACTION_START_DATE;
                data.cardNumber = Object.keys(filteredCardList).at(0);
                data.encryptedCardNumber = Object.values(filteredCardList).at(0);
            }
        }
        if (isFeedExpired) {
            const institutionId = !!(0, CardUtils_1.getPlaidInstitutionId)(selectedFeed);
            if (institutionId) {
                const country = (0, CardUtils_1.getPlaidCountry)(policy?.outputCurrency, currencyList, countryByIp);
                (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                    data: {
                        selectedCountry: country,
                    },
                });
            }
            currentStep = institutionId ? CONST_1.default.COMPANY_CARD.STEP.PLAID_CONNECTION : CONST_1.default.COMPANY_CARD.STEP.BANK_CONNECTION;
        }
        (0, CompanyCards_1.clearAddNewCardFlow)();
        (0, CompanyCards_1.setAssignCardStepAndData)({ data, currentStep });
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ASSIGN_CARD.getRoute(policyID, selectedFeed)));
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            {!!isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={styles.flex1} color={theme.spinner}/>)}
            {!isLoading && (<WorkspacePageWithSections_1.default shouldUseScrollView={isNoFeed} icon={Illustrations.CompanyCard} headerText={translate('workspace.common.companyCards')} route={route} shouldShowOfflineIndicatorInWideScreen showLoadingAsFirstRender={false} addBottomSafeAreaPadding>
                    {(isFeedAdded || isPending) && !!selectedFeed && (<WorkspaceCompanyCardsListHeaderButtons_1.default policyID={policyID} selectedFeed={selectedFeed} shouldShowAssignCardButton={isPending || !(0, EmptyObject_1.isEmptyObject)(cards)} handleAssignCard={handleAssignCard}/>)}
                    {isNoFeed && (<WorkspaceCompanyCardPageEmptyState_1.default route={route} shouldShowGBDisclaimer={shouldShowGBDisclaimer}/>)}
                    {isPending && <WorkspaceCompanyCardsFeedPendingPage_1.default />}
                    {isFeedAdded && !isPending && (<WorkspaceCompanyCardsList_1.default cardsList={cardsList} shouldShowGBDisclaimer={shouldShowGBDisclaimer} policyID={policyID} handleAssignCard={handleAssignCard} isDisabledAssignCardButton={!selectedFeedData || isFeedConnectionBroken}/>)}
                </WorkspacePageWithSections_1.default>)}

            <DecisionModal_1.default title={translate('common.youAppearToBeOffline')} prompt={translate('common.offlinePrompt')} isSmallScreenWidth={shouldUseNarrowLayout} onSecondOptionSubmit={() => setShouldShowOfflineModal(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={shouldShowOfflineModal} onClose={() => setShouldShowOfflineModal(false)}/>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCompanyCardsPage.displayName = 'WorkspaceCompanyCardsPage';
exports.default = WorkspaceCompanyCardsPage;
