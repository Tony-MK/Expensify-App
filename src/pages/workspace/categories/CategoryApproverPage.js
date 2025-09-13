"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const WorkspaceMembersSelectionList_1 = require("@components/WorkspaceMembersSelectionList");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category_1 = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function CategoryApproverPage({ route: { params: { policyID, categoryName }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const selectedApprover = (0, CategoryUtils_1.getCategoryApproverRule)(policy?.rules?.approvalRules ?? [], categoryName)?.approver ?? '';
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CategoryApproverPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.categoryRules.approver')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName))}/>
                <WorkspaceMembersSelectionList_1.default policyID={policyID} selectedApprover={selectedApprover} setApprover={(email) => {
            (0, Category_1.setPolicyCategoryApprover)(policyID, categoryName, email, policy?.rules?.approvalRules ?? []);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName)));
        }}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CategoryApproverPage.displayName = 'CategoryApproverPage';
exports.default = CategoryApproverPage;
