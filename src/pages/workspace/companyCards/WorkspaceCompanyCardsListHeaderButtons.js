"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const FeedSelector_1 = require("@components/FeedSelector");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@navigation/Navigation");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function WorkspaceCompanyCardsListHeaderButtons({ policyID, selectedFeed, shouldShowAssignCardButton, handleAssignCard }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const { shouldUseNarrowLayout, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const policy = (0, usePolicy_1.default)(policyID);
    const [allFeedsCards] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}`, { canBeMissing: false });
    const [currencyList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const [countryByIp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY, { canBeMissing: false });
    const shouldChangeLayout = isMediumScreenWidth || shouldUseNarrowLayout;
    const formattedFeedName = (0, CardUtils_1.getCustomOrFormattedFeedName)(selectedFeed, cardFeeds?.settings?.companyCardNicknames);
    const isCommercialFeed = (0, CardUtils_1.isCustomFeed)(selectedFeed);
    const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(selectedFeed);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const currentFeedData = companyFeeds?.[selectedFeed];
    const bankName = plaidUrl && formattedFeedName ? formattedFeedName : (0, CardUtils_1.getBankName)(selectedFeed);
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, currentFeedData);
    const filteredFeedCards = (0, CardUtils_1.filterInactiveCards)(allFeedsCards?.[`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${selectedFeed}`]);
    const isSelectedFeedConnectionBroken = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(filteredFeedCards);
    const openBankConnection = () => {
        const institutionId = !!(0, CardUtils_1.getPlaidInstitutionId)(selectedFeed);
        const data = {
            bankName: selectedFeed,
        };
        if (institutionId) {
            const country = (0, CardUtils_1.getPlaidCountry)(policy?.outputCurrency, currencyList, countryByIp);
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                data: {
                    selectedCountry: country,
                },
            });
            (0, CompanyCards_1.setAssignCardStepAndData)({
                data,
                currentStep: CONST_1.default.COMPANY_CARD.STEP.PLAID_CONNECTION,
            });
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ASSIGN_CARD.getRoute(policyID, selectedFeed)));
            return;
        }
        (0, CompanyCards_1.setAssignCardStepAndData)({ data, currentStep: CONST_1.default.COMPANY_CARD.STEP.BANK_CONNECTION });
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ASSIGN_CARD.getRoute(policyID, selectedFeed)));
    };
    const secondaryActions = (0, react_1.useMemo)(() => [
        {
            icon: Expensicons.Gear,
            text: translate('common.settings'),
            onSelected: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS.getRoute(policyID)),
            value: CONST_1.default.POLICY.SECONDARY_ACTIONS.SETTINGS,
        },
    ], [policyID, translate]);
    return (<react_native_1.View>
            <react_native_1.View style={[styles.w100, styles.ph5, !shouldChangeLayout ? [styles.pv2, styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween] : styles.pb2]}>
                <FeedSelector_1.default plaidUrl={plaidUrl} onFeedSelect={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SELECT_FEED.getRoute(policyID))} cardIcon={(0, CardUtils_1.getCardFeedIcon)(selectedFeed, illustrations)} shouldChangeLayout={shouldChangeLayout} feedName={formattedFeedName} supportingText={translate(isCommercialFeed ? 'workspace.companyCards.commercialFeed' : 'workspace.companyCards.directFeed')} shouldShowRBR={(0, CardUtils_1.checkIfFeedConnectionIsBroken)((0, CardUtils_1.flatAllCardsList)(allFeedsCards, domainOrWorkspaceAccountID), selectedFeed)}/>
                <react_native_1.View style={[styles.flexRow, styles.gap2]}>
                    {!!shouldShowAssignCardButton && (<Button_1.default success isDisabled={!currentFeedData || !!currentFeedData?.pending || isSelectedFeedConnectionBroken} onPress={handleAssignCard} icon={Expensicons.Plus} text={translate('workspace.companyCards.assignCard')} style={shouldChangeLayout && styles.flex1}/>)}
                    <ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldUseOptionIcon customText={translate('common.more')} options={secondaryActions} isSplitButton={false} wrapperStyle={shouldShowAssignCardButton ? styles.flexGrow0 : styles.flex1}/>
                </react_native_1.View>
            </react_native_1.View>
            {isSelectedFeedConnectionBroken && !!bankName && (<react_native_1.View style={[styles.flexRow, styles.ph5, styles.alignItemsCenter]}>
                    <Icon_1.default src={Expensicons.DotIndicator} fill={theme.danger} additionalStyles={styles.mr1}/>
                    <Text_1.default style={[styles.offlineFeedback.text, styles.pr5]}>
                        <Text_1.default style={[StyleUtils.getDotIndicatorTextStyles(true)]}>{translate('workspace.companyCards.brokenConnectionErrorFirstPart')}</Text_1.default>
                        <TextLink_1.default style={[StyleUtils.getDotIndicatorTextStyles(), styles.link]} onPress={openBankConnection}>
                            {translate('workspace.companyCards.brokenConnectionErrorLink')}
                        </TextLink_1.default>
                        <Text_1.default style={[StyleUtils.getDotIndicatorTextStyles(true)]}>{translate('workspace.companyCards.brokenConnectionErrorSecondPart')}</Text_1.default>
                    </Text_1.default>
                </react_native_1.View>)}
        </react_native_1.View>);
}
WorkspaceCompanyCardsListHeaderButtons.displayName = 'WorkspaceCompanyCardsListHeaderButtons';
exports.default = WorkspaceCompanyCardsListHeaderButtons;
