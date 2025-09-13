"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const test_drive_svg_1 = require("@assets/images/test-drive.svg");
const FeatureTrainingModal_1 = require("@components/FeatureTrainingModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function BaseTestDriveModal({ description, onConfirm, onHelp, children, shouldCloseOnConfirm, shouldRenderHTMLDescription, avoidKeyboard, shouldShowConfirmationLoader, canConfirmWhileOffline, shouldCallOnHelpWhenModalHidden, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<FeatureTrainingModal_1.default image={test_drive_svg_1.default} illustrationOuterContainerStyle={styles.p0} illustrationAspectRatio={CONST_1.default.FEATURE_TRAINING.TEST_DRIVE_COVER_ASPECT_RATIO} title={translate('testDrive.modal.title')} description={description} helpText={translate('testDrive.modal.helpText')} confirmText={translate('testDrive.modal.confirmText')} onHelp={onHelp} onConfirm={onConfirm} modalInnerContainerStyle={styles.testDriveModalContainer(shouldUseNarrowLayout)} contentInnerContainerStyles={styles.gap2} shouldCloseOnConfirm={shouldCloseOnConfirm} shouldRenderHTMLDescription={shouldRenderHTMLDescription} avoidKeyboard={avoidKeyboard} shouldShowConfirmationLoader={shouldShowConfirmationLoader} shouldUseScrollView canConfirmWhileOffline={canConfirmWhileOffline} shouldCallOnHelpWhenModalHidden={shouldCallOnHelpWhenModalHidden}>
            {children}
        </FeatureTrainingModal_1.default>);
}
BaseTestDriveModal.displayName = 'BaseTestDriveModal';
exports.default = BaseTestDriveModal;
