"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CompanyCards = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function AmexCustomFeed() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD);
    const [typeSelected, setTypeSelected] = (0, react_1.useState)();
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const submit = () => {
        if (!typeSelected) {
            setHasError(true);
            return;
        }
        CompanyCards.setAddNewCompanyCardStepAndData({
            step: typeSelected === CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.CORPORATE ? CONST_1.default.COMPANY_CARDS.STEP.CARD_INSTRUCTIONS : CONST_1.default.COMPANY_CARDS.STEP.BANK_CONNECTION,
            data: {
                feedType: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX,
                selectedAmexCustomFeed: typeSelected,
            },
        });
    };
    (0, react_1.useEffect)(() => {
        setTypeSelected(addNewCard?.data.selectedAmexCustomFeed);
    }, [addNewCard?.data.selectedAmexCustomFeed]);
    const handleBackButtonPress = () => {
        CompanyCards.setAddNewCompanyCardStepAndData({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK });
    };
    const data = [
        {
            value: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.CORPORATE,
            text: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.CORPORATE,
            alternateText: translate('workspace.companyCards.addNewCard.amexCorporate'),
            keyForList: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.CORPORATE,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.CORPORATE,
        },
        {
            value: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.BUSINESS,
            text: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.BUSINESS,
            alternateText: translate('workspace.companyCards.addNewCard.amexBusiness'),
            keyForList: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.BUSINESS,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.BUSINESS,
        },
        {
            value: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.PERSONAL,
            text: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.PERSONAL,
            alternateText: translate('workspace.companyCards.addNewCard.amexPersonal'),
            keyForList: CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.PERSONAL,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARDS.AMEX_CUSTOM_FEED.PERSONAL,
        },
    ];
    return (<ScreenWrapper_1.default testID={AmexCustomFeed.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>

            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.addNewCard.howDoYouWantToConnect')}</Text_1.default>
            <Text_1.default style={[styles.textSupporting, styles.ph5, styles.mb6]}>
                {`${translate('workspace.companyCards.addNewCard.learnMoreAboutOptions.text')}`}
                <TextLink_1.default href={CONST_1.default.COMPANY_CARDS_CONNECT_CREDIT_CARDS_HELP_URL}>{`${translate('workspace.companyCards.addNewCard.learnMoreAboutOptions.linkText')}`}</TextLink_1.default>
            </Text_1.default>

            <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={({ value }) => {
            setTypeSelected(value);
            setHasError(false);
        }} sections={[{ data }]} shouldSingleExecuteRowSelect isAlternateTextMultilineSupported alternateTextNumberOfLines={3} initiallyFocusedOptionKey={addNewCard?.data.selectedAmexCustomFeed} shouldUpdateFocusedIndex showConfirmButton confirmButtonText={translate('common.next')} onConfirm={submit} addBottomSafeAreaPadding>
                {hasError && (<react_native_1.View style={[styles.ph5, styles.mb3]}>
                        <FormHelpMessage_1.default isError={hasError} message={translate('workspace.companyCards.addNewCard.error.pleaseSelectBankAccount')}/>
                    </react_native_1.View>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
AmexCustomFeed.displayName = 'AmexCustomFeed';
exports.default = AmexCustomFeed;
