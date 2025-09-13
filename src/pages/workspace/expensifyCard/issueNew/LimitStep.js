"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AmountForm_1 = require("@components/AmountForm");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const Text_1 = require("@components/Text");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Card_1 = require("@libs/actions/Card");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const IssueNewExpensifyCardForm_1 = require("@src/types/form/IssueNewExpensifyCardForm");
function LimitStep({ policyID, stepNames, startStepIndex }) {
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [issueNewCard] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { canBeMissing: true });
    const isEditing = issueNewCard?.isEditing;
    const submit = (0, react_1.useCallback)((values) => {
        const limit = (0, CurrencyUtils_1.convertToBackendAmount)(Number(values?.limit));
        (0, Card_1.setIssueNewCardStepAndData)({
            step: isEditing ? CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION : CONST_1.default.EXPENSIFY_CARD.STEP.CARD_NAME,
            data: { limit },
            isEditing: false,
            policyID,
        });
    }, [isEditing, policyID]);
    const handleBackButtonPress = (0, react_1.useCallback)(() => {
        if (isEditing) {
            (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION, isEditing: false, policyID });
            return;
        }
        (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT_TYPE, policyID });
    }, [isEditing, policyID]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [IssueNewExpensifyCardForm_1.default.LIMIT]);
        // We only want integers to be sent as the limit
        if (!Number(values.limit)) {
            errors.limit = translate('iou.error.invalidAmount');
        }
        else if (!Number.isInteger(Number(values.limit))) {
            errors.limit = translate('iou.error.invalidIntegerAmount');
        }
        if (Number(values.limit) > CONST_1.default.EXPENSIFY_CARD.LIMIT_VALUE) {
            errors.limit = translate('workspace.card.issueNewCard.cardLimitError');
        }
        return errors;
    }, [translate]);
    return (<InteractiveStepWrapper_1.default wrapperID={LimitStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('workspace.card.issueCard')} handleBackButtonPress={handleBackButtonPress} startStepIndex={startStepIndex} stepNames={stepNames} enableEdgeToEdgeBottomSafeAreaPadding>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.setLimit')}</Text_1.default>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.ISSUE_NEW_EXPENSIFY_CARD_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} shouldHideFixErrorsAlert onSubmit={submit} style={[styles.flex1]} submitButtonStyles={[styles.mh5, styles.mt0]} submitFlexEnabled={false} disablePressOnEnter={false} validate={validate} enabledWhenOffline addBottomSafeAreaPadding>
                <InputWrapper_1.default InputComponent={AmountForm_1.default} defaultValue={(0, CurrencyUtils_1.convertToFrontendAmountAsString)(issueNewCard?.data?.limit, issueNewCard?.data?.currency, false)} isCurrencyPressable={false} currency={issueNewCard?.data?.currency} inputID={IssueNewExpensifyCardForm_1.default.LIMIT} ref={inputCallbackRef}/>
            </FormProvider_1.default>
        </InteractiveStepWrapper_1.default>);
}
LimitStep.displayName = 'LimitStep';
exports.default = LimitStep;
