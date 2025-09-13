"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Illustrations = require("@components/Icon/Illustrations");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const MenuItem_1 = require("@components/MenuItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Card_1 = require("@libs/actions/Card");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function CardTypeStep({ policyID, stepNames, startStepIndex }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [issueNewCard] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { canBeMissing: true });
    const isEditing = issueNewCard?.isEditing;
    const submit = (value) => {
        (0, Card_1.setIssueNewCardStepAndData)({
            step: isEditing ? CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION : CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT_TYPE,
            data: {
                cardType: value,
            },
            isEditing: false,
            policyID,
        });
    };
    const handleBackButtonPress = () => {
        if (isEditing) {
            (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION, isEditing: false, policyID });
            return;
        }
        if (issueNewCard?.isChangeAssigneeDisabled) {
            Navigation_1.default.goBack();
            (0, Card_1.clearIssueNewCardFlow)(policyID);
            return;
        }
        (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.ASSIGNEE, policyID });
    };
    return (<InteractiveStepWrapper_1.default wrapperID={CardTypeStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight offlineIndicatorStyle={styles.mtAuto} headerTitle={translate('workspace.card.issueCard')} handleBackButtonPress={handleBackButtonPress} startStepIndex={startStepIndex} stepNames={stepNames} enableEdgeToEdgeBottomSafeAreaPadding>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.chooseCardType')}</Text_1.default>
            <react_native_1.View style={styles.mh5}>
                <MenuItem_1.default icon={Illustrations.HandCard} title={translate('workspace.card.issueNewCard.physicalCard')} description={translate('workspace.card.issueNewCard.physicalCardDescription')} shouldShowRightIcon onPress={() => submit(CONST_1.default.EXPENSIFY_CARD.CARD_TYPE.PHYSICAL)} displayInDefaultIconColor iconStyles={[styles.ml3, styles.mr2]} iconWidth={variables_1.default.menuIconSize} iconHeight={variables_1.default.menuIconSize} wrapperStyle={styles.purposeMenuItem}/>
                <MenuItem_1.default icon={Illustrations.VirtualCard} title={translate('workspace.card.issueNewCard.virtualCard')} description={translate('workspace.card.issueNewCard.virtualCardDescription')} shouldShowRightIcon onPress={() => submit(CONST_1.default.EXPENSIFY_CARD.CARD_TYPE.VIRTUAL)} displayInDefaultIconColor iconStyles={[styles.ml3, styles.mr2]} iconWidth={variables_1.default.menuIconSize} iconHeight={variables_1.default.menuIconSize} wrapperStyle={styles.purposeMenuItem}/>
            </react_native_1.View>
        </InteractiveStepWrapper_1.default>);
}
CardTypeStep.displayName = 'CardTypeStep';
exports.default = CardTypeStep;
