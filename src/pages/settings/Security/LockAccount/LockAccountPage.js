"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderPageLayout_1 = require("@components/HeaderPageLayout");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function LockAccountPage() {
    const { translate } = (0, useLocalize_1.default)();
    const [isConfirmModalVisible, setIsConfirmModalVisible] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const lockAccountButton = (<Button_1.default danger isLoading={isLoading} isDisabled={isOffline} large text={translate('lockAccountPage.reportSuspiciousActivity')} style={styles.mt6} pressOnEnter onPress={() => {
            setIsConfirmModalVisible(true);
        }}/>);
    return (<>
            <HeaderPageLayout_1.default onBackButtonPress={() => Navigation_1.default.goBack()} title={translate('lockAccountPage.reportSuspiciousActivity')} testID={LockAccountPage.displayName} footer={lockAccountButton} childrenContainerStyles={[styles.pt3, styles.gap6]}>
                <react_native_1.View style={[styles.flex1, styles.gap4, styles.mh5]}>
                    <Text_1.default>{translate('lockAccountPage.compromisedDescription')}</Text_1.default>
                    <Text_1.default>{translate('lockAccountPage.domainAdminsDescription')}</Text_1.default>
                </react_native_1.View>
            </HeaderPageLayout_1.default>
            <ConfirmModal_1.default danger title={translate('lockAccountPage.reportSuspiciousActivity')} onConfirm={() => {
            // If there is no user accountID yet (because the app isn't fully setup yet), so return early
            if (session?.accountID === -1) {
                return;
            }
            setIsConfirmModalVisible(false);
            setIsLoading(true);
            (0, User_1.lockAccount)().then((response) => {
                setIsLoading(false);
                if (!response?.jsonCode) {
                    return;
                }
                if (response.jsonCode === CONST_1.default.JSON_CODE.SUCCESS) {
                    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_UNLOCK_ACCOUNT);
                }
                else {
                    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_FAILED_TO_LOCK_ACCOUNT);
                }
            });
        }} onCancel={() => setIsConfirmModalVisible(false)} isVisible={isConfirmModalVisible} prompt={<>
                        <Text_1.default style={[styles.mb5]}>{translate('lockAccountPage.areYouSure')}</Text_1.default>
                        <Text_1.default style={[styles.mb5]}>{translate('lockAccountPage.ourTeamWill')}</Text_1.default>
                    </>} confirmText={translate('lockAccountPage.lockAccount')} cancelText={translate('common.cancel')} shouldDisableConfirmButtonWhenOffline shouldShowCancelButton/>
        </>);
}
LockAccountPage.displayName = 'LockAccountPage';
exports.default = LockAccountPage;
