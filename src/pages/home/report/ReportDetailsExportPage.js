"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ReportDetailsExportPage({ route }) {
    const connectionName = route?.params?.connectionName;
    const reportID = route.params.reportID;
    const backTo = route.params.backTo;
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`);
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`);
    const policyID = report?.policyID;
    const { translate } = (0, useLocalize_1.default)();
    const [modalStatus, setModalStatus] = (0, react_1.useState)(null);
    const styles = (0, useThemeStyles_1.default)();
    const iconToDisplay = (0, ReportUtils_1.getIntegrationIcon)(connectionName);
    const canBeExported = (0, ReportUtils_1.canBeExported)(report);
    const isExported = (0, ReportUtils_1.isExported)(reportActions);
    const confirmExport = (0, react_1.useCallback)((type = modalStatus) => {
        if (type === CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION) {
            (0, Report_1.exportToIntegration)(reportID, connectionName);
        }
        else if (type === CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED) {
            (0, Report_1.markAsManuallyExported)(reportID, connectionName);
        }
        setModalStatus(null);
        Navigation_1.default.dismissModal();
    }, [connectionName, modalStatus, reportID]);
    const exportSelectorOptions = [
        {
            value: CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION,
            text: translate('workspace.common.exportIntegrationSelected', { connectionName }),
            icons: [
                {
                    source: iconToDisplay ?? '',
                    type: CONST_1.default.ICON_TYPE_AVATAR,
                },
            ],
            isDisabled: !canBeExported,
        },
        {
            value: CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED,
            text: translate('workspace.common.markAsEntered'),
            icons: [
                {
                    source: iconToDisplay ?? '',
                    type: CONST_1.default.ICON_TYPE_AVATAR,
                },
            ],
            isDisabled: !canBeExported,
        },
    ];
    if (!canBeExported) {
        return (<ScreenWrapper_1.default testID={ReportDetailsExportPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('common.export')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID, backTo))}/>
                <ConfirmationPage_1.default illustration={Illustrations.LaptopWithSecondScreenAndHourglass} heading={translate('workspace.export.notReadyHeading')} description={translate('workspace.export.notReadyDescription')} shouldShowButton buttonText={translate('common.buttonConfirm')} onButtonPress={() => Navigation_1.default.goBack()} illustrationStyle={{ width: 233, height: 162 }} containerStyle={styles.flex1}/>
            </ScreenWrapper_1.default>);
    }
    return (<>
            <SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={ReportDetailsExportPage.displayName} sections={[{ data: exportSelectorOptions }]} listItem={UserListItem_1.default} shouldBeBlocked={false} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(reportID, backTo))} title="common.export" connectionName={connectionName} onSelectRow={({ value }) => {
            if (isExported) {
                setModalStatus(value);
            }
            else {
                confirmExport(value);
            }
        }}/>
            <ConfirmModal_1.default title={translate('workspace.exportAgainModal.title')} onConfirm={confirmExport} onCancel={() => setModalStatus(null)} prompt={translate('workspace.exportAgainModal.description', { reportName: report?.reportName ?? '', connectionName })} confirmText={translate('workspace.exportAgainModal.confirmText')} cancelText={translate('workspace.exportAgainModal.cancelText')} isVisible={!!modalStatus}/>
        </>);
}
ReportDetailsExportPage.displayName = 'ReportDetailsExportPage';
exports.default = ReportDetailsExportPage;
