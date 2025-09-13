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
const DebugUtils_1 = require("@libs/DebugUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const DebugTabNavigator_1 = require("@libs/Navigation/DebugTabNavigator");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const DebugDetails_1 = require("@pages/Debug/DebugDetails");
const DebugJSON_1 = require("@pages/Debug/DebugJSON");
const Debug_1 = require("@userActions/Debug");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const DebugReportActionPreview_1 = require("./DebugReportActionPreview");
function DebugReportActionPage({ route: { params: { reportID, reportActionID }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
        canEvict: false,
        selector: (reportActions) => reportActions?.[reportActionID],
    });
    const transactionID = (0, ReportActionsUtils_1.getLinkedTransactionID)(reportAction);
    const DebugDetailsTab = (0, react_1.useCallback)(() => (<DebugDetails_1.default formType={CONST_1.default.DEBUG.FORMS.REPORT_ACTION} data={reportAction} onSave={(data) => {
            Debug_1.default.mergeDebugData(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, { [reportActionID]: data });
        }} onDelete={() => {
            Navigation_1.default.goBack();
            // We need to wait for navigation animations to finish before deleting an action,
            // otherwise the user will see a not found page briefly.
            react_native_1.InteractionManager.runAfterInteractions(() => {
                Debug_1.default.mergeDebugData(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, { [reportActionID]: null });
            });
        }} validate={DebugUtils_1.default.validateReportActionDraftProperty}>
                {!!transactionID && (<react_native_1.View style={[styles.mh5, styles.mb5]}>
                        <Button_1.default text={translate('debug.viewTransaction')} onPress={() => {
                Navigation_1.default.navigate(ROUTES_1.default.DEBUG_TRANSACTION.getRoute(transactionID));
            }}/>
                    </react_native_1.View>)}
            </DebugDetails_1.default>), [reportAction, reportActionID, reportID, styles.mb5, styles.mh5, transactionID, translate]);
    const DebugJSONTab = (0, react_1.useCallback)(() => <DebugJSON_1.default data={reportAction ?? {}}/>, [reportAction]);
    const DebugReportActionPreviewTab = (0, react_1.useCallback)(() => (<DebugReportActionPreview_1.default reportAction={reportAction} reportID={reportID}/>), [reportAction, reportID]);
    const routes = (0, react_1.useMemo)(() => [
        { name: CONST_1.default.DEBUG.DETAILS, component: DebugDetailsTab },
        { name: CONST_1.default.DEBUG.JSON, component: DebugJSONTab },
        { name: CONST_1.default.DEBUG.REPORT_ACTION_PREVIEW, component: DebugReportActionPreviewTab },
    ], [DebugDetailsTab, DebugJSONTab, DebugReportActionPreviewTab]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DebugReportActionPage.displayName}>
            {({ safeAreaPaddingBottomStyle }) => (<react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                    <HeaderWithBackButton_1.default title={`${translate('debug.debug')} - ${translate('debug.reportAction')}`} onBackButtonPress={Navigation_1.default.goBack}/>
                    <DebugTabNavigator_1.default id={CONST_1.default.TAB.DEBUG_TAB_ID} routes={routes}/>
                </react_native_1.View>)}
        </ScreenWrapper_1.default>);
}
DebugReportActionPage.displayName = 'DebugReportActionPage';
exports.default = DebugReportActionPage;
