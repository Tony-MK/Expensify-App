"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCardsList_1 = require("@hooks/useCardsList");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceCompanyCardsSettingsPage({ route: { params: { policyID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [deleteCompanyCardConfirmModalVisible, setDeleteCompanyCardConfirmModalVisible] = (0, react_1.useState)(false);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const [lastSelectedFeed] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`, { canBeMissing: true });
    const selectedFeed = (0, react_1.useMemo)(() => (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeeds), [cardFeeds, lastSelectedFeed]);
    const [cardsList] = (0, useCardsList_1.default)(policyID, selectedFeed);
    const feedName = (0, CardUtils_1.getCustomOrFormattedFeedName)(selectedFeed, cardFeeds?.settings?.companyCardNicknames);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const selectedFeedData = selectedFeed ? companyFeeds[selectedFeed] : undefined;
    const liabilityType = selectedFeedData?.liabilityType;
    const isPersonal = liabilityType === CONST_1.default.COMPANY_CARDS.DELETE_TRANSACTIONS.ALLOW;
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, selectedFeedData);
    const isPending = !!selectedFeedData?.pending;
    const statementCloseDate = (0, react_1.useMemo)(() => {
        if (!selectedFeedData?.statementPeriodEndDay) {
            return undefined;
        }
        if (typeof selectedFeedData?.statementPeriodEndDay === 'number') {
            return selectedFeedData.statementPeriodEndDay;
        }
        return translate(`workspace.companyCards.statementCloseDate.${selectedFeedData.statementPeriodEndDay}`);
    }, [translate, selectedFeedData?.statementPeriodEndDay]);
    const navigateToChangeFeedName = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS_FEED_NAME.getRoute(policyID));
    };
    const navigateToChangeStatementCloseDate = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS_STATEMENT_CLOSE_DATE.getRoute(policyID));
    };
    const deleteCompanyCardFeed = () => {
        setDeleteCompanyCardConfirmModalVisible(false);
        Navigation_1.default.goBack();
        if (selectedFeed) {
            const { cardList, ...cards } = cardsList ?? {};
            const cardIDs = Object.keys(cards);
            const feedToOpen = Object.keys(companyFeeds)
                .filter((feed) => feed !== selectedFeed && companyFeeds[feed]?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)
                .at(0);
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, CompanyCards_1.deleteWorkspaceCompanyCardFeed)(policyID, domainOrWorkspaceAccountID, selectedFeed, cardIDs, feedToOpen);
            });
        }
    };
    const onToggleLiability = (isOn) => {
        if (!selectedFeed) {
            return;
        }
        (0, CompanyCards_1.setWorkspaceCompanyCardTransactionLiability)(domainOrWorkspaceAccountID, policyID, selectedFeed, isOn ? CONST_1.default.COMPANY_CARDS.DELETE_TRANSACTIONS.ALLOW : CONST_1.default.COMPANY_CARDS.DELETE_TRANSACTIONS.RESTRICT);
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceCompanyCardsSettingsPage.displayName} style={styles.defaultModalContainer} enableEdgeToEdgeBottomSafeAreaPadding>
                <ScrollView_1.default contentContainerStyle={styles.flexGrow1} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('common.settings')}/>
                    <react_native_1.View style={styles.flex1}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={feedName} description={translate('workspace.moreFeatures.companyCards.cardFeedName')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={navigateToChangeFeedName}/>
                        <OfflineWithFeedback_1.default pendingAction={selectedFeedData?.pendingFields?.statementPeriodEndDay}>
                            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={statementCloseDate?.toString()} description={translate('workspace.moreFeatures.companyCards.statementCloseDateTitle')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={navigateToChangeStatementCloseDate} brickRoadIndicator={selectedFeedData?.errorFields?.statementPeriodEndDay ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                        </OfflineWithFeedback_1.default>
                        <react_native_1.View style={[styles.mv3, styles.mh5]}>
                            <ToggleSettingsOptionRow_1.default title={translate('workspace.moreFeatures.companyCards.personal')} switchAccessibilityLabel={translate('workspace.moreFeatures.companyCards.personal')} onToggle={onToggleLiability} isActive={isPersonal} disabled={isPending}/>
                            <Text_1.default style={[styles.mutedTextLabel, styles.mt2]}>{translate('workspace.moreFeatures.companyCards.setTransactionLiabilityDescription')}</Text_1.default>
                        </react_native_1.View>
                        <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('workspace.moreFeatures.companyCards.removeCardFeed')} onPress={() => setDeleteCompanyCardConfirmModalVisible(true)}/>
                    </react_native_1.View>
                    <ConfirmModal_1.default isVisible={deleteCompanyCardConfirmModalVisible} onConfirm={deleteCompanyCardFeed} onCancel={() => setDeleteCompanyCardConfirmModalVisible(false)} title={feedName && translate('workspace.moreFeatures.companyCards.removeCardFeedTitle', { feedName })} prompt={translate('workspace.moreFeatures.companyCards.removeCardFeedDescription')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCompanyCardsSettingsPage.displayName = 'WorkspaceCompanyCardsSettingsPage';
exports.default = WorkspaceCompanyCardsSettingsPage;
