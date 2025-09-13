"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var WorkspacePageWithSections_1 = require("@pages/workspace/WorkspacePageWithSections");
var Illustrations = require("@src/components/Icon/Illustrations");
var CONST_1 = require("@src/CONST");
var ExpenseReportRulesSection_1 = require("./ExpenseReportRulesSection");
var IndividualExpenseRulesSection_1 = require("./IndividualExpenseRulesSection");
function PolicyRulesPage(_a) {
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var policyID = route.params.policyID;
    var styles = (0, useThemeStyles_1.default)();
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]}>
            <WorkspacePageWithSections_1.default testID={PolicyRulesPage.displayName} shouldUseScrollView headerText={translate('workspace.common.rules')} shouldShowOfflineIndicatorInWideScreen route={route} icon={Illustrations.Rules} shouldShowNotFoundPage={false} shouldShowLoading={false} addBottomSafeAreaPadding>
                <react_native_1.View style={[styles.mt3, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <IndividualExpenseRulesSection_1.default policyID={policyID}/>
                    <ExpenseReportRulesSection_1.default policyID={policyID}/>
                </react_native_1.View>
            </WorkspacePageWithSections_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
PolicyRulesPage.displayName = 'PolicyRulesPage';
exports.default = PolicyRulesPage;
