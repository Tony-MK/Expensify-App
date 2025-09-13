"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Badge_1 = require("@components/Badge");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useParentReport_1 = require("@hooks/useParentReport");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const Task_1 = require("@libs/actions/Task");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const AvatarWithTextCell_1 = require("./AvatarWithTextCell");
const DateCell_1 = require("./DateCell");
const UserInfoCell_1 = require("./UserInfoCell");
function TitleCell({ taskItem, showTooltip, isLargeScreenWidth }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<TextWithTooltip_1.default text={taskItem.reportName} shouldShowTooltip={showTooltip} style={[isLargeScreenWidth ? styles.lineHeightLarge : styles.lh20, styles.pre, styles.justifyContentCenter]}/>);
}
function DescriptionCell({ taskItem, showTooltip, isLargeScreenWidth }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={taskItem.description} style={[styles.lineHeightLarge, styles.pre, styles.justifyContentCenter, isLargeScreenWidth ? undefined : [styles.textMicro, styles.textSupporting]]}/>);
}
function ActionCell({ taskItem, isLargeScreenWidth }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const { translate } = (0, useLocalize_1.default)();
    const parentReport = (0, useParentReport_1.default)(taskItem?.report?.reportID);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(parentReport?.reportID);
    const isTaskActionable = (0, Task_1.canActionTask)(taskItem.report, session?.accountID, parentReport, isParentReportArchived);
    const isTaskCompleted = taskItem.statusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED && taskItem.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED;
    if (isTaskCompleted) {
        return (<react_native_1.View style={[StyleUtils.getHeight(variables_1.default.h28), styles.justifyContentCenter]}>
                <Badge_1.default success text={translate('task.completed')} icon={Expensicons.Checkmark} iconStyles={styles.mr0} textStyles={StyleUtils.getFontSizeStyle(variables_1.default.fontSizeExtraSmall)} badgeStyles={[
                styles.ml0,
                styles.ph2,
                styles.gap1,
                isLargeScreenWidth ? styles.alignSelfCenter : styles.alignSelfEnd,
                StyleUtils.getHeight(variables_1.default.h20),
                StyleUtils.getMinimumHeight(variables_1.default.h20),
                StyleUtils.getBorderColorStyle(theme.border),
            ]}/>
            </react_native_1.View>);
    }
    return (<Button_1.default small success text={translate('task.action')} style={[styles.w100]} isDisabled={!isTaskActionable} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => {
            (0, Task_1.completeTask)(taskItem, taskItem.reportID);
        })}/>);
}
function TaskListItemRow({ item, containerStyle, showTooltip }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const shouldDisplayCompactArrowIcon = !!(item.parentReportIcon || item.parentReportName);
    if (!isLargeScreenWidth) {
        return (<react_native_1.View style={[containerStyle, styles.gap3]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
                    <react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.gap2, styles.flexRow]}>
                        <react_native_1.View style={[styles.mw50]}>
                            <UserInfoCell_1.default accountID={item.createdBy.accountID} avatar={item.createdBy.avatar} displayName={item.formattedCreatedBy}/>
                        </react_native_1.View>

                        {shouldDisplayCompactArrowIcon && (<Icon_1.default src={Expensicons.ArrowRightLong} width={variables_1.default.iconSizeXXSmall} height={variables_1.default.iconSizeXXSmall} fill={theme.icon}/>)}

                        <react_native_1.View style={[styles.flex1, styles.mw50]}>
                            <AvatarWithTextCell_1.default reportName={item?.parentReportName} icon={item?.parentReportIcon}/>
                        </react_native_1.View>
                    </react_native_1.View>

                    <react_native_1.View style={[StyleUtils.getWidthStyle(variables_1.default.w80)]}>
                        <ActionCell taskItem={item} showTooltip={showTooltip} isLargeScreenWidth={isLargeScreenWidth}/>
                    </react_native_1.View>
                </react_native_1.View>

                <react_native_1.View style={[styles.alignItemsCenter, styles.gap4, styles.flexRow]}>
                    <react_native_1.View style={[styles.gap1, styles.flex1]}>
                        <TitleCell taskItem={item} showTooltip={showTooltip} isLargeScreenWidth={isLargeScreenWidth}/>
                        <DescriptionCell taskItem={item} showTooltip={showTooltip} isLargeScreenWidth={isLargeScreenWidth}/>
                    </react_native_1.View>

                    <react_native_1.View style={[styles.gap2, styles.alignItemsEnd]}>
                        {!!item.assignee.accountID && (<Avatar_1.default imageStyles={[styles.alignSelfCenter]} size={CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT} source={item.assignee.avatar} name={item.formattedAssignee} type={CONST_1.default.ICON_TYPE_AVATAR} avatarID={item.assignee.accountID}/>)}

                        <DateCell_1.default created={item.created} showTooltip={showTooltip} isLargeScreenWidth={isLargeScreenWidth}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>);
    }
    return (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, containerStyle]}>
            <react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
                <react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.DATE, item.shouldShowYear)]}>
                    <DateCell_1.default created={item.created} showTooltip={showTooltip} isLargeScreenWidth/>
                </react_native_1.View>
                <react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TITLE)]}>
                    <TitleCell taskItem={item} showTooltip={showTooltip} isLargeScreenWidth/>
                </react_native_1.View>
                <react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION)]}>
                    <DescriptionCell taskItem={item} showTooltip={showTooltip} isLargeScreenWidth/>
                </react_native_1.View>
                <react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.FROM)]}>
                    <UserInfoCell_1.default accountID={item.createdBy.accountID} avatar={item.createdBy.avatar} displayName={item.formattedCreatedBy}/>
                </react_native_1.View>
                <react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.IN)]}>
                    <AvatarWithTextCell_1.default reportName={item?.parentReportName} icon={item?.parentReportIcon}/>
                </react_native_1.View>
                <react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.ASSIGNEE)]}>
                    <UserInfoCell_1.default accountID={item.assignee.accountID} avatar={item.assignee.avatar} displayName={item.formattedAssignee}/>
                </react_native_1.View>
                <react_native_1.View style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION)]}>
                    <ActionCell taskItem={item} showTooltip={showTooltip} isLargeScreenWidth/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
TaskListItemRow.displayName = 'TaskListItemRow';
exports.default = TaskListItemRow;
