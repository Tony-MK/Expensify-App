"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report = require("@libs/actions/Report");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const NotFoundPage_1 = require("./ErrorPage/NotFoundPage");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function ReportParticipantRoleSelectionPage({ report, route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const accountID = Number(route?.params?.accountID) ?? -1;
    const backTo = ROUTES_1.default.REPORT_PARTICIPANTS_DETAILS.getRoute(report?.reportID ?? '-1', accountID, route.params.backTo);
    const member = report.participants?.[accountID];
    if (!member) {
        return <NotFoundPage_1.default />;
    }
    const items = [
        {
            value: CONST_1.default.REPORT.ROLE.ADMIN,
            text: translate('common.admin'),
            isSelected: member?.role === CONST_1.default.REPORT.ROLE.ADMIN,
            keyForList: CONST_1.default.REPORT.ROLE.ADMIN,
        },
        {
            value: CONST_1.default.REPORT.ROLE.MEMBER,
            text: translate('common.member'),
            isSelected: member?.role === CONST_1.default.REPORT.ROLE.MEMBER,
            keyForList: CONST_1.default.REPORT.ROLE.MEMBER,
        },
    ];
    const changeRole = ({ value }) => {
        Report.updateGroupChatMemberRoles(report.reportID, [accountID], value);
        Navigation_1.default.goBack(backTo);
    };
    return (<ScreenWrapper_1.default testID={ReportParticipantRoleSelectionPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('common.role')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone]}>
                <SelectionList_1.default sections={[{ data: items }]} ListItem={RadioListItem_1.default} onSelectRow={changeRole} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={items.find((item) => item.isSelected)?.keyForList}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ReportParticipantRoleSelectionPage.displayName = 'ReportParticipantRoleSelectionPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportParticipantRoleSelectionPage);
