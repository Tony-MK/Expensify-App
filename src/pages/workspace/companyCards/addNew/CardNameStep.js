"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AddNewCardFeedForm_1 = require("@src/types/form/AddNewCardFeedForm");
function CardNameStep() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [AddNewCardFeedForm_1.default.CARD_TITLE]);
        const length = values.cardTitle.length;
        if (length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, AddNewCardFeedForm_1.default.CARD_TITLE, translate('common.error.characterLimitExceedCounter', { length, limit: CONST_1.default.STANDARD_LENGTH_LIMIT }));
        }
        return errors;
    };
    const submit = (values) => {
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
            step: CONST_1.default.COMPANY_CARDS.STEP.CARD_DETAILS,
            data: {
                bankName: values.cardTitle,
            },
            isEditing: false,
        });
    };
    const handleBackButtonPress = () => {
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.CARD_INSTRUCTIONS });
    };
    return (<ScreenWrapper_1.default testID={CardNameStep.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.addNewCard.whatBankIssuesCard')}</Text_1.default>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.ADD_NEW_CARD_FEED_FORM} submitButtonText={translate('common.next')} onSubmit={submit} validate={validate} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding shouldPreventDefaultFocusOnPressSubmit>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={AddNewCardFeedForm_1.default.CARD_TITLE} label={translate('workspace.companyCards.addNewCard.enterNameOfBank')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={addNewCard?.data?.bankName} containerStyles={[styles.mb6]} ref={inputCallbackRef}/>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
CardNameStep.displayName = 'CardNameStep';
exports.default = CardNameStep;
