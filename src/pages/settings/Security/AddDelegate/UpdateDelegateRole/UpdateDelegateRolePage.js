"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Delegate_1 = require("@libs/actions/Delegate");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const UpdateDelegateMagicCodeModal_1 = require("./UpdateDelegateMagicCodeModal");
function UpdateDelegateRolePage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const login = route.params.login;
    const currentRole = route.params.currentRole;
    const showValidateActionModalFromURL = route.params.showValidateActionModal === 'true';
    const newRoleFromURL = route.params.newRole;
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(showValidateActionModalFromURL ?? false);
    const [newRole, setNewRole] = (0, react_1.useState)(newRoleFromURL);
    const [shouldShowLoading, setShouldShowLoading] = (0, react_1.useState)(showValidateActionModalFromURL ?? false);
    (0, react_1.useEffect)(() => {
        Navigation_1.default.setParams({ showValidateActionModal: isValidateCodeActionModalVisible, newRole });
    }, [isValidateCodeActionModalVisible, newRole]);
    const styles = (0, useThemeStyles_1.default)();
    const roleOptions = Object.values(CONST_1.default.DELEGATE_ROLE).map((role) => ({
        value: role,
        text: translate('delegate.role', { role }),
        keyForList: role,
        alternateText: translate('delegate.roleDescription', { role }),
        isSelected: role === currentRole,
    }));
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    (0, react_1.useEffect)(() => {
        (0, Delegate_1.updateDelegateRoleOptimistically)(login ?? '', currentRole);
        return () => (0, Delegate_1.clearDelegateRolePendingAction)(login);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [login]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={UpdateDelegateRolePage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('delegate.accessLevel')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <SelectionList_1.default isAlternateTextMultilineSupported alternateTextNumberOfLines={4} initiallyFocusedOptionKey={currentRole} shouldUpdateFocusedIndex headerContent={<Text_1.default style={[styles.ph5, styles.pb5, styles.pt3]}>
                            <>
                                {translate('delegate.accessLevelDescription')}{' '}
                                <TextLink_1.default style={[styles.link]} href={CONST_1.default.COPILOT_HELP_URL}>
                                    {translate('common.learnMore')}
                                </TextLink_1.default>
                                .
                            </>
                        </Text_1.default>} onSelectRow={(option) => {
            if (option.isSelected) {
                Navigation_1.default.dismissModal();
                return;
            }
            setNewRole(option?.value);
            setIsValidateCodeActionModalVisible(true);
        }} sections={[{ data: roleOptions }]} ListItem={RadioListItem_1.default}/>
                {!!newRole && (<UpdateDelegateMagicCodeModal_1.default login={login} role={newRole} isValidateCodeActionModalVisible={isValidateCodeActionModalVisible} onClose={() => {
                setShouldShowLoading(false);
                setIsValidateCodeActionModalVisible(false);
            }}/>)}
            </DelegateNoAccessWrapper_1.default>
            {shouldShowLoading && <FullscreenLoadingIndicator_1.default />}
        </ScreenWrapper_1.default>);
}
UpdateDelegateRolePage.displayName = 'UpdateDelegateRolePage';
exports.default = UpdateDelegateRolePage;
