"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Debug_1 = require("@libs/actions/Debug");
const DebugUtils_1 = require("@libs/DebugUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const DebugTabNavigator_1 = require("@libs/Navigation/DebugTabNavigator");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
const DebugDetails_1 = require("@pages/Debug/DebugDetails");
const DebugJSON_1 = require("@pages/Debug/DebugJSON");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const DebugTransactionViolations_1 = require("./DebugTransactionViolations");
function DebugTransactionPage({ route: { params: { transactionID }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, {
        canBeMissing: true,
    });
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`, {
        canBeMissing: true,
    });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, {
        canBeMissing: true,
    });
    const policyTagLists = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagLists)(policyTags), [policyTags]);
    const styles = (0, useThemeStyles_1.default)();
    const DebugDetailsTab = (0, react_1.useCallback)(() => (<DebugDetails_1.default formType={CONST_1.default.DEBUG.FORMS.TRANSACTION} data={transaction} policyID={report?.policyID} policyHasEnabledTags={(0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists)} onSave={(data) => {
            Debug_1.default.setDebugData(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, data);
        }} onDelete={() => {
            Navigation_1.default.goBack();
            // We need to wait for navigation animations to finish before deleting a transaction,
            // otherwise the user will see a not found page briefly.
            react_native_1.InteractionManager.runAfterInteractions(() => {
                Debug_1.default.setDebugData(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, null);
            });
        }} validate={DebugUtils_1.default.validateTransactionDraftProperty}>
                <react_native_1.View style={[styles.mh5, styles.mb5]}>
                    <Button_1.default text={translate('debug.viewReport')} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT.getRoute(`${transaction?.reportID}`));
        }}/>
                </react_native_1.View>
            </DebugDetails_1.default>), [policyTagLists, report?.policyID, styles.mb5, styles.mh5, transaction, transactionID, translate]);
    const DebugJSONTab = (0, react_1.useCallback)(() => <DebugJSON_1.default data={transaction ?? {}}/>, [transaction]);
    const DebugTransactionViolationsTab = (0, react_1.useCallback)(() => <DebugTransactionViolations_1.default transactionID={transactionID}/>, [transactionID]);
    const routes = (0, react_1.useMemo)(() => [
        { name: CONST_1.default.DEBUG.DETAILS, component: DebugDetailsTab },
        { name: CONST_1.default.DEBUG.JSON, component: DebugJSONTab },
        { name: CONST_1.default.DEBUG.TRANSACTION_VIOLATIONS, component: DebugTransactionViolationsTab },
    ], [DebugDetailsTab, DebugJSONTab, DebugTransactionViolationsTab]);
    if (!transaction) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DebugTransactionPage.displayName}>
            {({ safeAreaPaddingBottomStyle }) => (<react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                    <HeaderWithBackButton_1.default title={`${translate('debug.debug')} - ${translate('debug.transaction')}`} onBackButtonPress={Navigation_1.default.goBack}/>
                    <DebugTabNavigator_1.default id={CONST_1.default.TAB.DEBUG_TAB_ID} routes={routes}/>
                </react_native_1.View>)}
        </ScreenWrapper_1.default>);
}
DebugTransactionPage.displayName = 'DebugTransactionPage';
exports.default = DebugTransactionPage;
