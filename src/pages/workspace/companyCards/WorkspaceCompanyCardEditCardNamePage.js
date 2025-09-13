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
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const CardUtils_1 = require("@libs/CardUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EditExpensifyCardNameForm_1 = require("@src/types/form/EditExpensifyCardNameForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function WorkspaceCompanyCardEditCardNamePage({ route }) {
    const { policyID, cardID } = route.params;
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const bank = decodeURIComponent(route.params.bank);
    const [customCardNames, customCardNamesMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_EXPENSIFY_COMPANY_CARDS_CUSTOM_NAMES, { canBeMissing: true });
    const defaultValue = customCardNames?.[cardID];
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, companyFeeds[bank]);
    const submit = (values) => {
        (0, CompanyCards_1.updateCompanyCardName)(domainOrWorkspaceAccountID, cardID, values[EditExpensifyCardNameForm_1.default.NAME], bank, defaultValue);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARD_DETAILS.getRoute(policyID, cardID, bank), { compareParams: false });
    };
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [EditExpensifyCardNameForm_1.default.NAME]);
        const length = values.name.length;
        if (length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, EditExpensifyCardNameForm_1.default.NAME, translate('common.error.characterLimitExceedCounter', {
                length,
                limit: CONST_1.default.STANDARD_LENGTH_LIMIT,
            }));
        }
        return errors;
    };
    if ((0, isLoadingOnyxValue_1.default)(customCardNamesMetadata)) {
        return null;
    }
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceCompanyCardEditCardNamePage.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.moreFeatures.companyCards.cardName')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARD_DETAILS.getRoute(policyID, cardID, bank), { compareParams: false })}/>
                <Text_1.default style={[styles.mh5, styles.mt3, styles.mb5]}>{translate('workspace.moreFeatures.companyCards.giveItNameInstruction')}</Text_1.default>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.EDIT_WORKSPACE_COMPANY_CARD_NAME_FORM} submitButtonText={translate('common.save')} onSubmit={submit} style={[styles.flex1, styles.mh5]} enabledWhenOffline validate={validate} shouldHideFixErrorsAlert>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={EditExpensifyCardNameForm_1.default.NAME} label={translate('workspace.moreFeatures.companyCards.cardName')} aria-label={translate('workspace.moreFeatures.companyCards.cardName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultValue} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCompanyCardEditCardNamePage.displayName = 'WorkspaceCompanyCardEditCardNamePage';
exports.default = WorkspaceCompanyCardEditCardNamePage;
