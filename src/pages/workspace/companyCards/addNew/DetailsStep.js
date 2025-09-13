"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const TextLink_1 = require("@components/TextLink");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const variables_1 = require("@styles/variables");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AddNewCardFeedForm_1 = require("@src/types/form/AddNewCardFeedForm");
function DetailsStep() {
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: false });
    const feedProvider = addNewCard?.data?.feedType;
    const isStripeFeedProvider = feedProvider === CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.STRIPE;
    const bank = addNewCard?.data?.selectedBank;
    const isOtherBankSelected = bank === CONST_1.default.COMPANY_CARDS.BANKS.OTHER;
    const submit = (0, react_1.useCallback)((values) => {
        if (!addNewCard?.data) {
            return;
        }
        const feedDetails = {
            ...values,
            bankName: addNewCard.data.bankName ?? 'Amex',
        };
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.SELECT_STATEMENT_CLOSE_DATE, data: { feedDetails } });
    }, [addNewCard?.data]);
    const handleBackButtonPress = () => {
        if (isOtherBankSelected) {
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.CARD_NAME });
            return;
        }
        (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({ step: CONST_1.default.COMPANY_CARDS.STEP.CARD_INSTRUCTIONS });
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [AddNewCardFeedForm_1.default.BANK_ID]);
        switch (feedProvider) {
            case CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA:
                if (!values[AddNewCardFeedForm_1.default.BANK_ID]) {
                    errors[AddNewCardFeedForm_1.default.BANK_ID] = translate('common.error.fieldRequired');
                }
                else if (values[AddNewCardFeedForm_1.default.BANK_ID].length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
                    errors[AddNewCardFeedForm_1.default.BANK_ID] = translate('common.error.characterLimitExceedCounter', {
                        length: values[AddNewCardFeedForm_1.default.BANK_ID].length,
                        limit: CONST_1.default.STANDARD_LENGTH_LIMIT,
                    });
                }
                if (!values[AddNewCardFeedForm_1.default.PROCESSOR_ID]) {
                    errors[AddNewCardFeedForm_1.default.PROCESSOR_ID] = translate('common.error.fieldRequired');
                }
                else if (values[AddNewCardFeedForm_1.default.PROCESSOR_ID].length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
                    errors[AddNewCardFeedForm_1.default.PROCESSOR_ID] = translate('common.error.characterLimitExceedCounter', {
                        length: values[AddNewCardFeedForm_1.default.PROCESSOR_ID].length,
                        limit: CONST_1.default.STANDARD_LENGTH_LIMIT,
                    });
                }
                if (!values[AddNewCardFeedForm_1.default.COMPANY_ID]) {
                    errors[AddNewCardFeedForm_1.default.COMPANY_ID] = translate('common.error.fieldRequired');
                }
                else if (values[AddNewCardFeedForm_1.default.COMPANY_ID].length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
                    errors[AddNewCardFeedForm_1.default.COMPANY_ID] = translate('common.error.characterLimitExceedCounter', {
                        length: values[AddNewCardFeedForm_1.default.COMPANY_ID].length,
                        limit: CONST_1.default.STANDARD_LENGTH_LIMIT,
                    });
                }
                break;
            case CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD:
                if (!values[AddNewCardFeedForm_1.default.DISTRIBUTION_ID]) {
                    errors[AddNewCardFeedForm_1.default.DISTRIBUTION_ID] = translate('common.error.fieldRequired');
                }
                else if (values[AddNewCardFeedForm_1.default.DISTRIBUTION_ID].length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
                    errors[AddNewCardFeedForm_1.default.DISTRIBUTION_ID] = translate('common.error.characterLimitExceedCounter', {
                        length: values[AddNewCardFeedForm_1.default.DISTRIBUTION_ID].length,
                        limit: CONST_1.default.STANDARD_LENGTH_LIMIT,
                    });
                }
                break;
            case CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX:
                if (!values[AddNewCardFeedForm_1.default.DELIVERY_FILE_NAME]) {
                    errors[AddNewCardFeedForm_1.default.DELIVERY_FILE_NAME] = translate('common.error.fieldRequired');
                }
                else if (values[AddNewCardFeedForm_1.default.DELIVERY_FILE_NAME].length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
                    errors[AddNewCardFeedForm_1.default.DELIVERY_FILE_NAME] = translate('common.error.characterLimitExceedCounter', {
                        length: values[AddNewCardFeedForm_1.default.DELIVERY_FILE_NAME].length,
                        limit: CONST_1.default.STANDARD_LENGTH_LIMIT,
                    });
                }
                break;
            default:
                break;
        }
        return errors;
    }, [feedProvider, translate]);
    const renderInputs = () => {
        switch (feedProvider) {
            case CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA:
                return (<>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={AddNewCardFeedForm_1.default.PROCESSOR_ID} label={translate('workspace.companyCards.addNewCard.feedDetails.vcf.processorLabel')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mb6]} ref={inputCallbackRef} defaultValue={addNewCard?.data.feedDetails?.processorID}/>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={AddNewCardFeedForm_1.default.BANK_ID} label={translate('workspace.companyCards.addNewCard.feedDetails.vcf.bankLabel')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mb6]} defaultValue={addNewCard?.data.feedDetails?.bankID}/>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={AddNewCardFeedForm_1.default.COMPANY_ID} label={translate('workspace.companyCards.addNewCard.feedDetails.vcf.companyLabel')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mb6]} defaultValue={addNewCard?.data.feedDetails?.companyID}/>
                    </>);
            case CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD:
                return (<InputWrapper_1.default InputComponent={TextInput_1.default} inputID={AddNewCardFeedForm_1.default.DISTRIBUTION_ID} label={translate('workspace.companyCards.addNewCard.feedDetails.cdf.distributionLabel')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mb6]} ref={inputCallbackRef} defaultValue={addNewCard?.data.feedDetails?.distributionID}/>);
            case CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX:
                return (<InputWrapper_1.default InputComponent={TextInput_1.default} inputID={AddNewCardFeedForm_1.default.DELIVERY_FILE_NAME} label={translate('workspace.companyCards.addNewCard.feedDetails.gl1025.fileNameLabel')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mb6]} ref={inputCallbackRef} defaultValue={addNewCard?.data.feedDetails?.deliveryFileName}/>);
            default:
                return null;
        }
    };
    return (<ScreenWrapper_1.default testID={DetailsStep.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.ADD_NEW_CARD_FEED_FORM} submitButtonText={translate('common.next')} onSubmit={submit} validate={validate} style={[styles.mh5, styles.flexGrow1]} shouldHideFixErrorsAlert={feedProvider !== CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA} addBottomSafeAreaPadding>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mv3]}>
                    {!!feedProvider && !isStripeFeedProvider ? translate(`workspace.companyCards.addNewCard.feedDetails.${feedProvider}.title`) : ''}
                </Text_1.default>
                {renderInputs()}
                {!!feedProvider && !isStripeFeedProvider && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                        <Icon_1.default src={Expensicons.QuestionMark} width={variables_1.default.iconSizeExtraSmall} height={variables_1.default.iconSizeExtraSmall} fill={theme.icon}/>
                        <TextLink_1.default style={[styles.label, styles.textLineHeightNormal, styles.ml2]} href={CONST_1.default.COMPANY_CARDS_DELIVERY_FILE_HELP[feedProvider]}>
                            {translate(`workspace.companyCards.addNewCard.feedDetails.${feedProvider}.helpLabel`)}
                        </TextLink_1.default>
                    </react_native_1.View>)}
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
DetailsStep.displayName = 'DetailsStep';
exports.default = DetailsStep;
