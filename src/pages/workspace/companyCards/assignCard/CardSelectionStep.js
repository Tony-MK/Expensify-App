"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const Icon_1 = require("@components/Icon");
const Illustrations_1 = require("@components/Icon/Illustrations");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const PlaidCardFeedIcon_1 = require("@components/PlaidCardFeedIcon");
const RenderHTML_1 = require("@components/RenderHTML");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCardsList_1 = require("@hooks/useCardsList");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function CardSelectionStep({ feed, policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD, { canBeMissing: false });
    const [list] = (0, useCardsList_1.default)(policyID, feed);
    const [workspaceCardFeeds] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST, { canBeMissing: false });
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(feed);
    const formattedFeedName = (0, CardUtils_1.getCustomOrFormattedFeedName)(feed, cardFeeds?.settings?.companyCardNicknames);
    const isEditing = assignCard?.isEditing;
    const assigneeDisplayName = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(assignCard?.data?.email ?? '')?.displayName ?? '';
    const filteredCardList = (0, CardUtils_1.getFilteredCardList)(list, cardFeeds?.settings?.oAuthAccountDetails?.[feed], workspaceCardFeeds);
    const [cardSelected, setCardSelected] = (0, react_1.useState)(assignCard?.data?.encryptedCardNumber ?? '');
    const [shouldShowError, setShouldShowError] = (0, react_1.useState)(false);
    const cardListOptions = Object.entries(filteredCardList).map(([cardNumber, encryptedCardNumber]) => ({
        keyForList: encryptedCardNumber,
        value: encryptedCardNumber,
        text: (0, CardUtils_1.maskCardNumber)(cardNumber, feed),
        alternateText: (0, CardUtils_1.lastFourNumbersFromCardName)(cardNumber),
        isSelected: cardSelected === encryptedCardNumber,
        leftElement: plaidUrl ? (<PlaidCardFeedIcon_1.default plaidUrl={plaidUrl} style={styles.mr3}/>) : (<Icon_1.default src={(0, CardUtils_1.getCardFeedIcon)(feed, illustrations)} height={variables_1.default.cardIconHeight} width={variables_1.default.iconSizeExtraLarge} additionalStyles={[styles.mr3, styles.cardIcon]}/>),
    }));
    const handleBackButtonPress = () => {
        if (isEditing) {
            (0, CompanyCards_1.setAssignCardStepAndData)({
                currentStep: CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION,
                isEditing: false,
            });
            return;
        }
        if (!cardListOptions.length) {
            Navigation_1.default.goBack();
            return;
        }
        (0, CompanyCards_1.setAssignCardStepAndData)({ currentStep: CONST_1.default.COMPANY_CARD.STEP.ASSIGNEE });
    };
    const handleSelectCard = (cardNumber) => {
        setCardSelected(cardNumber);
        setShouldShowError(false);
    };
    const submit = () => {
        if (!cardSelected) {
            setShouldShowError(true);
            return;
        }
        const cardNumber = Object.entries(filteredCardList)
            .find(([, encryptedCardNumber]) => encryptedCardNumber === cardSelected)
            ?.at(0) ?? '';
        (0, CompanyCards_1.setAssignCardStepAndData)({
            currentStep: isEditing ? CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION : CONST_1.default.COMPANY_CARD.STEP.TRANSACTION_START_DATE,
            data: { encryptedCardNumber: cardSelected, cardNumber },
            isEditing: false,
        });
    };
    const searchedListOptions = (0, react_1.useMemo)(() => {
        return (0, tokenizedSearch_1.default)(cardListOptions, searchText, (option) => [option.text]);
    }, [searchText, cardListOptions]);
    const safeAreaPaddingBottomStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)();
    return (<InteractiveStepWrapper_1.default wrapperID={CardSelectionStep.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('workspace.companyCards.assignCard')} headerSubtitle={assigneeDisplayName} enableEdgeToEdgeBottomSafeAreaPadding>
            {!cardListOptions.length ? (<react_native_1.View style={[styles.flex1, styles.justifyContentCenter, styles.alignItemsCenter, styles.ph5, styles.mb9, safeAreaPaddingBottomStyle]}>
                    <Icon_1.default src={Illustrations_1.BrokenMagnifyingGlass} width={116} height={168}/>
                    <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mt3]}>{translate('workspace.companyCards.noActiveCards')}</Text_1.default>
                    <react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.ph5, styles.mv3]}>
                        <RenderHTML_1.default html={translate('workspace.companyCards.somethingMightBeBroken')}/>
                    </react_native_1.View>
                </react_native_1.View>) : (<SelectionList_1.default sections={[{ data: searchedListOptions }]} headerMessage={searchedListOptions.length ? undefined : translate('common.noResultsFound')} shouldShowTextInput={cardListOptions.length > CONST_1.default.COMPANY_CARDS.CARD_LIST_THRESHOLD} textInputLabel={translate('common.search')} textInputValue={searchText} onChangeText={setSearchText} ListItem={RadioListItem_1.default} onSelectRow={({ value }) => handleSelectCard(value)} initiallyFocusedOptionKey={cardSelected} listHeaderContent={<react_native_1.View>
                            <react_native_1.View style={[styles.ph5, styles.mb5, styles.mt3, { height: CONST_1.default.BANK_ACCOUNT.STEPS_HEADER_HEIGHT }]}>
                                <InteractiveStepSubHeader_1.default startStepIndex={1} stepNames={CONST_1.default.COMPANY_CARD.STEP_NAMES}/>
                            </react_native_1.View>
                            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mt3]}>{translate('workspace.companyCards.chooseCard')}</Text_1.default>
                            <Text_1.default style={[styles.textSupporting, styles.ph5, styles.mv3]}>
                                {translate('workspace.companyCards.chooseCardFor', {
                    assignee: assigneeDisplayName,
                    feed: plaidUrl && formattedFeedName ? formattedFeedName : (0, CardUtils_1.getBankName)(feed),
                })}
                            </Text_1.default>
                        </react_native_1.View>} shouldShowTextInputAfterHeader shouldShowHeaderMessageAfterHeader addBottomSafeAreaPadding shouldShowListEmptyContent={false} shouldScrollToFocusedIndex={false} shouldUpdateFocusedIndex footerContent={<FormAlertWithSubmitButton_1.default buttonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={submit} isAlertVisible={shouldShowError} containerStyles={[!shouldShowError && styles.mt5]} message={translate('common.error.pleaseSelectOne')}/>}/>)}
        </InteractiveStepWrapper_1.default>);
}
CardSelectionStep.displayName = 'CardSelectionStep';
exports.default = CardSelectionStep;
