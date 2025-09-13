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
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function SelectFeedType() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const [typeSelected, setTypeSelected] = (0, react_1.useState)();
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const doesCountrySupportPlaid = (0, CardUtils_1.isPlaidSupportedCountry)(addNewCard?.data?.selectedCountry);
    const isUSCountry = addNewCard?.data?.selectedCountry === CONST_1.default.COUNTRY.US;
    const submit = () => {
        if (!typeSelected) {
            setHasError(true);
            return;
        }
        const isDirectSelected = typeSelected === CONST_1.default.COMPANY_CARDS.FEED_TYPE.DIRECT;
        if (!isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) || !isDirectSelected) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: isDirectSelected ? CONST_1.default.COMPANY_CARDS.STEP.BANK_CONNECTION : CONST_1.default.COMPANY_CARDS.STEP.CARD_TYPE,
                data: { selectedFeedType: typeSelected },
            });
            return;
        }
        const step = isUSCountry ? CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK : CONST_1.default.COMPANY_CARDS.STEP.PLAID_CONNECTION;
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
            step,
            data: { selectedFeedType: typeSelected },
        });
    };
    (0, react_1.useEffect)(() => {
        if (addNewCard?.data.selectedFeedType) {
            setTypeSelected(addNewCard?.data.selectedFeedType);
            return;
        }
        if (doesCountrySupportPlaid) {
            setTypeSelected(CONST_1.default.COMPANY_CARDS.FEED_TYPE.DIRECT);
        }
    }, [addNewCard?.data.selectedFeedType, doesCountrySupportPlaid]);
    const handleBackButtonPress = () => {
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) ? CONST_1.default.COMPANY_CARDS.STEP.SELECT_COUNTRY : CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK });
    };
    const data = [
        {
            value: CONST_1.default.COMPANY_CARDS.FEED_TYPE.CUSTOM,
            text: translate('workspace.companyCards.commercialFeed'),
            alternateText: translate(isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) ? 'workspace.companyCards.addNewCard.commercialFeedPlaidDetails' : 'workspace.companyCards.addNewCard.commercialFeedDetails'),
            keyForList: CONST_1.default.COMPANY_CARDS.FEED_TYPE.CUSTOM,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARDS.FEED_TYPE.CUSTOM,
        },
        {
            value: CONST_1.default.COMPANY_CARDS.FEED_TYPE.DIRECT,
            text: translate('workspace.companyCards.directFeed'),
            alternateText: translate('workspace.companyCards.addNewCard.directFeedDetails'),
            keyForList: CONST_1.default.COMPANY_CARDS.FEED_TYPE.DIRECT,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARDS.FEED_TYPE.DIRECT,
        },
    ];
    const getFinalData = () => {
        if (!isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS)) {
            return data;
        }
        if (doesCountrySupportPlaid) {
            return data.reverse();
        }
        return data.slice(0, 1);
    };
    const finalData = getFinalData();
    return (<ScreenWrapper_1.default testID={SelectFeedType.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>

            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.addNewCard.howDoYouWantToConnect')}</Text_1.default>
            <Text_1.default style={[styles.textSupporting, styles.ph5, styles.mb6]}>
                {`${translate('workspace.companyCards.addNewCard.learnMoreAboutOptions.text')}`}
                <TextLink_1.default href={CONST_1.default.COMPANY_CARDS_CONNECT_CREDIT_CARDS_HELP_URL}>{`${translate('workspace.companyCards.addNewCard.learnMoreAboutOptions.linkText')}`}</TextLink_1.default>
            </Text_1.default>

            <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={({ value }) => {
            setTypeSelected(value);
            setHasError(false);
        }} sections={[{ data: finalData }]} shouldSingleExecuteRowSelect isAlternateTextMultilineSupported alternateTextNumberOfLines={3} initiallyFocusedOptionKey={typeSelected} shouldUpdateFocusedIndex showConfirmButton confirmButtonText={translate('common.next')} onConfirm={submit} addBottomSafeAreaPadding>
                {hasError && (<react_native_1.View style={[styles.ph5, styles.mb3]}>
                        <FormHelpMessage_1.default isError={hasError} message={translate('workspace.companyCards.addNewCard.error.pleaseSelectFeedType')}/>
                    </react_native_1.View>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
SelectFeedType.displayName = 'SelectFeedType';
exports.default = SelectFeedType;
