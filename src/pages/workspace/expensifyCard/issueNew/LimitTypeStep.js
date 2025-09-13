"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Card_1 = require("@libs/actions/Card");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function LimitTypeStep({ policy, stepNames, startStepIndex }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const [issueNewCard] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { canBeMissing: true });
    const areApprovalsConfigured = (0, PolicyUtils_1.getApprovalWorkflow)(policy) !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL;
    const defaultType = areApprovalsConfigured ? CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART : CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY;
    const [typeSelected, setTypeSelected] = (0, react_1.useState)(issueNewCard?.data?.limitType ?? defaultType);
    const isEditing = issueNewCard?.isEditing;
    const submit = (0, react_1.useCallback)(() => {
        (0, Card_1.setIssueNewCardStepAndData)({
            step: isEditing ? CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION : CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT,
            data: { limitType: typeSelected },
            isEditing: false,
            policyID,
        });
    }, [isEditing, typeSelected, policyID]);
    const handleBackButtonPress = (0, react_1.useCallback)(() => {
        if (isEditing) {
            (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION, isEditing: false, policyID });
            return;
        }
        (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.CARD_TYPE, policyID });
    }, [isEditing, policyID]);
    const data = (0, react_1.useMemo)(() => {
        const options = [];
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
            isSelected: typeSelected === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY,
        }, {
            value: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED,
            text: translate('workspace.card.issueNewCard.fixedAmount'),
            alternateText: translate('workspace.card.issueNewCard.fixedAmountDescription'),
            keyForList: CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED,
            isSelected: typeSelected === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED,
        });
        return options;
    }, [areApprovalsConfigured, translate, typeSelected]);
    return (<InteractiveStepWrapper_1.default wrapperID={LimitTypeStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('workspace.card.issueCard')} handleBackButtonPress={handleBackButtonPress} startStepIndex={startStepIndex} stepNames={stepNames} enableEdgeToEdgeBottomSafeAreaPadding>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.chooseLimitType')}</Text_1.default>
            <SelectionList_1.default ListItem={RadioListItem_1.default} onSelectRow={({ value }) => setTypeSelected(value)} sections={[{ data }]} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={typeSelected} shouldUpdateFocusedIndex isAlternateTextMultilineSupported addBottomSafeAreaPadding footerContent={<Button_1.default success large pressOnEnter text={translate(isEditing ? 'common.confirm' : 'common.next')} onPress={submit}/>}/>
        </InteractiveStepWrapper_1.default>);
}
LimitTypeStep.displayName = 'LimitTypeStep';
exports.default = LimitTypeStep;
