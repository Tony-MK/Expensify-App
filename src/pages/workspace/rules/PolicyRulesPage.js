"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const WorkspacePageWithSections_1 = require("@pages/workspace/WorkspacePageWithSections");
const Illustrations = require("@src/components/Icon/Illustrations");
const CONST_1 = require("@src/CONST");
const ExpenseReportRulesSection_1 = require("./ExpenseReportRulesSection");
const IndividualExpenseRulesSection_1 = require("./IndividualExpenseRulesSection");
function PolicyRulesPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const { policyID } = route.params;
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
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
