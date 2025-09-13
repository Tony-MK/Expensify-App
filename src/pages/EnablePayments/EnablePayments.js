"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Wallet_1 = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AddBankAccount_1 = require("./AddBankAccount/AddBankAccount");
const FailedKYC_1 = require("./FailedKYC");
const FeesAndTerms_1 = require("./FeesAndTerms/FeesAndTerms");
const PersonalInfo_1 = require("./PersonalInfo/PersonalInfo");
const VerifyIdentity_1 = require("./VerifyIdentity/VerifyIdentity");
function EnablePaymentsPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [isActingAsDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => !!account?.delegatedAccess?.delegate, canBeMissing: true });
    (0, react_1.useEffect)(() => {
        if (isOffline) {
            return;
        }
        if ((0, EmptyObject_1.isEmptyObject)(userWallet)) {
            (0, Wallet_1.openEnablePaymentsPage)();
        }
    }, [isOffline, userWallet]);
    if (isActingAsDelegate) {
        return (<ScreenWrapper_1.default testID={EnablePaymentsPage.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false}>
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}/>
            </ScreenWrapper_1.default>);
    }
    if ((0, EmptyObject_1.isEmptyObject)(userWallet)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    if (userWallet?.errorCode === CONST_1.default.WALLET.ERROR.KYC) {
        return (<ScreenWrapper_1.default testID={EnablePaymentsPage.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false}>
                <HeaderWithBackButton_1.default title={translate('personalInfoStep.personalInfo')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET)}/>
                <FailedKYC_1.default />
            </ScreenWrapper_1.default>);
    }
    const enablePaymentsStep = (0, EmptyObject_1.isEmptyObject)(bankAccountList) ? CONST_1.default.WALLET.STEP.ADD_BANK_ACCOUNT : userWallet?.currentStep || CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS;
    let CurrentStep;
    switch (enablePaymentsStep) {
        case CONST_1.default.WALLET.STEP.ADD_BANK_ACCOUNT:
            CurrentStep = <AddBankAccount_1.default />;
            break;
        case CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS:
        case CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS_KBA:
            CurrentStep = <PersonalInfo_1.default />;
            break;
        case CONST_1.default.WALLET.STEP.ONFIDO:
            CurrentStep = <VerifyIdentity_1.default />;
            break;
        case CONST_1.default.WALLET.STEP.TERMS:
            CurrentStep = <FeesAndTerms_1.default />;
            break;
        default:
            CurrentStep = null;
            break;
    }
    if (CurrentStep) {
        return (<react_native_1.View style={styles.flex1} fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
                {CurrentStep}
            </react_native_1.View>);
    }
    return null;
}
EnablePaymentsPage.displayName = 'EnablePaymentsPage';
exports.default = EnablePaymentsPage;
