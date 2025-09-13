"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useInitial_1 = require("@hooks/useInitial");
const useOnyx_1 = require("@hooks/useOnyx");
const PlaidConnectionStep_1 = require("@pages/workspace/companyCards/addNew/PlaidConnectionStep");
const BankConnection_1 = require("@pages/workspace/companyCards/BankConnection");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AssigneeStep_1 = require("./AssigneeStep");
const CardNameStep_1 = require("./CardNameStep");
const CardSelectionStep_1 = require("./CardSelectionStep");
const ConfirmationStep_1 = require("./ConfirmationStep");
const TransactionStartDateStep_1 = require("./TransactionStartDateStep");
function AssignCardFeedPage({ route, policy }) {
    const [assignCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ASSIGN_CARD, { canBeMissing: true });
    const currentStep = assignCard?.currentStep;
    const feed = decodeURIComponent(route.params?.feed);
    const backTo = route.params?.backTo;
    const policyID = policy?.id;
    const [isActingAsDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => !!account?.delegatedAccess?.delegate, canBeMissing: true });
    const firstAssigneeEmail = (0, useInitial_1.default)(assignCard?.data?.email);
    const shouldUseBackToParam = !firstAssigneeEmail || firstAssigneeEmail === assignCard?.data?.email;
    (0, react_1.useEffect)(() => {
        return () => {
            (0, CompanyCards_1.clearAssignCardStepAndData)();
        };
    }, []);
    if (isActingAsDelegate) {
        return (<ScreenWrapper_1.default testID={AssignCardFeedPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false}>
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}/>
            </ScreenWrapper_1.default>);
    }
    switch (currentStep) {
        case CONST_1.default.COMPANY_CARD.STEP.BANK_CONNECTION:
            return (<BankConnection_1.default policyID={policyID} feed={feed}/>);
        case CONST_1.default.COMPANY_CARD.STEP.PLAID_CONNECTION:
            return (<PlaidConnectionStep_1.default feed={feed} policyID={policyID}/>);
        case CONST_1.default.COMPANY_CARD.STEP.ASSIGNEE:
            return (<AssigneeStep_1.default policy={policy} feed={feed}/>);
        case CONST_1.default.COMPANY_CARD.STEP.CARD:
            return (<CardSelectionStep_1.default feed={feed} policyID={policyID}/>);
        case CONST_1.default.COMPANY_CARD.STEP.TRANSACTION_START_DATE:
            return (<TransactionStartDateStep_1.default policyID={policyID} feed={feed} backTo={backTo}/>);
        case CONST_1.default.COMPANY_CARD.STEP.CARD_NAME:
            return <CardNameStep_1.default policyID={policyID}/>;
        case CONST_1.default.COMPANY_CARD.STEP.CONFIRMATION:
            return (<ConfirmationStep_1.default policyID={policyID} feed={feed} backTo={shouldUseBackToParam ? backTo : undefined}/>);
        default:
            return (<AssigneeStep_1.default policy={policy} feed={feed}/>);
    }
}
AssignCardFeedPage.displayName = 'AssignCardFeedPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(AssignCardFeedPage);
