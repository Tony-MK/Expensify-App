"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Provider_1 = require("@components/DragAndDrop/Provider");
const FocusTrapContainerElement_1 = require("@components/FocusTrap/FocusTrapContainerElement");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ProductTrainingContext_1 = require("@components/ProductTrainingContext");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TabSelector_1 = require("@components/TabSelector/TabSelector");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePolicy_1 = require("@hooks/usePolicy");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Welcome_1 = require("@libs/actions/Welcome");
const Browser_1 = require("@libs/Browser");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OnyxTabNavigator_1 = require("@libs/Navigation/OnyxTabNavigator");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Performance_1 = require("@libs/Performance");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const IOURequestStepAmount_1 = require("./step/IOURequestStepAmount");
const IOURequestStepDestination_1 = require("./step/IOURequestStepDestination");
const IOURequestStepDistance_1 = require("./step/IOURequestStepDistance");
const IOURequestStepPerDiemWorkspace_1 = require("./step/IOURequestStepPerDiemWorkspace");
const IOURequestStepScan_1 = require("./step/IOURequestStepScan");
function IOURequestStartPage({ route, route: { params: { iouType, reportID }, }, navigation, 
// This is currently only being used for testing
defaultSelectedTab = CONST_1.default.TAB_REQUEST.SCAN, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const shouldUseTab = iouType !== CONST_1.default.IOU.TYPE.SEND && iouType !== CONST_1.default.IOU.TYPE.PAY && iouType !== CONST_1.default.IOU.TYPE.INVOICE;
    const [isDraggingOver, setIsDraggingOver] = (0, react_1.useState)(false);
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [selectedTab, selectedTabResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SELECTED_TAB}${CONST_1.default.TAB.IOU_REQUEST_TYPE}`, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const isLoadingSelectedTab = shouldUseTab ? (0, isLoadingOnyxValue_1.default)(selectedTabResult) : false;
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${(0, getNonEmptyStringOnyxID_1.default)(route?.params.transactionID)}`, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [lastSelectedDistanceRates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true });
    const [optimisticTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: (items) => Object.values(items ?? {}),
        canBeMissing: true,
    });
    const [isMultiScanEnabled, setIsMultiScanEnabled] = (0, react_1.useState)((optimisticTransactions ?? []).length > 1);
    const [currentDate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true });
    const tabTitles = {
        [CONST_1.default.IOU.TYPE.REQUEST]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SUBMIT]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SEND]: translate('iou.paySomeone', { name: (0, ReportUtils_1.getPayeeName)(report) }),
        [CONST_1.default.IOU.TYPE.PAY]: translate('iou.paySomeone', { name: (0, ReportUtils_1.getPayeeName)(report) }),
        [CONST_1.default.IOU.TYPE.SPLIT]: translate('iou.splitExpense'),
        [CONST_1.default.IOU.TYPE.SPLIT_EXPENSE]: translate('iou.splitExpense'),
        [CONST_1.default.IOU.TYPE.TRACK]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.INVOICE]: translate('workspace.invoices.sendInvoice'),
        [CONST_1.default.IOU.TYPE.CREATE]: translate('iou.createExpense'),
    };
    const isFromGlobalCreate = (0, EmptyObject_1.isEmptyObject)(report?.reportID);
    const perDiemCustomUnits = (0, PolicyUtils_1.getPerDiemCustomUnits)(allPolicies, session?.email);
    const doesPerDiemPolicyExist = perDiemCustomUnits.length > 0;
    const moreThanOnePerDiemExist = perDiemCustomUnits.length > 1;
    const currentPolicyPerDiemUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const doesCurrentPolicyPerDiemExist = !(0, EmptyObject_1.isEmptyObject)(currentPolicyPerDiemUnit) && !!currentPolicyPerDiemUnit.enabled;
    const shouldShowPerDiemOption = iouType !== CONST_1.default.IOU.TYPE.SPLIT && iouType !== CONST_1.default.IOU.TYPE.TRACK && ((!isFromGlobalCreate && doesCurrentPolicyPerDiemExist) || (isFromGlobalCreate && doesPerDiemPolicyExist));
    const transactionRequestType = (0, react_1.useMemo)(() => {
        if (!transaction?.iouRequestType) {
            if (shouldUseTab) {
                if (selectedTab === CONST_1.default.TAB_REQUEST.PER_DIEM && !shouldShowPerDiemOption) {
                    return undefined;
                }
                return selectedTab;
            }
            return CONST_1.default.IOU.REQUEST_TYPE.MANUAL;
        }
        return transaction.iouRequestType;
    }, [transaction?.iouRequestType, shouldUseTab, selectedTab, shouldShowPerDiemOption]);
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
        setIsMultiScanEnabled(false);
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
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const manualDistanceTrackingEnabled = isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE);
    const setTestReceiptAndNavigateRef = (0, react_1.useRef)(() => { });
    const { shouldShowProductTrainingTooltip, renderProductTrainingTooltip } = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP, !(0, OptionsListUtils_1.getIsUserSubmittedExpenseOrScannedReceipt)() && isBetaEnabled(CONST_1.default.BETAS.NEWDOT_MANAGER_MCTEST) && selectedTab === CONST_1.default.TAB_REQUEST.SCAN, {
        onConfirm: () => {
            setTestReceiptAndNavigateRef?.current?.();
        },
        onDismiss: () => {
            (0, Welcome_1.dismissProductTraining)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP, true);
        },
    });
    return (<AccessOrNotFoundWrapper_1.default reportID={reportID} iouType={iouType} policyID={policy?.id} accessVariants={[CONST_1.default.IOU.ACCESS_VARIANTS.CREATE]} allPolicies={allPolicies}>
            <ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} shouldEnableMaxHeight={selectedTab === CONST_1.default.TAB_REQUEST.PER_DIEM} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} headerGapStyles={isDraggingOver ? styles.dropWrapper : []} testID={IOURequestStartPage.displayName} focusTrapSettings={{ containerElements: focusTrapContainerElements }}>
                <Provider_1.default setIsDraggingOver={setIsDraggingOver} isDisabled={selectedTab !== CONST_1.default.TAB_REQUEST.SCAN}>
                    <react_native_1.View style={styles.flex1}>
                        <FocusTrapContainerElement_1.default onContainerElementChanged={setHeaderWithBackButtonContainerElement} style={[styles.w100]}>
                            <HeaderWithBackButton_1.default title={tabTitles[iouType]} onBackButtonPress={navigateBack}/>
                        </FocusTrapContainerElement_1.default>

                        {shouldUseTab ? (<OnyxTabNavigator_1.default id={CONST_1.default.TAB.IOU_REQUEST_TYPE} defaultSelectedTab={defaultSelectedTab} onTabSelected={resetIOUTypeIfChanged} tabBar={TabSelector_1.default} onTabBarFocusTrapContainerElementChanged={setTabBarContainerElement} onActiveTabFocusTrapContainerElementChanged={setActiveTabContainerElement} shouldShowLabelWhenInactive={!shouldShowPerDiemOption} shouldShowProductTrainingTooltip={shouldShowProductTrainingTooltip} renderProductTrainingTooltip={renderProductTrainingTooltip} lazyLoadEnabled 
        // We're disabling swipe on mWeb fo the Per Diem tab because the keyboard will hang on the other tab after switching
        disableSwipe={(isMultiScanEnabled && selectedTab === CONST_1.default.TAB_REQUEST.SCAN) || (selectedTab === CONST_1.default.TAB_REQUEST.PER_DIEM && (0, Browser_1.isMobile)())}>
                                <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.MANUAL}>
                                    {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                            <IOURequestStepAmount_1.default shouldKeepUserInput route={route} navigation={navigation}/>
                                        </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                                </OnyxTabNavigator_1.TopTab.Screen>
                                <OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.SCAN}>
                                    {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                            <IOURequestStepScan_1.default route={route} navigation={navigation} onLayout={(setTestReceiptAndNavigate) => {
                    setTestReceiptAndNavigateRef.current = setTestReceiptAndNavigate;
                }} isMultiScanEnabled={isMultiScanEnabled} setIsMultiScanEnabled={setIsMultiScanEnabled}/>
                                        </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                                </OnyxTabNavigator_1.TopTab.Screen>
                                {(!manualDistanceTrackingEnabled || iouType === CONST_1.default.IOU.TYPE.SPLIT) && (<OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.DISTANCE}>
                                        {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                                <IOURequestStepDistance_1.default route={route} navigation={navigation}/>
                                            </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                                    </OnyxTabNavigator_1.TopTab.Screen>)}
                                {!!shouldShowPerDiemOption && (<OnyxTabNavigator_1.TopTab.Screen name={CONST_1.default.TAB_REQUEST.PER_DIEM}>
                                        {() => (<OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>
                                                {moreThanOnePerDiemExist && !doesCurrentPolicyPerDiemExist ? (<IOURequestStepPerDiemWorkspace_1.default route={route} navigation={navigation}/>) : (<IOURequestStepDestination_1.default openedFromStartPage explicitPolicyID={moreThanOnePerDiemExist ? undefined : perDiemCustomUnits.at(0)?.policyID} route={route} navigation={navigation}/>)}
                                            </OnyxTabNavigator_1.TabScreenWithFocusTrapWrapper>)}
                                    </OnyxTabNavigator_1.TopTab.Screen>)}
                            </OnyxTabNavigator_1.default>) : (<FocusTrapContainerElement_1.default onContainerElementChanged={setActiveTabContainerElement} style={[styles.flexColumn, styles.flex1]}>
                                <IOURequestStepAmount_1.default route={route} navigation={navigation} shouldKeepUserInput/>
                            </FocusTrapContainerElement_1.default>)}
                    </react_native_1.View>
                </Provider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
IOURequestStartPage.displayName = 'IOURequestStartPage';
exports.default = IOURequestStartPage;
