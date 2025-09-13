"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentPicker_1 = require("@components/AttachmentPicker");
const DecisionModal_1 = require("@components/DecisionModal");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function BaseImportOnyxState({ onFileRead, isErrorModalVisible, setIsErrorModalVisible, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply the correct modal type for the decision modal
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    return (<>
            <AttachmentPicker_1.default acceptedFileTypes={['text']} shouldHideCameraOption shouldHideGalleryOption>
                {({ openPicker }) => {
            return (<MenuItem_1.default icon={Expensicons.Upload} title={translate('initialSettingsPage.troubleshoot.importOnyxState')} wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={() => {
                    openPicker({
                        onPicked: (data) => onFileRead(data.at(0) ?? {}),
                    });
                }}/>);
        }}
            </AttachmentPicker_1.default>
            <DecisionModal_1.default title={translate('initialSettingsPage.troubleshoot.invalidFile')} prompt={translate('initialSettingsPage.troubleshoot.invalidFileDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setIsErrorModalVisible(false)} secondOptionText={translate('common.ok')} isVisible={isErrorModalVisible} onClose={() => setIsErrorModalVisible(false)}/>
        </>);
}
exports.default = BaseImportOnyxState;
