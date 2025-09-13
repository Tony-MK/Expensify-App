"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const ImageSVG_1 = require("@components/ImageSVG");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceUserRestrictedAction({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const styles = (0, useThemeStyles_1.default)();
    const openPolicyExpenseReport = (0, react_1.useCallback)(() => {
        const reportID = ReportUtils.findPolicyExpenseChatByPolicyID(policyID)?.reportID ?? '-1';
        Navigation_1.default.closeRHPFlow();
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
    }, [policyID]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={WorkspaceUserRestrictedAction.displayName}>
            <HeaderWithBackButton_1.default title={translate('workspace.restrictedAction.restricted')} onBackButtonPress={Navigation_1.default.goBack}/>
            <ScrollView_1.default style={[styles.p5, styles.pt0]} contentContainerStyle={styles.flexGrow1}>
                <react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter, styles.mb15]}>
                    <ImageSVG_1.default src={Illustrations.LockClosedOrange} width={variables_1.default.restrictedActionIllustrationHeight} height={variables_1.default.restrictedActionIllustrationHeight}/>
                    <Text_1.default style={[styles.textHeadlineH1, styles.textAlignCenter]}>
                        {translate('workspace.restrictedAction.actionsAreCurrentlyRestricted', { workspaceName: policy?.name ?? '' })}
                    </Text_1.default>
                    <Text_1.default style={[styles.textLabelSupportingEmptyValue, styles.textAlignCenter, styles.lh20, styles.mt2]}>
                        {translate('workspace.restrictedAction.pleaseReachOutToYourWorkspaceAdmin')}
                    </Text_1.default>
                </react_native_1.View>
                <Button_1.default text={translate('workspace.restrictedAction.chatWithYourAdmin')} onPress={openPolicyExpenseReport} success large/>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
WorkspaceUserRestrictedAction.displayName = 'WorkspaceUserRestrictedAction';
exports.default = WorkspaceUserRestrictedAction;
