"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const variables_1 = require("@styles/variables");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function getAvailableCompanyCardTypes({ translate, typeSelected, styles, canUsePlaidCompanyCards }) {
    const defaultCards = [
        {
            value: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD,
            text: translate('workspace.companyCards.addNewCard.cardProviders.cdf'),
            keyForList: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD,
            leftElement: (<Icon_1.default src={Illustrations.MasterCardCompanyCardDetail} height={variables_1.default.iconSizeExtraLarge} width={variables_1.default.iconSizeExtraLarge} additionalStyles={styles}/>),
        },
        {
            value: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
            text: translate('workspace.companyCards.addNewCard.cardProviders.vcf'),
            keyForList: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
            leftElement: (<Icon_1.default src={Illustrations.VisaCompanyCardDetail} height={variables_1.default.iconSizeExtraLarge} width={variables_1.default.iconSizeExtraLarge} additionalStyles={styles}/>),
        },
    ];
    if (!canUsePlaidCompanyCards) {
        return defaultCards;
    }
    return [
        {
            value: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX,
            text: translate('workspace.companyCards.addNewCard.cardProviders.gl1025'),
            keyForList: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX,
            isSelected: typeSelected === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX,
            leftElement: (<Icon_1.default src={Illustrations.AmexCardCompanyCardDetail} height={variables_1.default.iconSizeExtraLarge} width={variables_1.default.iconSizeExtraLarge} additionalStyles={styles}/>),
        },
        ...defaultCards,
    ];
}
function CardTypeStep() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const [typeSelected, setTypeSelected] = (0, react_1.useState)();
    const [isError, setIsError] = (0, react_1.useState)(false);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const data = getAvailableCompanyCardTypes({ translate, typeSelected, styles: styles.mr3, canUsePlaidCompanyCards: isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) });
    const { bankName, selectedBank, feedType } = addNewCard?.data ?? {};
    const isOtherBankSelected = selectedBank === CONST_1.default.COMPANY_CARDS.BANKS.OTHER;
    const isNewCardTypeSelected = typeSelected !== feedType;
    const doesCountrySupportPlaid = (0, CardUtils_1.isPlaidSupportedCountry)(addNewCard?.data.selectedCountry);
    const submit = () => {
        if (!typeSelected) {
            setIsError(true);
        }
        else {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: CONST_1.default.COMPANY_CARDS.STEP.CARD_INSTRUCTIONS,
                data: {
                    feedType: typeSelected,
                    bankName: isNewCardTypeSelected && isOtherBankSelected ? '' : bankName,
                },
                isEditing: false,
            });
        }
    };
    (0, react_1.useEffect)(() => {
        setTypeSelected(addNewCard?.data.feedType);
    }, [addNewCard?.data.feedType]);
    const handleBackButtonPress = () => {
        if (isOtherBankSelected) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK });
            return;
        }
        if (isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) && !doesCountrySupportPlaid) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_COUNTRY });
            return;
        }
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_FEED_TYPE });
    };
    return (<ScreenWrapper_1.default testID={CardTypeStep.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>

            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.addNewCard.yourCardProvider')}</Text_1.default>
            <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={({ value }) => {
            setTypeSelected(value);
            setIsError(false);
        }} sections={[{ data }]} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={addNewCard?.data.feedType} shouldUpdateFocusedIndex showConfirmButton confirmButtonText={translate('common.next')} onConfirm={submit} addBottomSafeAreaPadding>
                {isError && (<react_native_1.View style={[styles.ph5, styles.mb3]}>
                        <FormHelpMessage_1.default isError={isError} message={translate('workspace.companyCards.addNewCard.error.pleaseSelectProvider')}/>
                    </react_native_1.View>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
CardTypeStep.displayName = 'CardTypeStep';
exports.default = CardTypeStep;
