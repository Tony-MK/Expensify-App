"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
// Importing from the react-native-gesture-handler package instead of the `components/ScrollView` to fix scroll issue:
// https://github.com/react-native-modal/react-native-modal/issues/236
const HeaderGap_1 = require("@components/HeaderGap");
const getHelpContent_1 = require("@components/SidePanel/getHelpContent");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const config_1 = require("@libs/Navigation/linkingConfig/config");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const HelpHeader_1 = require("./HelpHeader");
function HelpContent({ closeSidePanel }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const { isExtraLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [expandedIndex, setExpandedIndex] = (0, react_1.useState)(0);
    const { params, routeName, currentState } = (0, useRootNavigationState_1.default)((rootState) => {
        const focusedRoute = (0, native_1.findFocusedRoute)(rootState);
        setExpandedIndex(0);
        return {
            routeName: (focusedRoute?.name ?? ''),
            params: focusedRoute?.params,
            currentState: rootState,
        };
    });
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${params?.reportID || String(CONST_1.default.DEFAULT_NUMBER_ID)}`, { canBeMissing: true });
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`, { canBeMissing: true });
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    const [parentIOUReportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.parentReportID}`, {
        canBeMissing: true,
        selector: (actions) => Object.values(actions ?? {})
            .filter((action) => action.reportActionID === report?.parentReportActionID)
            .filter(ReportActionsUtils_1.isMoneyRequestAction)
            .at(0),
    });
    const transactionID = (0, react_1.useMemo)(() => {
        const transactionThreadReportAction = (0, ReportActionsUtils_1.getOneTransactionThreadReportAction)(report, chatReport, reportActions ?? []);
        return (0, ReportActionsUtils_1.getOriginalMessage)(parentIOUReportAction ?? transactionThreadReportAction)?.IOUTransactionID;
    }, [report, chatReport, reportActions, parentIOUReportAction]);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const route = (0, react_1.useMemo)(() => {
        const path = config_1.normalizedConfigs[routeName]?.path;
        if (!path) {
            return '';
        }
        const cleanedPath = path.replaceAll('?', '');
        const expenseType = (0, TransactionUtils_1.getExpenseType)(transaction);
        const reportType = (0, ReportUtils_1.getHelpPaneReportType)(report);
        if (expenseType && reportType !== CONST_1.default.REPORT.HELP_TYPE.EXPENSE_REPORT) {
            return cleanedPath.replaceAll(':reportID', `:${CONST_1.default.REPORT.HELP_TYPE.EXPENSE}/:${expenseType}`);
        }
        if (reportType) {
            return cleanedPath.replaceAll(':reportID', `:${reportType}`);
        }
        return cleanedPath;
    }, [routeName, transaction, report]);
    const wasPreviousNarrowScreen = (0, react_1.useRef)(!isExtraLargeScreenWidth);
    (0, react_1.useEffect)(() => {
        // Close the Side Panel when the screen size changes from large to small
        if (!isExtraLargeScreenWidth && !wasPreviousNarrowScreen.current) {
            closeSidePanel(true);
            wasPreviousNarrowScreen.current = true;
        }
        // Reset the trigger when the screen size changes back to large
        if (isExtraLargeScreenWidth) {
            wasPreviousNarrowScreen.current = false;
        }
    }, [isExtraLargeScreenWidth, closeSidePanel]);
    return (<>
            <HeaderGap_1.default />
            <HelpHeader_1.default title={translate('common.help')} onBackButtonPress={() => closeSidePanel(false)} onCloseButtonPress={() => closeSidePanel(false)} shouldShowBackButton={!isExtraLargeScreenWidth} shouldShowCloseButton={isExtraLargeScreenWidth}/>
            {currentState === undefined ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<react_native_gesture_handler_1.ScrollView style={[styles.ph5, styles.pb5]} userSelect="auto" scrollIndicatorInsets={{ right: Number.MIN_VALUE }}>
                    {(0, getHelpContent_1.default)(styles, route, isProduction, expandedIndex, setExpandedIndex)}
                </react_native_gesture_handler_1.ScrollView>)}
        </>);
}
HelpContent.displayName = 'HelpContent';
exports.default = HelpContent;
