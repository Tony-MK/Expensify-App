"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useViewportOffsetTop_1 = require("@hooks/useViewportOffsetTop");
const FormActions_1 = require("@libs/actions/FormActions");
const Link_1 = require("@libs/actions/Link");
const Member_1 = require("@libs/actions/Policy/Member");
const Policy_1 = require("@libs/actions/Policy/Policy");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const updateMultilineInputRange_1 = require("@libs/updateMultilineInputRange");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceInviteMessageForm_1 = require("@src/types/form/WorkspaceInviteMessageForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const AccessOrNotFoundWrapper_1 = require("./AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
function WorkspaceInviteMessagePage({ policy, route, currentUserPersonalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [formData, formDataResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_INVITE_MESSAGE_FORM_DRAFT, { canBeMissing: true });
    const viewportOffsetTop = (0, useViewportOffsetTop_1.default)();
    const [welcomeNote, setWelcomeNote] = (0, react_1.useState)();
    const { inputCallbackRef, inputRef } = (0, useAutoFocusInput_1.default)();
    const [invitedEmailsToAccountIDsDraft, invitedEmailsToAccountIDsDraftResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_MEMBERS_DRAFT}${route.params.policyID.toString()}`, {
        canBeMissing: true,
    });
    const [workspaceInviteMessageDraft, workspaceInviteMessageDraftResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_MESSAGE_DRAFT}${route.params.policyID.toString()}`, {
        canBeMissing: true,
    });
    const [workspaceInviteRoleDraft = CONST_1.default.POLICY.ROLE.USER] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_INVITE_ROLE_DRAFT}${route.params.policyID.toString()}`, { canBeMissing: true });
    const isOnyxLoading = (0, isLoadingOnyxValue_1.default)(workspaceInviteMessageDraftResult, invitedEmailsToAccountIDsDraftResult, formDataResult);
    const welcomeNoteSubject = (0, react_1.useMemo)(() => `# ${currentUserPersonalDetails?.displayName ?? ''} invited you to ${policy?.name ?? 'a workspace'}`, [policy?.name, currentUserPersonalDetails?.displayName]);
    const getDefaultWelcomeNote = (0, react_1.useCallback)(() => {
        return (
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        formData?.[WorkspaceInviteMessageForm_1.default.WELCOME_MESSAGE] ??
            // workspaceInviteMessageDraft can be an empty string
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            workspaceInviteMessageDraft ??
            translate('workspace.common.welcomeNote'));
    }, [workspaceInviteMessageDraft, translate, formData]);
    (0, react_1.useEffect)(() => {
        if (isOnyxLoading) {
            return;
        }
        if (!(0, EmptyObject_1.isEmptyObject)(invitedEmailsToAccountIDsDraft)) {
            setWelcomeNote(getDefaultWelcomeNote());
            return;
        }
        if ((0, EmptyObject_1.isEmptyObject)(policy)) {
            return;
        }
        Navigation_1.default.goBack(route.params.backTo);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isOnyxLoading]);
    const sendInvitation = () => {
        react_native_1.Keyboard.dismiss();
        const policyMemberAccountIDs = Object.values((0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policy?.employeeList, false, false));
        // Please see https://github.com/Expensify/App/blob/main/README.md#Security for more details
        (0, Member_1.addMembersToWorkspace)(invitedEmailsToAccountIDsDraft ?? {}, `${welcomeNoteSubject}\n\n${welcomeNote}`, route.params.policyID, policyMemberAccountIDs, workspaceInviteRoleDraft, formatPhoneNumber);
        (0, Policy_1.setWorkspaceInviteMessageDraft)(route.params.policyID, welcomeNote ?? null);
        (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.WORKSPACE_INVITE_MESSAGE_FORM);
        if (route.params?.backTo?.endsWith('members')) {
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.dismissModal());
            return;
        }
        if ((0, getIsNarrowLayout_1.default)()) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(route.params.policyID), { forceReplace: true });
            return;
        }
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
            Navigation_1.default.dismissModal();
            react_native_1.InteractionManager.runAfterInteractions(() => {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(route.params.policyID));
            });
        });
    };
    /** Opens privacy url as an external link */
    const openPrivacyURL = (event) => {
        event?.preventDefault();
        (0, Link_1.openExternalLink)(CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL);
    };
    const validate = () => {
        const errorFields = {};
        if ((0, EmptyObject_1.isEmptyObject)(invitedEmailsToAccountIDsDraft) && !isOnyxLoading) {
            errorFields.welcomeMessage = translate('workspace.inviteMessage.inviteNoMembersError');
        }
        return errorFields;
    };
    const policyName = policy?.name;
    (0, react_1.useEffect)(() => {
        return () => {
            (0, Member_1.clearWorkspaceInviteRoleDraft)(route.params.policyID);
        };
    }, [route.params.policyID]);
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} fullPageNotFoundViewProps={{ subtitleKey: (0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized', onLinkPress: PolicyUtils_1.goBackFromInvalidPolicy }}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceInviteMessagePage.displayName} shouldEnableMaxHeight style={{ marginTop: viewportOffsetTop }}>
                <HeaderWithBackButton_1.default title={translate('workspace.inviteMessage.confirmDetails')} subtitle={policyName} shouldShowBackButton onCloseButtonPress={() => Navigation_1.default.dismissModal()} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.WORKSPACE_INVITE_MESSAGE_FORM} validate={validate} onSubmit={sendInvitation} submitButtonText={translate('common.invite')} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding footerContent={<PressableWithoutFeedback_1.default onPress={openPrivacyURL} role={CONST_1.default.ROLE.LINK} accessibilityLabel={translate('common.privacy')} href={CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL} style={[styles.mv2, styles.alignSelfStart]}>
                            <react_native_1.View style={[styles.flexRow]}>
                                <Text_1.default style={[styles.mr1, styles.label, styles.link]}>{translate('common.privacy')}</Text_1.default>
                            </react_native_1.View>
                        </PressableWithoutFeedback_1.default>}>
                    <react_native_1.View style={[styles.mv4, styles.justifyContentCenter, styles.alignItemsCenter]}>
                        <ReportActionAvatars_1.default size={CONST_1.default.AVATAR_SIZE.LARGE} accountIDs={Object.values(invitedEmailsToAccountIDsDraft ?? {})} horizontalStacking={{
            displayInRows: true,
        }} secondaryAvatarContainerStyle={styles.secondAvatarInline} invitedEmailsToAccountIDs={invitedEmailsToAccountIDsDraft} shouldUseCustomFallbackAvatar/>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mb5]}>
                        <Text_1.default>{translate('workspace.inviteMessage.inviteMessagePrompt')}</Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mb3]}>
                        <react_native_1.View style={[styles.mhn5, styles.mb3]}>
                            <MenuItemWithTopDescription_1.default title={translate(`workspace.common.roleName`, { role: workspaceInviteRoleDraft })} description={translate('common.role')} shouldShowRightIcon onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_INVITE_MESSAGE_ROLE.getRoute(route.params.policyID, Navigation_1.default.getActiveRoute()));
        }}/>
                        </react_native_1.View>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={WorkspaceInviteMessageForm_1.default.WELCOME_MESSAGE} label={translate('workspace.inviteMessage.personalMessagePrompt')} accessibilityLabel={translate('workspace.inviteMessage.personalMessagePrompt')} autoCompleteType="off" type="markdown" autoCorrect={false} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} value={welcomeNote} onChangeText={(text) => {
            setWelcomeNote(text);
        }} ref={(element) => {
            if (!element) {
                return;
            }
            if (!inputRef.current) {
                (0, updateMultilineInputRange_1.default)(element);
            }
            inputCallbackRef(element);
        }} shouldSaveDraft/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceInviteMessagePage.displayName = 'WorkspaceInviteMessagePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)((0, withCurrentUserPersonalDetails_1.default)(WorkspaceInviteMessagePage));
