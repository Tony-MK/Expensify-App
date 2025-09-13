"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
// Importing from the react-native-gesture-handler package instead of the `components/ScrollView` to fix scroll issue:
// https://github.com/react-native-modal/react-native-modal/issues/236
var HeaderGap_1 = require("@components/HeaderGap");
var getHelpContent_1 = require("@components/SidePanel/getHelpContent");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useRootNavigationState_1 = require("@hooks/useRootNavigationState");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var config_1 = require("@libs/Navigation/linkingConfig/config");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var HelpHeader_1 = require("./HelpHeader");
function HelpContent(_a) {
    var closeSidePanel = _a.closeSidePanel;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var isProduction = (0, useEnvironment_1.default)().isProduction;
    var isExtraLargeScreenWidth = (0, useResponsiveLayout_1.default)().isExtraLargeScreenWidth;
    var _b = (0, react_1.useState)(0), expandedIndex = _b[0], setExpandedIndex = _b[1];
    var _c = (0, useRootNavigationState_1.default)(function (rootState) {
        var _a;
        var focusedRoute = (0, native_1.findFocusedRoute)(rootState);
        setExpandedIndex(0);
        return {
            routeName: ((_a = focusedRoute === null || focusedRoute === void 0 ? void 0 : focusedRoute.name) !== null && _a !== void 0 ? _a : ''),
            params: focusedRoute === null || focusedRoute === void 0 ? void 0 : focusedRoute.params,
            currentState: rootState,
        };
    }), params = _c.params, routeName = _c.routeName, currentState = _c.currentState;
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat((params === null || params === void 0 ? void 0 : params.reportID) || String(CONST_1.default.DEFAULT_NUMBER_ID)), { canBeMissing: true })[0];
    var reportActions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(report === null || report === void 0 ? void 0 : report.reportID), { canBeMissing: true })[0];
    var chatReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report === null || report === void 0 ? void 0 : report.parentReportID), { canBeMissing: true })[0];
    var parentIOUReportAction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(report === null || report === void 0 ? void 0 : report.parentReportID), {
        canBeMissing: true,
        selector: function (actions) {
            return Object.values(actions !== null && actions !== void 0 ? actions : {})
                .filter(function (action) { return action.reportActionID === (report === null || report === void 0 ? void 0 : report.parentReportActionID); })
                .filter(ReportActionsUtils_1.isMoneyRequestAction)
                .at(0);
        },
    })[0];
    var transactionID = (0, react_1.useMemo)(function () {
        var _a;
        var transactionThreadReportAction = (0, ReportActionsUtils_1.getOneTransactionThreadReportAction)(report, chatReport, reportActions !== null && reportActions !== void 0 ? reportActions : []);
        return (_a = (0, ReportActionsUtils_1.getOriginalMessage)(parentIOUReportAction !== null && parentIOUReportAction !== void 0 ? parentIOUReportAction : transactionThreadReportAction)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID;
    }, [report, chatReport, reportActions, parentIOUReportAction]);
    var transaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat((0, getNonEmptyStringOnyxID_1.default)(transactionID)), { canBeMissing: true })[0];
    var route = (0, react_1.useMemo)(function () {
        var _a;
        var path = (_a = config_1.normalizedConfigs[routeName]) === null || _a === void 0 ? void 0 : _a.path;
        if (!path) {
            return '';
        }
        var cleanedPath = path.replaceAll('?', '');
        var expenseType = (0, TransactionUtils_1.getExpenseType)(transaction);
        var reportType = (0, ReportUtils_1.getHelpPaneReportType)(report);
        if (expenseType && reportType !== CONST_1.default.REPORT.HELP_TYPE.EXPENSE_REPORT) {
            return cleanedPath.replaceAll(':reportID', ":".concat(CONST_1.default.REPORT.HELP_TYPE.EXPENSE, "/:").concat(expenseType));
        }
        if (reportType) {
            return cleanedPath.replaceAll(':reportID', ":".concat(reportType));
        }
        return cleanedPath;
    }, [routeName, transaction, report]);
    var wasPreviousNarrowScreen = (0, react_1.useRef)(!isExtraLargeScreenWidth);
    (0, react_1.useEffect)(function () {
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
            <HelpHeader_1.default title={translate('common.help')} onBackButtonPress={function () { return closeSidePanel(false); }} onCloseButtonPress={function () { return closeSidePanel(false); }} shouldShowBackButton={!isExtraLargeScreenWidth} shouldShowCloseButton={isExtraLargeScreenWidth}/>
            {currentState === undefined ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<react_native_gesture_handler_1.ScrollView style={[styles.ph5, styles.pb5]} userSelect="auto" scrollIndicatorInsets={{ right: Number.MIN_VALUE }}>
                    {(0, getHelpContent_1.default)(styles, route, isProduction, expandedIndex, setExpandedIndex)}
                </react_native_gesture_handler_1.ScrollView>)}
        </>);
}
HelpContent.displayName = 'HelpContent';
exports.default = HelpContent;
