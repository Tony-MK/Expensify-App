"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const Debug_1 = require("@libs/actions/Debug");
const DebugUtils_1 = require("@libs/DebugUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const DebugTabNavigator_1 = require("@libs/Navigation/DebugTabNavigator");
const Navigation_1 = require("@libs/Navigation/Navigation");
const DebugDetails_1 = require("@pages/Debug/DebugDetails");
const DebugJSON_1 = require("@pages/Debug/DebugJSON");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function DebugTransactionViolationPage({ route: { params: { transactionID, index }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const transactionViolations = (0, useTransactionViolations_1.default)(transactionID);
    const transactionViolation = (0, react_1.useMemo)(() => transactionViolations?.[Number(index)], [index, transactionViolations]);
    const styles = (0, useThemeStyles_1.default)();
    const saveChanges = (0, react_1.useCallback)((data) => {
        const updatedTransactionViolations = [...(transactionViolations ?? [])];
        updatedTransactionViolations.splice(Number(index), 1, data);
        Debug_1.default.setDebugData(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`, updatedTransactionViolations);
    }, [index, transactionID, transactionViolations]);
    const deleteTransactionViolation = (0, react_1.useCallback)(() => {
        const updatedTransactionViolations = [...(transactionViolations ?? [])];
        updatedTransactionViolations.splice(Number(index), 1);
        Navigation_1.default.goBack();
        // We need to wait for navigation animations to finish before deleting a violation,
        // otherwise the user will see a not found page briefly.
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Debug_1.default.setDebugData(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`, updatedTransactionViolations);
        });
    }, [index, transactionID, transactionViolations]);
    const DebugDetailsTab = (0, react_1.useCallback)(() => (<DebugDetails_1.default formType={CONST_1.default.DEBUG.FORMS.TRANSACTION_VIOLATION} data={transactionViolation} onSave={saveChanges} onDelete={deleteTransactionViolation} validate={DebugUtils_1.default.validateTransactionViolationDraftProperty}/>), [deleteTransactionViolation, saveChanges, transactionViolation]);
    const DebugJSONTab = (0, react_1.useCallback)(() => <DebugJSON_1.default data={transactionViolation ?? {}}/>, [transactionViolation]);
    const routes = (0, react_1.useMemo)(() => [
        { name: CONST_1.default.DEBUG.DETAILS, component: DebugDetailsTab },
        { name: CONST_1.default.DEBUG.JSON, component: DebugJSONTab },
    ], [DebugDetailsTab, DebugJSONTab]);
    if (!transactionViolation) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DebugTransactionViolationPage.displayName}>
            {({ safeAreaPaddingBottomStyle }) => (<react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                    <HeaderWithBackButton_1.default title={`${translate('debug.debug')} - ${translate('debug.transactionViolation')}`} onBackButtonPress={Navigation_1.default.goBack}/>
                    <DebugTabNavigator_1.default id={CONST_1.default.TAB.DEBUG_TAB_ID} routes={routes}/>
                </react_native_1.View>)}
        </ScreenWrapper_1.default>);
}
DebugTransactionViolationPage.displayName = 'DebugTransactionViolationPage';
exports.default = DebugTransactionViolationPage;
