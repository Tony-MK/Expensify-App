"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const expensify_card_svg_1 = require("@assets/images/expensify-card.svg");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useExpensifyCardFeeds_1 = require("@hooks/useExpensifyCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const variables_1 = require("@styles/variables");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceExpensifyCardSelectorPage({ route }) {
    const { policyID } = route.params;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [lastSelectedExpensifyCardFeed] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_EXPENSIFY_CARD_FEED}${policyID}`);
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const lastSelectedExpensifyCardFeedID = lastSelectedExpensifyCardFeed ?? defaultFundID;
    const allExpensifyCardFeeds = (0, useExpensifyCardFeeds_1.default)(policyID);
    const feeds = Object.entries(allExpensifyCardFeeds ?? {}).map(([key, value]) => {
        const fundID = (0, CardUtils_1.getFundIdFromSettingsKey)(key) ?? CONST_1.default.DEFAULT_NUMBER_ID;
        return {
            value: fundID,
            text: (0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(value?.domainName ?? ''),
            keyForList: fundID.toString(),
            isSelected: fundID === lastSelectedExpensifyCardFeedID,
            leftElement: (<Icon_1.default src={expensify_card_svg_1.default} height={variables_1.default.cardIconHeight} width={variables_1.default.cardIconWidth} additionalStyles={[styles.mr3, styles.cardIcon]}/>),
        };
    });
    const goBack = () => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.getRoute(policyID));
    const selectFeed = (feed) => {
        (0, Card_1.updateSelectedExpensifyCardFeed)(feed.value, policyID);
        goBack();
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceExpensifyCardSelectorPage.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.companyCards.selectCards')} onBackButtonPress={goBack}/>
                <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={selectFeed} sections={[{ data: feeds }]} shouldUpdateFocusedIndex isAlternateTextMultilineSupported initiallyFocusedOptionKey={lastSelectedExpensifyCardFeed?.toString()}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceExpensifyCardSelectorPage.displayName = 'WorkspaceExpensifyCardSelectorPage';
exports.default = WorkspaceExpensifyCardSelectorPage;
