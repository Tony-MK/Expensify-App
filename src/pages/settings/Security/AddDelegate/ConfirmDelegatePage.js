"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderPageLayout_1 = require("@components/HeaderPageLayout");
const Expensicons_1 = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const customHistory_1 = require("@libs/Navigation/AppNavigator/customHistory");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const DelegateMagicCodeModal_1 = require("./DelegateMagicCodeModal");
function ConfirmDelegatePage({ route }) {
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const login = route.params.login;
    const role = route.params.role;
    const { isOffline } = (0, useNetwork_1.default)();
    const [shouldDisableModalAnimation, setShouldDisableModalAnimation] = (0, react_1.useState)(true);
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, customHistory_1.useCustomHistoryParam)();
    const [shouldShowLoading, setShouldShowLoading] = (0, react_1.useState)(isValidateCodeActionModalVisible ?? false);
    const personalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(login);
    const avatarIcon = personalDetails?.avatar ?? Expensicons_1.FallbackAvatar;
    const formattedLogin = formatPhoneNumber(login ?? '');
    const displayName = personalDetails?.displayName ?? formattedLogin;
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    const submitButton = (<Button_1.default success isDisabled={isOffline} large text={translate('delegate.addCopilot')} style={styles.mt6} pressOnEnter onPress={() => {
            setShouldDisableModalAnimation(false);
            setIsValidateCodeActionModalVisible(true);
        }}/>);
    return (<>
            <HeaderPageLayout_1.default onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_DELEGATE_ROLE.getRoute(login, role))} title={translate('delegate.addCopilot')} testID={ConfirmDelegatePage.displayName} footer={submitButton} childrenContainerStyles={[styles.pt3, styles.gap6]} keyboardShouldPersistTaps="handled">
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                    <Text_1.default style={[styles.ph5]}>{translate('delegate.confirmCopilot')}</Text_1.default>
                    <MenuItem_1.default avatarID={personalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID} iconType={CONST_1.default.ICON_TYPE_AVATAR} icon={avatarIcon} title={displayName} description={formattedLogin} interactive={false}/>
                    <MenuItemWithTopDescription_1.default title={translate('delegate.role', { role })} description={translate('delegate.accessLevel')} helperText={translate('delegate.roleDescription', { role })} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_DELEGATE_ROLE.getRoute(login, role, ROUTES_1.default.SETTINGS_DELEGATE_CONFIRM.getRoute(login, role)))} shouldShowRightIcon/>
                    <DelegateMagicCodeModal_1.default 
    // We should disable the animation initially and only enable it when the user manually opens the modal
    // to ensure it appears immediately when refreshing the page.
    disableAnimation={shouldDisableModalAnimation} login={login} role={role} onClose={() => {
            setShouldShowLoading(false);
            setIsValidateCodeActionModalVisible(false);
        }} isValidateCodeActionModalVisible={isValidateCodeActionModalVisible}/>
                </DelegateNoAccessWrapper_1.default>
            </HeaderPageLayout_1.default>
            {shouldShowLoading && <FullscreenLoadingIndicator_1.default />}
        </>);
}
ConfirmDelegatePage.displayName = 'ConfirmDelegatePage';
exports.default = ConfirmDelegatePage;
