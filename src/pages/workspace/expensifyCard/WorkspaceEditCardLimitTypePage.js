"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useCurrencyForExpensifyCard_1 = require("@hooks/useCurrencyForExpensifyCard");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Card_1 = require("@libs/actions/Card");
const Policy_1 = require("@libs/actions/Policy/Policy");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function WorkspaceEditCardLimitTypePage({ route }) {
    const { policyID, cardID, backTo } = route.params;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [cardsList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, { selector: CardUtils_1.filterInactiveCards, canBeMissing: true });
    const card = cardsList?.[cardID];
    const areApprovalsConfigured = (0, PolicyUtils_1.getApprovalWorkflow)(policy) !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL;
    const defaultLimitType = areApprovalsConfigured ? CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART : CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY;
    const initialLimitType = card?.nameValuePairs?.limitType ?? defaultLimitType;
    const promptTranslationKey = initialLimitType === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY || initialLimitType === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED
        ? 'workspace.expensifyCard.changeCardSmartLimitTypeWarning'
        : 'workspace.expensifyCard.changeCardMonthlyLimitTypeWarning';
    const [typeSelected, setTypeSelected] = (0, react_1.useState)(initialLimitType);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = (0, react_1.useState)(false);
    const currency = (0, useCurrencyForExpensifyCard_1.default)({ policyID });
    const isWorkspaceRhp = route.name === SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT_TYPE;
    const goBack = (0, react_1.useCallback)(() => {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack(isWorkspaceRhp ? ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_DETAILS.getRoute(policyID, cardID) : ROUTES_1.default.EXPENSIFY_CARD_DETAILS.getRoute(policyID, cardID));
    }, [backTo, isWorkspaceRhp, policyID, cardID]);
    const fetchCardLimitTypeData = (0, react_1.useCallback)(() => {
        (0, Policy_1.openPolicyEditCardLimitTypePage)(policyID, Number(cardID));
    }, [policyID, cardID]);
    (0, native_1.useFocusEffect)(fetchCardLimitTypeData);
    const updateCardLimitType = () => {
        setIsConfirmModalVisible(false);
        (0, Card_1.updateExpensifyCardLimitType)(workspaceAccountID, Number(cardID), typeSelected, card?.nameValuePairs?.limitType);
        goBack();
    };
    const submit = () => {
        let shouldShowConfirmModal = false;
        if (!!card?.unapprovedSpend && card?.nameValuePairs?.unapprovedExpenseLimit) {
            // Spends are coming as negative numbers from the backend and we need to make it positive for the correct expression.
            const unapprovedSpend = Math.abs(card.unapprovedSpend);
            const isUnapprovedSpendOverLimit = unapprovedSpend >= card.nameValuePairs.unapprovedExpenseLimit;
            const validCombinations = [
                [CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY, CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART],
                [CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART, CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY],
                [CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED, CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART],
                [CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED, CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY],
            ];
            // Check if the combination exists in validCombinations
            const isValidCombination = validCombinations.some(([limitType, selectedType]) => initialLimitType === limitType && typeSelected === selectedType);
            if (isValidCombination && isUnapprovedSpendOverLimit) {
                shouldShowConfirmModal = true;
            }
        }
        if (shouldShowConfirmModal) {
            setIsConfirmModalVisible(true);
        }
        else {
            updateCardLimitType();
        }
    };
    const data = (0, react_1.useMemo)(() => {
        const options = [];
        let shouldShowFixedOption = true;
        if (card?.totalSpend && card?.nameValuePairs?.unapprovedExpenseLimit) {
            const totalSpend = Math.abs(card.totalSpend);
            if ((initialLimitType === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY || initialLimitType === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART) &&
                totalSpend >= card.nameValuePairs?.unapprovedExpenseLimit) {
                shouldShowFixedOption = false;
            }
        }
        if (areApprovalsConfigured) {
            options.push({
                value: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART,
                text: translate('workspace.card.issueNewCard.smartLimit'),
                alternateText: translate('workspace.card.issueNewCard.smartLimitDescription'),
                keyForList: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART,
                isSelected: typeSelected === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART,
            });
        }
        options.push({
            value: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY,
            text: translate('workspace.card.issueNewCard.monthly'),
            alternateText: translate('workspace.card.issueNewCard.monthlyDescription'),
            keyForList: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY,
            isMultilineSupported: true,
            isSelected: typeSelected === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY,
        });
        if (shouldShowFixedOption) {
            options.push({
                value: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED,
                text: translate('workspace.card.issueNewCard.fixedAmount'),
                alternateText: translate('workspace.card.issueNewCard.fixedAmountDescription'),
                keyForList: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED,
                isMultilineSupported: true,
                isSelected: typeSelected === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED,
            });
        }
        return options;
    }, [areApprovalsConfigured, card, initialLimitType, translate, typeSelected]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceEditCardLimitTypePage.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.card.issueNewCard.limitType')} onBackButtonPress={goBack}/>
                <FullPageOfflineBlockingView_1.default addBottomSafeAreaPadding>
                    <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={({ value }) => setTypeSelected(value)} sections={[{ data }]} shouldUpdateFocusedIndex isAlternateTextMultilineSupported initiallyFocusedOptionKey={typeSelected}/>
                    <ConfirmModal_1.default title={translate('workspace.expensifyCard.changeCardLimitType')} isVisible={isConfirmModalVisible} onConfirm={updateCardLimitType} onCancel={() => setIsConfirmModalVisible(false)} prompt={translate(promptTranslationKey, { limit: (0, CurrencyUtils_1.convertToDisplayString)(card?.nameValuePairs?.unapprovedExpenseLimit, currency) })} confirmText={translate('workspace.expensifyCard.changeLimitType')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
                    <Button_1.default success large pressOnEnter text={translate('common.save')} onPress={submit} style={styles.m5}/>
                </FullPageOfflineBlockingView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceEditCardLimitTypePage.displayName = 'WorkspaceEditCardLimitTypePage';
exports.default = WorkspaceEditCardLimitTypePage;
