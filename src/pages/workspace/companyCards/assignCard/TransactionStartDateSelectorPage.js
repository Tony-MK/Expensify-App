"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const AssignCardForm_1 = require("@src/types/form/AssignCardForm");
function TransactionStartDateSelectorPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD);
    const startDate = assignCard?.startDate ?? assignCard?.data?.startDate ?? (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING);
    const policyID = route.params.policyID;
    const validate = (values) => (0, ValidationUtils_1.getFieldRequiredErrors)(values, [AssignCardForm_1.default.START_DATE]);
    const goBack = () => {
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ASSIGN_CARD.getRoute(policyID, route.params.feed, route.params.backTo));
    };
    const submit = (values) => {
        (0, CompanyCards_1.setTransactionStartDate)(values[AssignCardForm_1.default.START_DATE]);
        goBack();
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <ScreenWrapper_1.default style={styles.pb0} testID={TransactionStartDateSelectorPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('common.date')} shouldShowBackButton onBackButtonPress={goBack}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.ASSIGN_CARD_FORM} submitButtonText={translate('common.save')} onSubmit={submit} style={[styles.flexGrow1, styles.ph5]} enabledWhenOffline validate={validate} shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={AssignCardForm_1.default.START_DATE} minDate={CONST_1.default.CALENDAR_PICKER.MIN_DATE} maxDate={new Date()} defaultValue={startDate} autoFocus/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
TransactionStartDateSelectorPage.displayName = 'TransactionStartDateSelectorPage';
exports.default = TransactionStartDateSelectorPage;
