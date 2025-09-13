"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const IssueNewExpensifyCardForm_1 = require("@src/types/form/IssueNewExpensifyCardForm");
function CardNameStep({ policyID, stepNames, startStepIndex }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [issueNewCard] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { canBeMissing: true });
    const isEditing = issueNewCard?.isEditing;
    const data = issueNewCard?.data;
    const userName = (0, PersonalDetailsUtils_1.getUserNameByEmail)(data?.assigneeEmail ?? '', 'firstName');
    const defaultCardTitle = data?.cardType !== CONST_1.default.EXPENSIFY_CARD.CARD_TYPE.VIRTUAL ? (0, CardUtils_1.getDefaultCardName)(userName) : '';
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [IssueNewExpensifyCardForm_1.default.CARD_TITLE]);
        const length = values.cardTitle.length;
        if (length > CONST_1.default.STANDARD_LENGTH_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, IssueNewExpensifyCardForm_1.default.CARD_TITLE, translate('common.error.characterLimitExceedCounter', { length, limit: CONST_1.default.STANDARD_LENGTH_LIMIT }));
        }
        return errors;
    };
    const submit = (0, react_1.useCallback)((values) => {
        (0, Card_1.setIssueNewCardStepAndData)({
            step: CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION,
            data: {
                cardTitle: values.cardTitle,
            },
            isEditing: false,
            policyID,
        });
    }, [policyID]);
    const handleBackButtonPress = (0, react_1.useCallback)(() => {
        if (isEditing) {
            (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION, isEditing: false, policyID });
            return;
        }
        (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT, policyID });
    }, [isEditing, policyID]);
    return (<InteractiveStepWrapper_1.default wrapperID={CardNameStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('workspace.card.issueCard')} handleBackButtonPress={handleBackButtonPress} startStepIndex={startStepIndex} stepNames={stepNames} enableEdgeToEdgeBottomSafeAreaPadding>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.giveItName')}</Text_1.default>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.ISSUE_NEW_EXPENSIFY_CARD_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={submit} validate={validate} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={IssueNewExpensifyCardForm_1.default.CARD_TITLE} label={translate('workspace.card.issueNewCard.cardName')} hint={translate('workspace.card.issueNewCard.giveItNameInstruction')} aria-label={translate('workspace.card.issueNewCard.cardName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={issueNewCard?.data?.cardTitle ?? defaultCardTitle} containerStyles={[styles.mb6]} ref={inputCallbackRef}/>
            </FormProvider_1.default>
        </InteractiveStepWrapper_1.default>);
}
CardNameStep.displayName = 'CardNameStep';
exports.default = CardNameStep;
