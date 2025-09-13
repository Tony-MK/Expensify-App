"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const WorkspaceMembersSelectionList_1 = require("@components/WorkspaceMembersSelectionList");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Tag_1 = require("@libs/actions/Policy/Tag");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function TagApproverPage({ route }) {
    const { policyID, tagName, orderWeight, backTo } = route.params;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const tagApprover = (0, PolicyUtils_1.getTagApproverRule)(policy, tagName)?.approver;
    const isQuickSettingsFlow = route.name === SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_APPROVER;
    const goBack = () => {
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_TAG_SETTINGS.getRoute(policyID, orderWeight, tagName, backTo) : ROUTES_1.default.WORKSPACE_TAG_SETTINGS.getRoute(policyID, orderWeight, tagName));
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={TagApproverPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.tags.approverDescription')} onBackButtonPress={goBack}/>
                <WorkspaceMembersSelectionList_1.default policyID={policyID} selectedApprover={tagApprover ?? ''} setApprover={(email) => {
            (0, Tag_1.setPolicyTagApprover)(policyID, tagName, email);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(goBack);
        }}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
TagApproverPage.displayName = 'TagApproverPage';
exports.default = TagApproverPage;
