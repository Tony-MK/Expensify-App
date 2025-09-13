"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const BankConnection_1 = require("@pages/workspace/companyCards/BankConnection");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const AmexCustomFeed_1 = require("./AmexCustomFeed");
const CardInstructionsStep_1 = require("./CardInstructionsStep");
const CardNameStep_1 = require("./CardNameStep");
const CardTypeStep_1 = require("./CardTypeStep");
const DetailsStep_1 = require("./DetailsStep");
const PlaidConnectionStep_1 = require("./PlaidConnectionStep");
const SelectBankStep_1 = require("./SelectBankStep");
const SelectCountryStep_1 = require("./SelectCountryStep");
const SelectFeedType_1 = require("./SelectFeedType");
const StatementCloseDateStep_1 = require("./StatementCloseDateStep");
function AddNewCardPage({ policy }) {
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [addNewCardFeed, addNewCardFeedMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: false });
    const { currentStep } = addNewCardFeed ?? {};
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [isActingAsDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => !!account?.delegatedAccess?.delegate, canBeMissing: false });
    const isAddCardFeedLoading = (0, isLoadingOnyxValue_1.default)(addNewCardFeedMetadata);
    (0, react_1.useEffect)(() => {
        return () => {
            (0, CompanyCards_1.clearAddNewCardFlow)();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        // If the user only has a domain feed, a workspace account may not have been created yet.
        // However, adding a workspace feed requires a workspace account.
        // Calling openPolicyAddCardFeedPage will trigger the creation of a workspace account.
        if (workspaceAccountID) {
            return;
        }
        (0, CompanyCards_1.openPolicyAddCardFeedPage)(policyID);
    }, [workspaceAccountID, policyID]);
    if (isAddCardFeedLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    if (isActingAsDelegate) {
        return (<ScreenWrapper_1.default testID={AddNewCardPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false}>
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}/>
            </ScreenWrapper_1.default>);
    }
    let CurrentStep;
    switch (currentStep) {
        case CONST_1.default.COMPANY_CARDS.STEP.SELECT_BANK:
            CurrentStep = <SelectBankStep_1.default />;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.SELECT_FEED_TYPE:
            CurrentStep = <SelectFeedType_1.default />;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.CARD_TYPE:
            CurrentStep = <CardTypeStep_1.default />;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.BANK_CONNECTION:
            CurrentStep = <BankConnection_1.default policyID={policyID}/>;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.CARD_INSTRUCTIONS:
            CurrentStep = <CardInstructionsStep_1.default policyID={policyID}/>;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.CARD_NAME:
            CurrentStep = <CardNameStep_1.default />;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.CARD_DETAILS:
            CurrentStep = <DetailsStep_1.default />;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.AMEX_CUSTOM_FEED:
            CurrentStep = <AmexCustomFeed_1.default />;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.PLAID_CONNECTION:
            CurrentStep = <PlaidConnectionStep_1.default />;
            break;
        case CONST_1.default.COMPANY_CARDS.STEP.SELECT_STATEMENT_CLOSE_DATE:
            CurrentStep = <StatementCloseDateStep_1.default policyID={policyID}/>;
            break;
        default:
            CurrentStep = isBetaEnabled(CONST_1.default.BETAS.PLAID_COMPANY_CARDS) ? <SelectCountryStep_1.default policyID={policyID}/> : <SelectBankStep_1.default />;
            break;
    }
    return (<react_native_1.View style={styles.flex1} fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
            {CurrentStep}
        </react_native_1.View>);
}
AddNewCardPage.displayName = 'AddNewCardPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(AddNewCardPage);
