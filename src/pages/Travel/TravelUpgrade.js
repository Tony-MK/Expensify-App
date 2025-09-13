"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const WorkspaceConfirmationForm_1 = require("@components/WorkspaceConfirmationForm");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const UpgradeConfirmation_1 = require("@pages/workspace/upgrade/UpgradeConfirmation");
const UpgradeIntro_1 = require("@pages/workspace/upgrade/UpgradeIntro");
const CONST_1 = require("@src/CONST");
const Policy_1 = require("@src/libs/actions/Policy/Policy");
function TravelUpgrade({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const feature = CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.travel;
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [isUpgraded, setIsUpgraded] = (0, react_1.useState)(false);
    const [shouldShowConfirmation, setShouldShowConfirmation] = (0, react_1.useState)(false);
    const onSubmit = (params) => {
        (0, Policy_1.createDraftWorkspace)('', false, params.name, params.policyID, params.currency, params.avatarFile);
        setShouldShowConfirmation(false);
        setIsUpgraded(true);
        (0, Policy_1.createWorkspace)({
            policyOwnerEmail: '',
            makeMeAdmin: false,
            policyName: params.name,
            policyID: params.policyID,
            engagementChoice: undefined,
            currency: params.currency,
            file: params.avatarFile,
        });
    };
    const onClose = () => {
        setShouldShowConfirmation(false);
    };
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator testID={TravelUpgrade.displayName} offlineIndicatorStyle={styles.mtAuto}>
            <HeaderWithBackButton_1.default title={translate('common.upgrade')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
            <Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={shouldShowConfirmation} onClose={onClose} onModalHide={onClose} onBackdropPress={() => {
            onClose();
            Navigation_1.default.dismissModal();
        }} enableEdgeToEdgeBottomSafeAreaPadding>
                <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding shouldKeyboardOffsetBottomSafeAreaPadding testID={TravelUpgrade.displayName}>
                    <WorkspaceConfirmationForm_1.default onSubmit={onSubmit} onBackButtonPress={onClose}/>
                </ScreenWrapper_1.default>
            </Modal_1.default>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                {isUpgraded ? (<UpgradeConfirmation_1.default onConfirmUpgrade={() => Navigation_1.default.goBack()} policyName="" isTravelUpgrade/>) : (<UpgradeIntro_1.default feature={feature} onUpgrade={() => setShouldShowConfirmation(true)} buttonDisabled={isOffline} loading={false} isCategorizing/>)}
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
TravelUpgrade.displayName = 'TravelUpgrade';
exports.default = TravelUpgrade;
