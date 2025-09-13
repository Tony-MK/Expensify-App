"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AmountForm_1 = require("@components/AmountForm");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useCurrencyForExpensifyCard_1 = require("@hooks/useCurrencyForExpensifyCard");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const Card_1 = require("@libs/actions/Card");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EditExpensifyCardLimitForm_1 = require("@src/types/form/EditExpensifyCardLimitForm");
function WorkspaceEditCardLimitPage({ route }) {
    const { policyID, cardID, backTo } = route.params;
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isConfirmModalVisible, setIsConfirmModalVisible] = (0, react_1.useState)(false);
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const currency = (0, useCurrencyForExpensifyCard_1.default)({ policyID });
    const [cardsList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, { selector: CardUtils_1.filterInactiveCards, canBeMissing: true });
    const card = cardsList?.[cardID];
    const getPromptTextKey = (0, react_1.useMemo)(() => {
        switch (card?.nameValuePairs?.limitType) {
            case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART:
                return 'workspace.expensifyCard.smartLimitWarning';
            case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED:
                return 'workspace.expensifyCard.fixedLimitWarning';
            case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY:
                return 'workspace.expensifyCard.monthlyLimitWarning';
            default:
                return 'workspace.expensifyCard.fixedLimitWarning';
        }
    }, [card?.nameValuePairs?.limitType]);
    const getNewAvailableSpend = (newLimit) => {
        const currentLimit = card?.nameValuePairs?.unapprovedExpenseLimit ?? 0;
        const currentSpend = currentLimit - (card?.availableSpend ?? 0);
        return newLimit - currentSpend;
    };
    const isWorkspaceRhp = route.name === SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT;
    const goBack = (0, react_1.useCallback)(() => {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack(isWorkspaceRhp ? ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_DETAILS.getRoute(policyID, cardID) : ROUTES_1.default.EXPENSIFY_CARD_DETAILS.getRoute(policyID, cardID));
    }, [backTo, isWorkspaceRhp, policyID, cardID]);
    const updateCardLimit = (newLimit) => {
        const newAvailableSpend = getNewAvailableSpend(newLimit);
        setIsConfirmModalVisible(false);
        (0, Card_1.updateExpensifyCardLimit)(workspaceAccountID, Number(cardID), newLimit, newAvailableSpend, card?.nameValuePairs?.unapprovedExpenseLimit, card?.availableSpend);
        goBack();
    };
    const submit = (values) => {
        const newLimit = Number(values[EditExpensifyCardLimitForm_1.default.LIMIT]) * 100;
        const newAvailableSpend = getNewAvailableSpend(newLimit);
        if (newAvailableSpend <= 0) {
            setIsConfirmModalVisible(true);
            return;
        }
        updateCardLimit(newLimit);
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [EditExpensifyCardLimitForm_1.default.LIMIT]);
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
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceEditCardLimitPage.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.expensifyCard.cardLimit')} onBackButtonPress={goBack}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.EDIT_EXPENSIFY_CARD_LIMIT_FORM} submitButtonText={translate('common.save')} shouldHideFixErrorsAlert onSubmit={submit} style={styles.flex1} submitButtonStyles={[styles.mh5, styles.mt0]} submitFlexEnabled={false} enabledWhenOffline validate={validate}>
                    {({ inputValues }) => (<>
                            <InputWrapper_1.default InputComponent={AmountForm_1.default} defaultValue={(0, CurrencyUtils_1.convertToFrontendAmountAsString)(card?.nameValuePairs?.unapprovedExpenseLimit, currency, false)} isCurrencyPressable={false} currency={currency} inputID={EditExpensifyCardLimitForm_1.default.LIMIT} ref={inputCallbackRef}/>
                            <ConfirmModal_1.default title={translate('workspace.expensifyCard.changeCardLimit')} isVisible={isConfirmModalVisible} onConfirm={() => updateCardLimit(Number(inputValues[EditExpensifyCardLimitForm_1.default.LIMIT]) * 100)} onCancel={() => setIsConfirmModalVisible(false)} prompt={translate(getPromptTextKey, { limit: (0, CurrencyUtils_1.convertToDisplayString)(Number(inputValues[EditExpensifyCardLimitForm_1.default.LIMIT]) * 100, currency) })} confirmText={translate('workspace.expensifyCard.changeLimit')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
                        </>)}
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceEditCardLimitPage.displayName = 'WorkspaceEditCardLimitPage';
exports.default = WorkspaceEditCardLimitPage;
