"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useCloseImportPage_1 = require("@hooks/useCloseImportPage");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Member_1 = require("@libs/actions/Policy/Member");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const WorkspaceMemberRoleSelectionModal_1 = require("@pages/workspace/WorkspaceMemberRoleSelectionModal");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ImportedMembersConfirmationPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [spreadsheet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const [role, setRole] = (0, react_1.useState)(CONST_1.default.POLICY.ROLE.USER);
    const [isRoleSelectionModalVisible, setIsRoleSelectionModalVisible] = (0, react_1.useState)(false);
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const [isImporting, setIsImporting] = (0, react_1.useState)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { setIsClosing } = (0, useCloseImportPage_1.default)();
    (0, react_1.useEffect)(() => {
        return () => {
            (0, Member_1.clearImportedSpreadsheetMemberData)();
        };
    }, []);
    const [importedSpreadsheetMemberData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET_MEMBER_DATA, { canBeMissing: true });
    const newMembers = (0, react_1.useMemo)(() => {
        return importedSpreadsheetMemberData?.filter((member) => !(0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)(member.email, policy) && !member.role) ?? [];
    }, [importedSpreadsheetMemberData, policy]);
    const invitedEmailsToAccountIDsDraft = (0, react_1.useMemo)(() => {
        const memberEmails = newMembers.map((member) => member.email);
        return memberEmails.reduce((acc, email) => {
            acc[email] = (0, PersonalDetailsUtils_1.getAccountIDsByLogins)([email])?.at(0) ?? 0;
            return acc;
        }, {});
        // getAccountIDsByLogins function uses the personalDetails data from the connection, so we need to re-run this logic when the personal detail is changed.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMembers, personalDetails]);
    /** Opens privacy url as an external link */
    const openPrivacyURL = (event) => {
        event?.preventDefault();
        (0, Link_1.openExternalLink)(CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL);
    };
    const importMembers = (0, react_1.useCallback)(() => {
        if (!newMembers) {
            return;
        }
        setIsImporting(true);
        const membersWithRole = (importedSpreadsheetMemberData ?? []).map((member) => ({ ...member, role: member.role || role }));
        (0, Member_1.importPolicyMembers)(policyID, membersWithRole);
    }, [importedSpreadsheetMemberData, newMembers, policyID, role]);
    const closeImportPageAndModal = () => {
        setIsClosing(true);
        setIsImporting(false);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(policyID));
    };
    const onRoleChange = (item) => {
        setRole(item.value);
        setIsRoleSelectionModalVisible(false);
    };
    const roleItems = [
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
    ];
    if (!spreadsheet || !importedSpreadsheetMemberData) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default shouldEnableMaxHeight shouldUseCachedViewportHeight testID={ImportedMembersConfirmationPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.inviteMessage.confirmDetails')} subtitle={policy?.name} shouldShowBackButton onBackButtonPress={() => {
            Navigation_1.default.goBack();
        }}/>
            <react_native_1.View style={styles.ph5}>
                <react_native_1.View style={[styles.mv4, styles.justifyContentCenter, styles.alignItemsCenter]}>
                    <ReportActionAvatars_1.default size={CONST_1.default.AVATAR_SIZE.LARGE} accountIDs={Object.values(invitedEmailsToAccountIDsDraft ?? {})} horizontalStacking={{
            displayInRows: true,
        }} secondaryAvatarContainerStyle={[styles.secondAvatarInline]}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mb5]}>
                    <Text_1.default>{translate('spreadsheet.importMemberConfirmation', { count: newMembers?.length ?? 0 })}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mb3]}>
                    <react_native_1.View style={[styles.mhn5, styles.mb3]}>
                        <MenuItemWithTopDescription_1.default title={translate(`workspace.common.roleName`, { role })} description={translate('common.role')} shouldShowRightIcon onPress={() => {
            setIsRoleSelectionModalVisible(true);
        }}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
            <FixedFooter_1.default style={[styles.flex1, styles.justifyContentEnd]}>
                <Button_1.default text={translate('common.import')} onPress={importMembers} isLoading={isImporting} isDisabled={isOffline} pressOnEnter success large style={styles.mb3}/>
                <PressableWithoutFeedback_1.default onPress={openPrivacyURL} role={CONST_1.default.ROLE.LINK} accessibilityLabel={translate('common.privacy')} href={CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL} style={[styles.mv2, styles.alignSelfStart]}>
                    <react_native_1.View style={[styles.flexRow]}>
                        <Text_1.default style={[styles.mr1, styles.label, styles.link]}>{translate('common.privacy')}</Text_1.default>
                    </react_native_1.View>
                </PressableWithoutFeedback_1.default>
            </FixedFooter_1.default>
            <ConfirmModal_1.default isVisible={spreadsheet?.shouldFinalModalBeOpened} title={spreadsheet?.importFinalModal?.title ?? ''} prompt={spreadsheet?.importFinalModal?.prompt ?? ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} shouldHandleNavigationBack/>
            <WorkspaceMemberRoleSelectionModal_1.default isVisible={isRoleSelectionModalVisible} items={roleItems} onRoleChange={onRoleChange} onClose={() => setIsRoleSelectionModalVisible(false)}/>
        </ScreenWrapper_1.default>);
}
ImportedMembersConfirmationPage.displayName = 'ImportedMembersConfirmationPage';
exports.default = ImportedMembersConfirmationPage;
