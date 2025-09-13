"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Report_1 = require("@libs/actions/Report");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ExportWithDropdownMenu({ report, reportActions, connectionName, dropdownAnchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
}, wrapperStyle, }) {
    const reportID = report?.reportID;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [modalStatus, setModalStatus] = (0, react_1.useState)(null);
    const [exportMethods] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LAST_EXPORT_METHOD, { canBeMissing: true });
    const iconToDisplay = (0, ReportUtils_1.getIntegrationIcon)(connectionName);
    const canBeExported = (0, ReportUtils_1.canBeExported)(report);
    const isExported = (0, ReportUtils_1.isExported)(reportActions);
    const flattenedWrapperStyle = react_native_1.StyleSheet.flatten([styles.flex1, wrapperStyle]);
    const dropdownOptions = (0, react_1.useMemo)(() => {
        const optionTemplate = {
            icon: iconToDisplay,
            disabled: !canBeExported,
            displayInDefaultIconColor: true,
            iconWidth: variables_1.default.iconSizeMenuItem,
            iconHeight: variables_1.default.iconSizeMenuItem,
            additionalIconStyles: styles.integrationIcon,
        };
        const options = [
            {
                value: CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION,
                text: translate('workspace.common.exportIntegrationSelected', { connectionName }),
                ...optionTemplate,
            },
            {
                value: CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED,
                text: translate('workspace.common.markAsEntered'),
                ...optionTemplate,
            },
        ];
        const exportMethod = report?.policyID ? exportMethods?.[report.policyID] : null;
        if (exportMethod) {
            options.sort((method) => (method.value === exportMethod ? -1 : 0));
        }
        return options;
        // We do not include exportMethods not to re-render the component when the preferred export method changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [canBeExported, iconToDisplay, connectionName, report?.policyID, translate]);
    const confirmExport = (0, react_1.useCallback)(() => {
        setModalStatus(null);
        if (!reportID) {
            return;
        }
        if (modalStatus === CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION) {
            (0, Report_1.exportToIntegration)(reportID, connectionName);
        }
        else if (modalStatus === CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED) {
            (0, Report_1.markAsManuallyExported)(reportID, connectionName);
        }
    }, [connectionName, modalStatus, reportID]);
    const savePreferredExportMethod = (value) => {
        if (!report?.policyID) {
            return;
        }
        (0, Policy_1.savePreferredExportMethod)(report?.policyID, value);
    };
    return (<>
            <ButtonWithDropdownMenu_1.default success pressOnEnter shouldAlwaysShowDropdownMenu anchorAlignment={dropdownAnchorAlignment} onPress={(_, value) => {
            if (isExported) {
                setModalStatus(value);
                return;
            }
            if (!reportID) {
                return;
            }
            if (value === CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION) {
                (0, Report_1.exportToIntegration)(reportID, connectionName);
            }
            else if (value === CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED) {
                (0, Report_1.markAsManuallyExported)(reportID, connectionName);
            }
        }} onOptionSelected={({ value }) => savePreferredExportMethod(value)} options={dropdownOptions} style={[shouldUseNarrowLayout && styles.flexGrow1]} wrapperStyle={flattenedWrapperStyle} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM}/>
            <ConfirmModal_1.default title={translate('workspace.exportAgainModal.title')} onConfirm={confirmExport} onCancel={() => setModalStatus(null)} prompt={translate('workspace.exportAgainModal.description', { connectionName, reportName: report?.reportName ?? '' })} confirmText={translate('workspace.exportAgainModal.confirmText')} cancelText={translate('workspace.exportAgainModal.cancelText')} isVisible={!!modalStatus}/>
        </>);
}
exports.default = ExportWithDropdownMenu;
