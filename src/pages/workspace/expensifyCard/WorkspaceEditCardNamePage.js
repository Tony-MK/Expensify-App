"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const Card_1 = require("@libs/actions/Card");
const CardUtils_1 = require("@libs/CardUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EditExpensifyCardNameForm_1 = require("@src/types/form/EditExpensifyCardNameForm");
function WorkspaceEditCardNamePage({ route }) {
    const { policyID, cardID, backTo } = route.params;
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [cardsList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, { selector: CardUtils_1.filterInactiveCards });
    const card = cardsList?.[cardID];
    const isWorkspaceRhp = route.name === SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_NAME;
    const goBack = (0, react_1.useCallback)(() => {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack(isWorkspaceRhp ? ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_DETAILS.getRoute(policyID, cardID) : ROUTES_1.default.EXPENSIFY_CARD_DETAILS.getRoute(policyID, cardID));
    }, [backTo, isWorkspaceRhp, policyID, cardID]);
    const submit = (values) => {
        (0, Card_1.updateExpensifyCardTitle)(workspaceAccountID, Number(cardID), values[EditExpensifyCardNameForm_1.default.NAME], card?.nameValuePairs?.cardTitle);
        goBack();
    };
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [EditExpensifyCardNameForm_1.default.NAME]);
        const length = values.name.length;
        if (length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, EditExpensifyCardNameForm_1.default.NAME, translate('common.error.characterLimitExceedCounter', { length, limit: CONST_1.default.STANDARD_LENGTH_LIMIT }));
        }
        return errors;
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceEditCardNamePage.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.card.issueNewCard.cardName')} onBackButtonPress={goBack}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.EDIT_EXPENSIFY_CARD_NAME_FORM} submitButtonText={translate('common.save')} onSubmit={submit} style={[styles.flex1, styles.mh5]} enabledWhenOffline validate={validate} shouldHideFixErrorsAlert>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={EditExpensifyCardNameForm_1.default.NAME} label={translate('workspace.card.issueNewCard.cardName')} hint={translate('workspace.card.issueNewCard.giveItNameInstruction')} aria-label={translate('workspace.card.issueNewCard.cardName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={card?.nameValuePairs?.cardTitle} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceEditCardNamePage.displayName = 'WorkspaceEditCardNamePage';
exports.default = WorkspaceEditCardNamePage;
