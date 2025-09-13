"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const CopyTextToClipboard_1 = require("@components/CopyTextToClipboard");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ContactMethodsPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { formatPhoneNumber, translate } = (0, useLocalize_1.default)();
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: false });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const loginNames = Object.keys(loginList ?? {});
    const navigateBackTo = route?.params?.backTo;
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: false });
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    // Sort the login names by placing the one corresponding to the default contact method as the first item before displaying the contact methods.
    // The default contact method is determined by checking against the session email (the current login).
    const sortedLoginNames = loginNames.sort((loginName) => (loginList?.[loginName].partnerUserID === session?.email ? -1 : 1));
    const loginMenuItems = sortedLoginNames.map((loginName) => {
        const login = loginList?.[loginName];
        const isDefaultContactMethod = session?.email === login?.partnerUserID;
        const pendingAction = login?.pendingFields?.deletedLogin ?? login?.pendingFields?.addedLogin ?? undefined;
        if (!login?.partnerUserID && !pendingAction) {
            return null;
        }
        let description = '';
        if (session?.email === login?.partnerUserID) {
            description = translate('contacts.getInTouch');
        }
        else if (login?.errorFields?.addedLogin) {
            description = translate('contacts.failedNewContact');
        }
        else if (!login?.validatedDate) {
            description = translate('contacts.pleaseVerify');
        }
        let indicator;
        if (Object.values(login?.errorFields ?? {}).some((errorField) => !(0, EmptyObject_1.isEmptyObject)(errorField))) {
            indicator = CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR;
        }
        else if (!login?.validatedDate && !isDefaultContactMethod) {
            indicator = CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO;
        }
        else if (!login?.validatedDate && isDefaultContactMethod && loginNames.length > 1) {
            indicator = CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO;
        }
        // Default to using login key if we deleted login.partnerUserID optimistically
        // but still need to show the pending login being deleted while offline.
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const partnerUserID = login?.partnerUserID || loginName;
        const menuItemTitle = expensify_common_1.Str.isSMSLogin(partnerUserID) ? formatPhoneNumber(partnerUserID) : partnerUserID;
        return (<OfflineWithFeedback_1.default pendingAction={pendingAction} key={partnerUserID}>
                <MenuItem_1.default title={menuItemTitle} description={description} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_DETAILS.getRoute(partnerUserID, navigateBackTo))} brickRoadIndicator={indicator} shouldShowBasicTitle shouldShowRightIcon disabled={!!pendingAction}/>
            </OfflineWithFeedback_1.default>);
    });
    const onNewContactMethodButtonPress = (0, react_1.useCallback)(() => {
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        if (isAccountLocked) {
            showLockedAccountModal();
            return;
        }
        if (!isUserValidated) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute(), ROUTES_1.default.SETTINGS_NEW_CONTACT_METHOD.getRoute(navigateBackTo)));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_NEW_CONTACT_METHOD.getRoute(navigateBackTo));
    }, [navigateBackTo, isActingAsDelegate, showDelegateNoAccessModal, isAccountLocked, isUserValidated, showLockedAccountModal]);
    return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} testID={ContactMethodsPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('contacts.contactMethods')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                <react_native_1.View style={[styles.ph5, styles.mv3, styles.flexRow, styles.flexWrap]}>
                    <Text_1.default>
                        {translate('contacts.helpTextBeforeEmail')}
                        <CopyTextToClipboard_1.default text={CONST_1.default.EMAIL.RECEIPTS} textStyles={[styles.textBlue]}/>
                        <Text_1.default>{translate('contacts.helpTextAfterEmail')}</Text_1.default>
                    </Text_1.default>
                </react_native_1.View>
                {loginMenuItems}
                <FixedFooter_1.default style={[styles.mtAuto, styles.pt5]}>
                    <Button_1.default large success text={translate('contacts.newContactMethod')} onPress={onNewContactMethodButtonPress} pressOnEnter/>
                </FixedFooter_1.default>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
ContactMethodsPage.displayName = 'ContactMethodsPage';
exports.default = ContactMethodsPage;
