"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var FocusTrapContainerElement_1 = require("@components/FocusTrap/FocusTrapContainerElement");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var TabSelector_1 = require("@components/TabSelector/TabSelector");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var usePrevious_1 = require("@hooks/usePrevious");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
var Performance_1 = require("@libs/Performance");
var ReportUtils_1 = require("@libs/ReportUtils");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var IOU_1 = require("@userActions/IOU");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var IOURequestStepDistanceManual_1 = require("./step/IOURequestStepDistanceManual");
var IOURequestStepDistanceMap_1 = require("./step/IOURequestStepDistanceMap");
function DistanceRequestStartPage(_a) {
    var _b;
    var route = _a.route, _c = _a.route.params, iouType = _c.iouType, reportID = _c.reportID, navigation = _a.navigation, 
    // This is currently only being used for testing
    _d = _a.defaultSelectedTab, 
    // This is currently only being used for testing
    defaultSelectedTab = _d === void 0 ? CONST_1.default.TAB_REQUEST.DISTANCE_MAP : _d;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), { canBeMissing: true })[0];
    var parentReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report === null || report === void 0 ? void 0 : report.parentReportID), { canBeMissing: true })[0];
    var policy = (0, usePolicy_1.default)(report === null || report === void 0 ? void 0 : report.policyID);
    var _e = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SELECTED_TAB).concat(CONST_1.default.TAB.DISTANCE_REQUEST_TYPE), { canBeMissing: true }), selectedTab = _e[0], selectedTabResult = _e[1];
    var lastDistanceExpenseType = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_DISTANCE_EXPENSE_TYPE, { canBeMissing: true })[0];
    var isLoadingSelectedTab = (0, isLoadingOnyxValue_1.default)(selectedTabResult);
    var transaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat((0, getNonEmptyStringOnyxID_1.default)(route === null || route === void 0 ? void 0 : route.params.transactionID)), { canBeMissing: true })[0];
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false })[0];
    var lastSelectedDistanceRates = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true })[0];
    var currentDate = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true })[0];
    var tabTitles = (_b = {},
        _b[CONST_1.default.IOU.TYPE.REQUEST] = translate('iou.trackDistance'),
        _b[CONST_1.default.IOU.TYPE.SUBMIT] = translate('iou.trackDistance'),
        _b[CONST_1.default.IOU.TYPE.SEND] = translate('iou.paySomeone', { name: (0, ReportUtils_1.getPayeeName)(report) }),
        _b[CONST_1.default.IOU.TYPE.PAY] = translate('iou.paySomeone', { name: (0, ReportUtils_1.getPayeeName)(report) }),
        _b[CONST_1.default.IOU.TYPE.SPLIT] = translate('iou.splitExpense'),
        _b[CONST_1.default.IOU.TYPE.SPLIT_EXPENSE] = translate('iou.splitExpense'),
        _b[CONST_1.default.IOU.TYPE.TRACK] = translate('iou.trackDistance'),
        _b[CONST_1.default.IOU.TYPE.INVOICE] = translate('workspace.invoices.sendInvoice'),
        _b[CONST_1.default.IOU.TYPE.CREATE] = translate('iou.trackDistance'),
        _b);
    var isFromGlobalCreate = (0, EmptyObject_1.isEmptyObject)(report === null || report === void 0 ? void 0 : report.reportID);
    var transactionRequestType = (0, react_1.useMemo)(function () {
        var _a;
        if (!(transaction === null || transaction === void 0 ? void 0 : transaction.iouRequestType)) {
            return (_a = lastDistanceExpenseType !== null && lastDistanceExpenseType !== void 0 ? lastDistanceExpenseType : selectedTab) !== null && _a !== void 0 ? _a : CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP;
        }
        return transaction.iouRequestType;
    }, [transaction === null || transaction === void 0 ? void 0 : transaction.iouRequestType, selectedTab, lastDistanceExpenseType]);
    var prevTransactionReportID = (0, usePrevious_1.default)(transaction === null || transaction === void 0 ? void 0 : transaction.reportID);
    (0, react_1.useEffect)(function () {
        Performance_1.default.markEnd(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE);
    }, []);
    var navigateBack = function () {
        Navigation_1.default.closeRHPFlow();
    };
    // This useEffect is used to initialize the money request, so that currency will be reset to default currency on page reload.
    (0, react_1.useEffect)(function () {
        if ((transaction === null || transaction === void 0 ? void 0 : transaction.amount) !== 0) {
            return;
        }
        (0, IOU_1.initMoneyRequest)({
            reportID: reportID,
            policy: policy,
            isFromGlobalCreate: isFromGlobalCreate,
            currentIouRequestType: transaction === null || transaction === void 0 ? void 0 : transaction.iouRequestType,
            newIouRequestType: transaction === null || transaction === void 0 ? void 0 : transaction.iouRequestType,
            report: report,
            parentReport: parentReport,
            currentDate: currentDate,
            lastSelectedDistanceRates: lastSelectedDistanceRates,
        });
        // eslint-disable-next-line
    }, []);
    var resetIOUTypeIfChanged = (0, react_1.useCallback)(function (newIOUType) {
        react_native_1.Keyboard.dismiss();
        if ((transaction === null || transaction === void 0 ? void 0 : transaction.iouRequestType) === newIOUType) {
            return;
        }
        (0, IOU_1.initMoneyRequest)({
            reportID: reportID,
            policy: policy,
            isFromGlobalCreate: isFromGlobalCreate,
            currentIouRequestType: transaction === null || transaction === void 0 ? void 0 : transaction.iouRequestType,
            newIouRequestType: newIOUType,
            report: report,
            parentReport: parentReport,
            currentDate: currentDate,
            lastSelectedDistanceRates: lastSelectedDistanceRates,
        });
    }, [transaction === null || transaction === void 0 ? void 0 : transaction.iouRequestType, reportID, policy, isFromGlobalCreate, report, parentReport, currentDate, lastSelectedDistanceRates]);
    // Clear out the temporary expense if the reportID in the URL has changed from the transaction's reportID.
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        // The test transaction can change the reportID of the transaction on the flow so we should prevent the reportID from being reverted again.
        if ((transaction === null || transaction === void 0 ? void 0 : transaction.reportID) === reportID || isLoadingSelectedTab || !transactionRequestType || prevTransactionReportID !== (transaction === null || transaction === void 0 ? void 0 : transaction.reportID)) {
            return;
        }
        resetIOUTypeIfChanged(transactionRequestType);
    }, [transaction === null || transaction === void 0 ? void 0 : transaction.reportID, reportID, resetIOUTypeIfChanged, transactionRequestType, isLoadingSelectedTab, prevTransactionReportID]));
    var _f = (0, react_1.useState)(null), headerWithBackBtnContainerElement = _f[0], setHeaderWithBackButtonContainerElement = _f[1];
    var _g = (0, react_1.useState)(null), tabBarContainerElement = _g[0], setTabBarContainerElement = _g[1];
    var _h = (0, react_1.useState)(null), activeTabContainerElement = _h[0], setActiveTabContainerElement = _h[1];
    var focusTrapContainerElements = (0, react_1.useMemo)(function () {
        return [headerWithBackBtnContainerElement, tabBarContainerElement, activeTabContainerElement].filter(function (element) { return !!element; });
    }, [headerWithBackBtnContainerElement, tabBarContainerElement, activeTabContainerElement]);
    return (<AccessOrNotFoundWrapper_1.default reportID={reportID} iouType={iouType} policyID={policy === null || policy === void 0 ? void 0 : policy.id} accessVariants={[CONST_1.default.IOU.ACCESS_VARIANTS.CREATE]} allPolicies={allPolicies}>
            <ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DistanceRequestStartPage.displayName} focusTrapSettings={{ containerElements: focusTrapContainerElements }}>
                <react_native_1.View style={styles.flex1}>
                    <FocusTrapContainerElement_1.default onContainerElementChanged={setHeaderWithBackButtonContainerElement} style={[styles.w100]}>
                        <HeaderWithBackButton_1.default title={tabTitles[iouType]} onBackButtonPress={navigateBack}/>
                    </FocusTrapContainerElement_1.default>
                    <OnyxTabNavigator_1.default id={CONST_1.default.TAB.DISTANCE_REQUEST_TYPE} defaultSelectedTab={defaultSelectedTab} onTabSelected={resetIOUTypeIfChanged} tabBar={TabSelector_1.default} onTabBarFocusTrapContainerElementChanged={setTabBarContainerElement} onActiveTabFocusTrapContainerElementChanged={setActiveTabContainerElement} lazyLoadEnabled>
                        <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.DISTANCE_MAP}>
                            {function () { return (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                    <IOURequestStepDistanceMap_1.default route={route} navigation={navigation}/>
                                </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>); }}
                        </OnyxTabNavigator_1.TopTab.Screen>
                        <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.DISTANCE_MANUAL}>
                            {function () { return (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                    <IOURequestStepDistanceManual_1.default route={route} navigation={navigation}/>
                                </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>); }}
                        </OnyxTabNavigator_1.TopTab.Screen>
                    </OnyxTabNavigator_1.default>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
DistanceRequestStartPage.displayName = 'DistanceRequestStartPage';
exports.default = DistanceRequestStartPage;
