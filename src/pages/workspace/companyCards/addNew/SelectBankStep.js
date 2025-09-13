"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function SelectBankStep() {
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const [bankSelected, setBankSelected] = (0, react_1.useState)();
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const isOtherBankSelected = bankSelected === CONST_1.default.COMPANY_CARDS.BANKS.OTHER;
    const submit = () => {
        if (!bankSelected) {
            setHasError(true);
        }
        else {
            if (addNewCard?.data.selectedBank !== bankSelected && !isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS)) {
                (0, CompanyCards_1.clearAddNewCardFlow)();
            }
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) ? (0, CardUtils_1.getCorrectStepForPlaidSelectedBank)(bankSelected) : (0, CardUtils_1.getCorrectStepForSelectedBank)(bankSelected),
                data: {
                    selectedBank: bankSelected,
                    cardTitle: !isOtherBankSelected ? bankSelected : undefined,
                    feedType: bankSelected === CONST_1.default.COMPANY_CARDS.BANKS.STRIPE ? CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.STRIPE : undefined,
                },
                isEditing: false,
            });
        }
    };
    (0, react_1.useEffect)(() => {
        setBankSelected(addNewCard?.data.selectedBank);
    }, [addNewCard?.data.selectedBank]);
    const handleBackButtonPress = () => {
        if (route?.params?.backTo) {
            Navigation_1.default.navigate(route.params.backTo);
            return;
        }
        if (isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS)) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_FEED_TYPE, data: { selectedBank: null } });
        }
        else {
            Navigation_1.default.goBack();
        }
    };
    const data = Object.values(CONST_1.default.COMPANY_CARDS.BANKS).map((bank) => ({
        value: bank,
        text: bank === CONST_1.default.COMPANY_CARDS.BANKS.OTHER ? translate('workspace.companyCards.addNewCard.other') : bank,
        keyForList: bank,
        isSelected: bankSelected === bank,
        leftElement: (<Icon_1.default src={(0, CardUtils_1.getBankCardDetailsImage)(bank, illustrations)} height={variables_1.default.iconSizeExtraLarge} width={variables_1.default.iconSizeExtraLarge} additionalStyles={styles.mr3}/>),
    }));
    return (<ScreenWrapper_1.default testID={SelectBankStep.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>

            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.addNewCard.whoIsYourBankAccount')}</Text_1.default>
            <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={({ value }) => {
            setBankSelected(value);
            setHasError(false);
        }} sections={[{ data }]} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={addNewCard?.data.selectedBank} shouldUpdateFocusedIndex showConfirmButton confirmButtonText={translate('common.next')} onConfirm={submit} confirmButtonStyles={!hasError && styles.mt5} addBottomSafeAreaPadding>
                {hasError && (<react_native_1.View style={[styles.ph3, styles.mb3]}>
                        <FormHelpMessage_1.default isError={hasError} message={translate('workspace.companyCards.addNewCard.error.pleaseSelectBank')}/>
                    </react_native_1.View>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
SelectBankStep.displayName = 'SelectBankStep';
exports.default = SelectBankStep;
