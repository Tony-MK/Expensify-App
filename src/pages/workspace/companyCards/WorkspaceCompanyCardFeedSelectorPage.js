"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const PlaidCardFeedIcon_1 = require("@components/PlaidCardFeedIcon");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const variables_1 = require("@styles/variables");
const Card_1 = require("@userActions/Card");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceCompanyCardFeedSelectorPage({ route }) {
    const { policyID } = route.params;
    const policy = (0, usePolicy_1.default)(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const [allFeedsCards] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}`, { canBeMissing: false });
    const [lastSelectedFeed] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`, { canBeMissing: true });
    const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeeds);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const isCollect = (0, PolicyUtils_1.isCollectPolicy)(policy);
    const feeds = Object.entries(companyFeeds).map(([key, feedSettings]) => {
        const feed = key;
        const filteredFeedCards = (0, CardUtils_1.filterInactiveCards)(allFeedsCards?.[`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${(0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, feedSettings)}_${feed}`]);
        const isFeedConnectionBroken = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(filteredFeedCards);
        const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(feed);
        return {
            value: feed,
            text: (0, CardUtils_1.getCustomOrFormattedFeedName)(feed, cardFeeds?.settings?.companyCardNicknames),
            keyForList: feed,
            isSelected: feed === selectedFeed,
            isDisabled: companyFeeds[feed]?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            pendingAction: companyFeeds[feed]?.pendingAction,
            brickRoadIndicator: isFeedConnectionBroken ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
            canShowSeveralIndicators: isFeedConnectionBroken,
            leftElement: plaidUrl ? (<PlaidCardFeedIcon_1.default plaidUrl={plaidUrl} style={styles.mr3}/>) : (<Icon_1.default src={(0, CardUtils_1.getCardFeedIcon)(feed, illustrations)} height={variables_1.default.cardIconHeight} width={variables_1.default.cardIconWidth} additionalStyles={[styles.mr3, styles.cardIcon]}/>),
        };
    });
    const onAddCardsPress = () => {
        (0, CompanyCards_1.clearAddNewCardFlow)();
        if (isCollect && feeds.length === 1) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.companyCards.alias, ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SELECT_FEED.getRoute(policyID)));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ADD_NEW.getRoute(policyID));
    };
    const goBack = () => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID));
    const selectFeed = (feed) => {
        (0, Card_1.updateSelectedFeed)(feed.value, policyID);
        goBack();
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceCompanyCardFeedSelectorPage.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('workspace.companyCards.selectCards')} onBackButtonPress={goBack}/>
                <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={selectFeed} sections={[{ data: feeds }]} shouldUpdateFocusedIndex isAlternateTextMultilineSupported initiallyFocusedOptionKey={selectedFeed} addBottomSafeAreaPadding listFooterContent={<MenuItem_1.default title={translate('workspace.companyCards.addCards')} icon={Expensicons.Plus} onPress={onAddCardsPress}/>}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCompanyCardFeedSelectorPage.displayName = 'WorkspaceCompanyCardFeedSelectorPage';
exports.default = WorkspaceCompanyCardFeedSelectorPage;
