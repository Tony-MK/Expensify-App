"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const withReportOrNotFound_1 = require("@pages/home/report/withReportOrNotFound");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function WriteCapabilityPage({ report, policy }) {
    const route = (0, native_1.useRoute)();
    const { translate } = (0, useLocalize_1.default)();
    const writeCapabilityOptions = Object.values(CONST_1.default.REPORT.WRITE_CAPABILITIES).map((value) => ({
        value,
        text: translate(`writeCapabilityPage.writeCapability.${value}`),
        keyForList: value,
        isSelected: value === (report?.writeCapability ?? CONST_1.default.REPORT.WRITE_CAPABILITIES.ALL),
    }));
    const isReportArchived = (0, useReportIsArchived_1.default)(report.reportID);
    const isAbleToEdit = (0, ReportUtils_1.canEditWriteCapability)(report, policy, isReportArchived);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(ROUTES_1.default.REPORT_SETTINGS.getRoute(report.reportID, route.params.backTo));
    }, [report.reportID, route.params.backTo]);
    const updateWriteCapability = (0, react_1.useCallback)((newValue) => {
        (0, Report_1.updateWriteCapability)(report, newValue);
        goBack();
    }, [report, goBack]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={WriteCapabilityPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!isAbleToEdit}>
                <HeaderWithBackButton_1.default title={translate('writeCapabilityPage.label')} shouldShowBackButton onBackButtonPress={goBack}/>
                <SelectionList_1.default sections={[{ data: writeCapabilityOptions }]} ListItem={RadioListItem_1.default} onSelectRow={(option) => updateWriteCapability(option.value)} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={writeCapabilityOptions.find((locale) => locale.isSelected)?.keyForList}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
WriteCapabilityPage.displayName = 'WriteCapabilityPage';
exports.default = (0, withReportOrNotFound_1.default)()(WriteCapabilityPage);
