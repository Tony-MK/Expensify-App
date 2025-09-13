"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FocusTrapContainerElement_1 = require("@components/FocusTrap/FocusTrapContainerElement");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TabSelector_1 = require("@components/TabSelector/TabSelector");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
const Performance_1 = require("@libs/Performance");
const ReportUtils_1 = require("@libs/ReportUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const IOURequestStepDistanceManual_1 = require("./step/IOURequestStepDistanceManual");
const IOURequestStepDistanceMap_1 = require("./step/IOURequestStepDistanceMap");
function DistanceRequestStartPage({ route, route: { params: { iouType, reportID }, }, navigation, 
// This is currently only being used for testing
defaultSelectedTab = CONST_1.default.TAB_REQUEST.DISTANCE_MAP, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [selectedTab, selectedTabResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SELECTED_TAB}${CONST_1.default.TAB.DISTANCE_REQUEST_TYPE}`, { canBeMissing: true });
    const [lastDistanceExpenseType] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_DISTANCE_EXPENSE_TYPE, { canBeMissing: true });
    const isLoadingSelectedTab = (0, isLoadingOnyxValue_1.default)(selectedTabResult);
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${(0, getNonEmptyStringOnyxID_1.default)(route?.params.transactionID)}`, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [lastSelectedDistanceRates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true });
    const [currentDate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true });
    const tabTitles = {
        [CONST_1.default.IOU.TYPE.REQUEST]: translate('iou.trackDistance'),
        [CONST_1.default.IOU.TYPE.SUBMIT]: translate('iou.trackDistance'),
        [CONST_1.default.IOU.TYPE.SEND]: translate('iou.paySomeone', { name: (0, ReportUtils_1.getPayeeName)(report) }),
        [CONST_1.default.IOU.TYPE.PAY]: translate('iou.paySomeone', { name: (0, ReportUtils_1.getPayeeName)(report) }),
        [CONST_1.default.IOU.TYPE.SPLIT]: translate('iou.splitExpense'),
        [CONST_1.default.IOU.TYPE.SPLIT_EXPENSE]: translate('iou.splitExpense'),
        [CONST_1.default.IOU.TYPE.TRACK]: translate('iou.trackDistance'),
        [CONST_1.default.IOU.TYPE.INVOICE]: translate('workspace.invoices.sendInvoice'),
        [CONST_1.default.IOU.TYPE.CREATE]: translate('iou.trackDistance'),
    };
    const isFromGlobalCreate = (0, EmptyObject_1.isEmptyObject)(report?.reportID);
    const transactionRequestType = (0, react_1.useMemo)(() => {
        if (!transaction?.iouRequestType) {
            return lastDistanceExpenseType ?? selectedTab ?? CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP;
        }
        return transaction.iouRequestType;
    }, [transaction?.iouRequestType, selectedTab, lastDistanceExpenseType]);
    const prevTransactionReportID = (0, usePrevious_1.default)(transaction?.reportID);
    (0, react_1.useEffect)(() => {
        Performance_1.default.markEnd(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE);
    }, []);
    const navigateBack = () => {
        Navigation_1.default.closeRHPFlow();
    };
    // This useEffect is used to initialize the money request, so that currency will be reset to default currency on page reload.
    (0, react_1.useEffect)(() => {
        if (transaction?.amount !== 0) {
            return;
        }
        (0, IOU_1.initMoneyRequest)({
            reportID,
            policy,
            isFromGlobalCreate,
            currentIouRequestType: transaction?.iouRequestType,
            newIouRequestType: transaction?.iouRequestType,
            report,
            parentReport,
            currentDate,
            lastSelectedDistanceRates,
        });
        // eslint-disable-next-line
    }, []);
    const resetIOUTypeIfChanged = (0, react_1.useCallback)((newIOUType) => {
        react_native_1.Keyboard.dismiss();
        if (transaction?.iouRequestType === newIOUType) {
            return;
        }
        (0, IOU_1.initMoneyRequest)({
            reportID,
            policy,
            isFromGlobalCreate,
            currentIouRequestType: transaction?.iouRequestType,
            newIouRequestType: newIOUType,
            report,
            parentReport,
            currentDate,
            lastSelectedDistanceRates,
        });
    }, [transaction?.iouRequestType, reportID, policy, isFromGlobalCreate, report, parentReport, currentDate, lastSelectedDistanceRates]);
    // Clear out the temporary expense if the reportID in the URL has changed from the transaction's reportID.
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        // The test transaction can change the reportID of the transaction on the flow so we should prevent the reportID from being reverted again.
        if (transaction?.reportID === reportID || isLoadingSelectedTab || !transactionRequestType || prevTransactionReportID !== transaction?.reportID) {
            return;
        }
        resetIOUTypeIfChanged(transactionRequestType);
    }, [transaction?.reportID, reportID, resetIOUTypeIfChanged, transactionRequestType, isLoadingSelectedTab, prevTransactionReportID]));
    const [headerWithBackBtnContainerElement, setHeaderWithBackButtonContainerElement] = (0, react_1.useState)(null);
    const [tabBarContainerElement, setTabBarContainerElement] = (0, react_1.useState)(null);
    const [activeTabContainerElement, setActiveTabContainerElement] = (0, react_1.useState)(null);
    const focusTrapContainerElements = (0, react_1.useMemo)(() => {
        return [headerWithBackBtnContainerElement, tabBarContainerElement, activeTabContainerElement].filter((element) => !!element);
    }, [headerWithBackBtnContainerElement, tabBarContainerElement, activeTabContainerElement]);
    return (<AccessOrNotFoundWrapper_1.default reportID={reportID} iouType={iouType} policyID={policy?.id} accessVariants={[CONST_1.default.IOU.ACCESS_VARIANTS.CREATE]} allPolicies={allPolicies}>
            <ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DistanceRequestStartPage.displayName} focusTrapSettings={{ containerElements: focusTrapContainerElements }}>
                <react_native_1.View style={styles.flex1}>
                    <FocusTrapContainerElement_1.default onContainerElementChanged={setHeaderWithBackButtonContainerElement} style={[styles.w100]}>
                        <HeaderWithBackButton_1.default title={tabTitles[iouType]} onBackButtonPress={navigateBack}/>
                    </FocusTrapContainerElement_1.default>
                    <OnyxTabNavigator_1.default id={CONST_1.default.TAB.DISTANCE_REQUEST_TYPE} defaultSelectedTab={defaultSelectedTab} onTabSelected={resetIOUTypeIfChanged} tabBar={TabSelector_1.default} onTabBarFocusTrapContainerElementChanged={setTabBarContainerElement} onActiveTabFocusTrapContainerElementChanged={setActiveTabContainerElement} lazyLoadEnabled>
                        <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.DISTANCE_MAP}>
                            {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                    <IOURequestStepDistanceMap_1.default route={route} navigation={navigation}/>
                                </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                        </OnyxTabNavigator_1.TopTab.Screen>
                        <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.DISTANCE_MANUAL}>
                            {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                    <IOURequestStepDistanceManual_1.default route={route} navigation={navigation}/>
                                </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                        </OnyxTabNavigator_1.TopTab.Screen>
                    </OnyxTabNavigator_1.default>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
DistanceRequestStartPage.displayName = 'DistanceRequestStartPage';
exports.default = DistanceRequestStartPage;
