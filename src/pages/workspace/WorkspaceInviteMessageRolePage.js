"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useViewportOffsetTop_1 = require("@hooks/useViewportOffsetTop");
const Member_1 = require("@libs/actions/Policy/Member");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
function WorkspaceInviteMessageRolePage({ policy, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [role = CONST_1.default.POLICY.ROLE.USER, roleResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_ROLE_DRAFT}${route.params.policyID}`, {
        canBeMissing: true,
    });
    const viewportOffsetTop = (0, useViewportOffsetTop_1.default)();
    const isOnyxLoading = (0, isLoadingOnyxValue_1.default)(roleResult);
    const roleItems = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.POLICY.ROLE.ADMIN,
            text: translate('common.admin'),
            alternateText: translate('workspace.common.adminAlternateText'),
            isSelected: role === CONST_1.default.POLICY.ROLE.ADMIN,
            keyForList: CONST_1.default.POLICY.ROLE.ADMIN,
        },
        {
            value: CONST_1.default.POLICY.ROLE.AUDITOR,
            text: translate('common.auditor'),
            alternateText: translate('workspace.common.auditorAlternateText'),
            isSelected: role === CONST_1.default.POLICY.ROLE.AUDITOR,
            keyForList: CONST_1.default.POLICY.ROLE.AUDITOR,
        },
        {
            value: CONST_1.default.POLICY.ROLE.USER,
            text: translate('common.member'),
            alternateText: translate('workspace.common.memberAlternateText'),
            isSelected: role === CONST_1.default.POLICY.ROLE.USER,
            keyForList: CONST_1.default.POLICY.ROLE.USER,
        },
    ], [role, translate]);
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils_1.goBackFromInvalidPolicy }}>
            <ScreenWrapper_1.default testID={WorkspaceInviteMessageRolePage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight style={{ marginTop: viewportOffsetTop }}>
                <HeaderWithBackButton_1.default title={translate('common.role')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
                {!isOnyxLoading && (<react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone]}>
                        <SelectionList_1.default sections={[{ data: roleItems }]} ListItem={RadioListItem_1.default} onSelectRow={({ value }) => {
                (0, Member_1.setWorkspaceInviteRoleDraft)(route.params.policyID, value);
                Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
                    Navigation_1.default.goBack(route.params.backTo);
                });
            }} isAlternateTextMultilineSupported shouldSingleExecuteRowSelect initiallyFocusedOptionKey={roleItems.find((item) => item.isSelected)?.keyForList} addBottomSafeAreaPadding/>
                    </react_native_1.View>)}
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceInviteMessageRolePage.displayName = 'WorkspaceInviteMessageRolePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceInviteMessageRolePage);
