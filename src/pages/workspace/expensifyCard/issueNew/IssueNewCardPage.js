"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useInitial_1 = require("@hooks/useInitial");
const useOnyx_1 = require("@hooks/useOnyx");
const Card_1 = require("@libs/actions/Card");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AssigneeStep_1 = require("./AssigneeStep");
const CardNameStep_1 = require("./CardNameStep");
const CardTypeStep_1 = require("./CardTypeStep");
const ConfirmationStep_1 = require("./ConfirmationStep");
const LimitStep_1 = require("./LimitStep");
const LimitTypeStep_1 = require("./LimitTypeStep");
function getStartStepIndex(issueNewCard) {
    if (!issueNewCard) {
        return 0;
    }
    const STEP_INDEXES = {
        [CONST_1.default.EXPENSIFY_CARD.STEP.ASSIGNEE]: 0,
        [CONST_1.default.EXPENSIFY_CARD.STEP.CARD_TYPE]: 1,
        [CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT_TYPE]: 2,
        [CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT]: 3,
        [CONST_1.default.EXPENSIFY_CARD.STEP.CARD_NAME]: 4,
        [CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION]: 5,
    };
    const stepIndex = STEP_INDEXES[issueNewCard.currentStep];
    return issueNewCard.isChangeAssigneeDisabled ? stepIndex - 1 : stepIndex;
}
function IssueNewCardPage({ policy, route }) {
    const policyID = policy?.id;
    const [issueNewCard] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { canBeMissing: true });
    const { currentStep } = issueNewCard ?? {};
    const backTo = route?.params?.backTo;
    const firstAssigneeEmail = (0, useInitial_1.default)(issueNewCard?.data?.assigneeEmail);
    const shouldUseBackToParam = !firstAssigneeEmail || firstAssigneeEmail === issueNewCard?.data?.assigneeEmail;
    const [isActingAsDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => !!account?.delegatedAccess?.delegate, canBeMissing: true });
    const stepNames = issueNewCard?.isChangeAssigneeDisabled ? CONST_1.default.EXPENSIFY_CARD.ASSIGNEE_EXCLUDED_STEP_NAMES : CONST_1.default.EXPENSIFY_CARD.STEP_NAMES;
    const startStepIndex = (0, react_1.useMemo)(() => getStartStepIndex(issueNewCard), [issueNewCard]);
    (0, react_1.useEffect)(() => {
        (0, Card_1.startIssueNewCardFlow)(policyID);
    }, [policyID]);
    const getCurrentStep = () => {
        switch (currentStep) {
            case CONST_1.default.EXPENSIFY_CARD.STEP.ASSIGNEE:
                return (<AssigneeStep_1.default policy={policy} stepNames={stepNames} startStepIndex={startStepIndex}/>);
            case CONST_1.default.EXPENSIFY_CARD.STEP.CARD_TYPE:
                return (<CardTypeStep_1.default policyID={policyID} stepNames={stepNames} startStepIndex={startStepIndex}/>);
            case CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT_TYPE:
                return (<LimitTypeStep_1.default policy={policy} stepNames={stepNames} startStepIndex={startStepIndex}/>);
            case CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT:
                return (<LimitStep_1.default policyID={policyID} stepNames={stepNames} startStepIndex={startStepIndex}/>);
            case CONST_1.default.EXPENSIFY_CARD.STEP.CARD_NAME:
                return (<CardNameStep_1.default policyID={policyID} stepNames={stepNames} startStepIndex={startStepIndex}/>);
            case CONST_1.default.EXPENSIFY_CARD.STEP.CONFIRMATION:
                return (<ConfirmationStep_1.default policyID={policyID} backTo={shouldUseBackToParam ? backTo : undefined} stepNames={stepNames} startStepIndex={startStepIndex}/>);
            default:
                return (<AssigneeStep_1.default policy={policy} stepNames={stepNames} startStepIndex={startStepIndex}/>);
        }
    };
    if (isActingAsDelegate) {
        return (<ScreenWrapper_1.default testID={IssueNewCardPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false}>
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            </ScreenWrapper_1.default>);
    }
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            {getCurrentStep()}
        </AccessOrNotFoundWrapper_1.default>);
}
IssueNewCardPage.displayName = 'IssueNewCardPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(IssueNewCardPage);
