"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const expensify_card_svg_1 = require("@assets/images/expensify-card.svg");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const PlaidCardFeedIcon_1 = require("@components/PlaidCardFeedIcon");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCardsList_1 = require("@hooks/useCardsList");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const variables_1 = require("@styles/variables");
const Card_1 = require("@userActions/Card");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceMemberNewCardPage({ route, personalDetails }) {
    const { policyID } = route.params;
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const [selectedFeed, setSelectedFeed] = (0, react_1.useState)('');
    const [shouldShowError, setShouldShowError] = (0, react_1.useState)(false);
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`, { canBeMissing: true });
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: true });
    const accountID = Number(route.params.accountID);
    const memberLogin = personalDetails?.[accountID]?.login ?? '';
    const memberName = personalDetails?.[accountID]?.firstName ? personalDetails?.[accountID]?.firstName : personalDetails?.[accountID]?.login;
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds, false, true);
    const isFeedExpired = (0, CardUtils_1.isSelectedFeedExpired)(selectedFeed ? cardFeeds?.settings?.oAuthAccountDetails?.[selectedFeed] : undefined);
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, companyFeeds[selectedFeed]);
    const [list] = (0, useCardsList_1.default)(policyID, selectedFeed);
    const filteredCardList = (0, CardUtils_1.getFilteredCardList)(list, cardFeeds?.settings?.oAuthAccountDetails?.[selectedFeed], workspaceCardFeeds);
    const shouldShowExpensifyCard = (0, CardUtils_1.isExpensifyCardFullySetUp)(policy, cardSettings);
    const handleSubmit = () => {
        if (!selectedFeed) {
            setShouldShowError(true);
            return;
        }
        if (selectedFeed === CONST_1.default.EXPENSIFY_CARD.NAME) {
            (0, Card_1.setIssueNewCardStepAndData)({
                step: CONST_1.default.EXPENSIFY_CARD.STEP.CARD_TYPE,
                data: {
                    assigneeEmail: memberLogin,
                },
                isEditing: false,
                isChangeAssigneeDisabled: true,
                policyID,
            });
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_ISSUE_NEW.getRoute(policyID, ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policyID, accountID)));
        }
        else {
            const data = {
                email: memberLogin,
                bankName: selectedFeed,
                cardName: `${memberName}'s card`,
            };
            let currentStep = CONST_1.default.COMPANY_CARD.STEP.CARD;
            if ((0, CardUtils_1.hasOnlyOneCardToAssign)(filteredCardList)) {
                currentStep = CONST_1.default.COMPANY_CARD.STEP.TRANSACTION_START_DATE;
                data.cardNumber = Object.keys(filteredCardList).at(0);
                data.encryptedCardNumber = Object.values(filteredCardList).at(0);
            }
            if (isFeedExpired) {
                currentStep = CONST_1.default.COMPANY_CARD.STEP.BANK_CONNECTION;
            }
            (0, CompanyCards_1.setAssignCardStepAndData)({
                currentStep,
                data,
                isEditing: false,
            });
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ASSIGN_CARD.getRoute(policyID, selectedFeed, ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policyID, accountID))));
        }
    };
    const handleSelectFeed = (feed) => {
        setSelectedFeed(feed.value);
        const workspaceCards = workspaceCardFeeds?.[`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${feed.value}`] ?? {};
        const hasAllCardsData = !!workspaceCards.cardList;
        if ((0, CardUtils_1.isCustomFeed)(feed.value) && !hasAllCardsData) {
            (0, CompanyCards_1.openAssignFeedCardPage)(policyID, feed.value, domainOrWorkspaceAccountID);
        }
        setShouldShowError(false);
    };
    const companyCardFeeds = Object.keys(companyFeeds).map((key) => {
        const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(key);
        return {
            value: key,
            text: (0, CardUtils_1.getCustomOrFormattedFeedName)(key, cardFeeds?.settings?.companyCardNicknames),
            keyForList: key,
            isDisabled: companyFeeds[key]?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            pendingAction: companyFeeds[key]?.pendingAction,
            isSelected: selectedFeed === key,
            leftElement: plaidUrl ? (<PlaidCardFeedIcon_1.default plaidUrl={plaidUrl} style={styles.mr3}/>) : (<Icon_1.default src={(0, CardUtils_1.getCardFeedIcon)(key, illustrations)} height={variables_1.default.cardIconHeight} width={variables_1.default.cardIconWidth} additionalStyles={[styles.mr3, styles.cardIcon]}/>),
        };
    });
    const feeds = shouldShowExpensifyCard
        ? [
            ...companyCardFeeds,
            {
                value: CONST_1.default.EXPENSIFY_CARD.NAME,
                text: translate('workspace.common.expensifyCard'),
                keyForList: CONST_1.default.EXPENSIFY_CARD.NAME,
                isSelected: selectedFeed === CONST_1.default.EXPENSIFY_CARD.NAME,
                leftElement: (<Icon_1.default src={expensify_card_svg_1.default} width={variables_1.default.cardIconWidth} height={variables_1.default.cardIconHeight} additionalStyles={[styles.cardIcon, styles.mr3]}/>),
            },
        ]
        : companyCardFeeds;
    const goBack = () => Navigation_1.default.goBack();
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceMemberNewCardPage.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.companyCards.selectCards')} onBackButtonPress={goBack}/>
                <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={handleSelectFeed} sections={[{ data: feeds }]} shouldUpdateFocusedIndex isAlternateTextMultilineSupported/>
                <FormAlertWithSubmitButton_1.default containerStyles={styles.p5} isAlertVisible={shouldShowError} onSubmit={handleSubmit} message={translate('common.error.pleaseSelectOne')} buttonText={translate('common.next')} isLoading={!!cardFeeds?.isLoading}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceMemberNewCardPage.displayName = 'WorkspaceMemberNewCardPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceMemberNewCardPage);
