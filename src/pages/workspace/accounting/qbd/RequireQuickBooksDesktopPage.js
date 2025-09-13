"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const laptop_with_second_screen_x_svg_1 = require("@assets/images/laptop-with-second-screen-x.svg");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ImageSVG_1 = require("@components/ImageSVG");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
function RequireQuickBooksDesktopModal() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={RequireQuickBooksDesktopModal.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.qbd.qbdSetup')} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.dismissModal()}/>
            <react_native_1.View style={[styles.flex1]}>
                <react_native_1.View style={[styles.flex1, styles.justifyContentCenter, styles.ph5]}>
                    <react_native_1.View style={[styles.alignSelfCenter, styles.pendingStateCardIllustration]}>
                        <ImageSVG_1.default src={laptop_with_second_screen_x_svg_1.default}/>
                    </react_native_1.View>

                    <Text_1.default style={[styles.textAlignCenter, styles.textHeadlineH1, styles.pt5]}>{translate('workspace.qbd.requiredSetupDevice.title')}</Text_1.default>
                    <Text_1.default style={[styles.textAlignCenter, styles.textSupporting, styles.textNormal, styles.pt3]}>{translate('workspace.qbd.requiredSetupDevice.body1')}</Text_1.default>
                    <Text_1.default style={[styles.textAlignCenter, styles.textSupporting, styles.textNormal, styles.pt4]}>{translate('workspace.qbd.requiredSetupDevice.body2')}</Text_1.default>
                </react_native_1.View>
                <FixedFooter_1.default addBottomSafeAreaPadding>
                    <Button_1.default success text={translate('common.buttonConfirm')} onPress={() => Navigation_1.default.dismissModal()} pressOnEnter large/>
                </FixedFooter_1.default>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
RequireQuickBooksDesktopModal.displayName = 'RequireQuickBooksDesktopModal';
exports.default = RequireQuickBooksDesktopModal;
