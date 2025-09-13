"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const MenuItem_1 = require("./MenuItem");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const Text_1 = require("./Text");
function ApprovalWorkflowSection({ approvalWorkflow, onPress }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate, toLocaleOrdinal, localeCompare } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const approverTitle = (0, react_1.useCallback)((index) => approvalWorkflow.approvers.length > 1 ? `${toLocaleOrdinal(index + 1, true)} ${translate('workflowsPage.approver').toLowerCase()}` : `${translate('workflowsPage.approver')}`, [approvalWorkflow.approvers.length, toLocaleOrdinal, translate]);
    const members = (0, react_1.useMemo)(() => {
        if (approvalWorkflow.isDefault) {
            return translate('workspace.common.everyone');
        }
        return (0, OptionsListUtils_1.sortAlphabetically)(approvalWorkflow.members, 'displayName', localeCompare)
            .map((m) => expensify_common_1.Str.removeSMSDomain(m.displayName))
            .join(', ');
    }, [approvalWorkflow.isDefault, approvalWorkflow.members, translate, localeCompare]);
    return (<PressableWithoutFeedback_1.default accessibilityRole="button" style={[styles.border, shouldUseNarrowLayout ? styles.p3 : styles.p4, styles.flexRow, styles.justifyContentBetween, styles.mt6, styles.mbn3]} onPress={onPress} accessibilityLabel={translate('workflowsPage.addApprovalsTitle')}>
            <react_native_1.View style={[styles.flex1]}>
                {approvalWorkflow.isDefault && (<react_native_1.View style={[styles.flexRow, styles.mb4, styles.alignItemsCenter, styles.pb1, styles.pt1]}>
                        <Icon_1.default src={Expensicons.Lightbulb} fill={theme.icon} additionalStyles={styles.mr2} small/>
                        <Text_1.default style={[styles.textLabelSupportingNormal]} suppressHighlighting>
                            {translate('workflowsPage.addApprovalTip')}
                        </Text_1.default>
                    </react_native_1.View>)}
                <MenuItem_1.default title={translate('workflowsExpensesFromPage.title')} style={styles.p0} titleStyle={styles.textLabelSupportingNormal} descriptionTextStyle={[styles.textNormalThemeText, styles.lineHeightXLarge]} description={members} numberOfLinesDescription={4} icon={Expensicons.Users} iconHeight={20} iconWidth={20} iconFill={theme.icon} onPress={onPress} shouldRemoveBackground/>

                {approvalWorkflow.approvers.map((approver, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <react_native_1.View key={`approver-${approver.email}-${index}`}>
                        <react_native_1.View style={styles.workflowApprovalVerticalLine}/>
                        <MenuItem_1.default title={approverTitle(index)} style={styles.p0} titleStyle={styles.textLabelSupportingNormal} descriptionTextStyle={[styles.textNormalThemeText, styles.lineHeightXLarge]} description={expensify_common_1.Str.removeSMSDomain(approver.displayName)} icon={Expensicons.UserCheck} iconHeight={20} iconWidth={20} numberOfLinesDescription={1} iconFill={theme.icon} onPress={onPress} shouldRemoveBackground/>
                    </react_native_1.View>))}
            </react_native_1.View>
            <Icon_1.default src={Expensicons.ArrowRight} fill={theme.icon} additionalStyles={[styles.alignSelfCenter]}/>
        </PressableWithoutFeedback_1.default>);
}
exports.default = ApprovalWorkflowSection;
