"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const DebugUtils_1 = require("@libs/DebugUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const DebugTabNavigator_1 = require("@libs/Navigation/DebugTabNavigator");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const DebugDetails_1 = require("@pages/Debug/DebugDetails");
const DebugJSON_1 = require("@pages/Debug/DebugJSON");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const Debug_1 = require("@userActions/Debug");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const DebugReportActions_1 = require("./DebugReportActions");
function DebugReportPage({ route: { params: { reportID }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const theme = (0, useTheme_1.default)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`, { canBeMissing: true });
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, { canBeMissing: true });
    const [transactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: true });
    const [transactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, {
        selector: (attributes) => attributes?.reports?.[reportID],
        canBeMissing: true,
    });
    const [priorityMode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { canBeMissing: true });
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const transactionID = DebugUtils_1.default.getTransactionID(report, reportActions);
    const isReportArchived = (0, useReportIsArchived_1.default)(reportID);
    const metadata = (0, react_1.useMemo)(() => {
        if (!report) {
            return [];
        }
        const shouldDisplayViolations = (0, ReportUtils_1.shouldDisplayViolationsRBRInLHN)(report, transactionViolations);
        const shouldDisplayReportViolations = (0, ReportUtils_1.isReportOwner)(report) && (0, ReportUtils_1.hasReportViolations)(reportID);
        const hasViolations = !!shouldDisplayViolations || shouldDisplayReportViolations;
        const { reason: reasonGBR, reportAction: reportActionGBR } = DebugUtils_1.default.getReasonAndReportActionForGBRInLHNRow(report, isReportArchived) ?? {};
        const { reason: reasonRBR, reportAction: reportActionRBR } = DebugUtils_1.default.getReasonAndReportActionForRBRInLHNRow(report, chatReport, reportActions, transactions, transactionViolations, hasViolations, reportAttributes?.reportErrors ?? {}, isReportArchived) ?? {};
        const hasRBR = !!reasonRBR;
        const hasGBR = !hasRBR && !!reasonGBR;
        const reasonLHN = DebugUtils_1.default.getReasonForShowingRowInLHN({
            report,
            chatReport,
            betas,
            doesReportHaveViolations: shouldDisplayViolations,
            hasRBR,
            isReportArchived,
            isInFocusMode: priorityMode === CONST_1.default.PRIORITY_MODE.GSD,
        });
        return [
            {
                title: translate('debug.visibleInLHN'),
                subtitle: translate(`debug.${!!reasonLHN}`),
                message: reasonLHN ? translate(reasonLHN) : undefined,
            },
            {
                title: translate('debug.GBR'),
                subtitle: translate(`debug.${hasGBR}`),
                message: hasGBR ? translate(reasonGBR) : undefined,
                action: hasGBR && reportActionGBR
                    ? {
                        name: translate('common.view'),
                        callback: () => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportActionGBR.childReportID ?? reportActionGBR.parentReportID ?? report.reportID, reportActionGBR.childReportID ? undefined : reportActionGBR.reportActionID)),
                    }
                    : undefined,
            },
            {
                title: translate('debug.RBR'),
                subtitle: translate(`debug.${hasRBR}`),
                message: hasRBR ? translate(reasonRBR) : undefined,
                action: hasRBR && reportActionRBR
                    ? {
                        name: translate('common.view'),
                        callback: () => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportActionRBR.childReportID ?? reportActionRBR.parentReportID ?? report.reportID, reportActionRBR.childReportID ? undefined : reportActionRBR.reportActionID)),
                    }
                    : undefined,
            },
        ];
    }, [report, transactionViolations, reportID, isReportArchived, chatReport, reportActions, transactions, reportAttributes?.reportErrors, betas, priorityMode, translate]);
    const DebugDetailsTab = (0, react_1.useCallback)(() => (<DebugDetails_1.default formType={CONST_1.default.DEBUG.FORMS.REPORT} data={report} onSave={(data) => {
            Debug_1.default.setDebugData(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, data);
        }} onDelete={() => {
            (0, Report_1.navigateToConciergeChatAndDeleteReport)(reportID, true, true);
        }} validate={DebugUtils_1.default.validateReportDraftProperty}>
                <react_native_1.View style={[styles.mb5, styles.ph5, styles.gap5]}>
                    {metadata?.map(({ title, subtitle, message, action }) => (<react_native_1.View key={title} style={[StyleUtils.getBackgroundColorStyle(theme.cardBG), styles.p5, styles.br4, styles.flexColumn, styles.gap2]}>
                            <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween]}>
                                <Text_1.default style={styles.h4}>{title}</Text_1.default>
                                <Text_1.default>{subtitle}</Text_1.default>
                            </react_native_1.View>
                            {!!message && <Text_1.default style={styles.textSupporting}>{message}</Text_1.default>}
                            {!!action && (<Button_1.default text={action.name} onPress={action.callback}/>)}
                        </react_native_1.View>))}
                    <Button_1.default text={translate('debug.viewReport')} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
        }} icon={Expensicons.Eye}/>
                    {!!transactionID && (<Button_1.default text={translate('debug.viewTransaction')} onPress={() => {
                Navigation_1.default.navigate(ROUTES_1.default.DEBUG_TRANSACTION.getRoute(transactionID));
            }}/>)}
                </react_native_1.View>
            </DebugDetails_1.default>), [
        StyleUtils,
        metadata,
        report,
        reportID,
        styles.br4,
        styles.flexColumn,
        styles.flexRow,
        styles.gap2,
        styles.gap5,
        styles.h4,
        styles.justifyContentBetween,
        styles.mb5,
        styles.p5,
        styles.ph5,
        styles.textSupporting,
        theme.cardBG,
        transactionID,
        translate,
    ]);
    const DebugJSONTab = (0, react_1.useCallback)(() => <DebugJSON_1.default data={report ?? {}}/>, [report]);
    const DebugReportActionsTab = (0, react_1.useCallback)(() => <DebugReportActions_1.default reportID={reportID}/>, [reportID]);
    const routes = (0, react_1.useMemo)(() => [
        {
            name: CONST_1.default.DEBUG.DETAILS,
            component: DebugDetailsTab,
        },
        {
            name: CONST_1.default.DEBUG.JSON,
            component: DebugJSONTab,
        },
        {
            name: CONST_1.default.DEBUG.REPORT_ACTIONS,
            component: DebugReportActionsTab,
        },
    ], [DebugDetailsTab, DebugJSONTab, DebugReportActionsTab]);
    if (!report) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DebugReportPage.displayName}>
            {({ safeAreaPaddingBottomStyle }) => (<react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                    <HeaderWithBackButton_1.default title={`${translate('debug.debug')} - ${translate('debug.report')}`} onBackButtonPress={Navigation_1.default.goBack}/>
                    <DebugTabNavigator_1.default id={CONST_1.default.DEBUG.FORMS.REPORT} routes={routes}/>
                </react_native_1.View>)}
        </ScreenWrapper_1.default>);
}
DebugReportPage.displayName = 'DebugReportPage';
exports.default = DebugReportPage;
