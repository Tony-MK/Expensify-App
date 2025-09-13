"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const colors_1 = require("@styles/theme/colors");
const ConfirmModal_1 = require("./ConfirmModal");
const Illustrations_1 = require("./Icon/Illustrations");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
function FocusModeNotification({ onClose }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const href = `${environmentURL}/settings/preferences/priority-mode`;
    return (<ConfirmModal_1.default title={translate('focusModeUpdateModal.title')} confirmText={translate('common.buttonConfirm')} onConfirm={onClose} shouldShowCancelButton={false} onBackdropPress={onClose} onCancel={onClose} prompt={<Text_1.default>
                    {translate('focusModeUpdateModal.prompt')}
                    <TextLink_1.default style={styles.link} onPress={() => {
                onClose();
                (0, Link_1.openLink)(href, environmentURL);
            }}>
                        {translate('focusModeUpdateModal.settings')}
                    </TextLink_1.default>
                    .
                </Text_1.default>} isVisible image={Illustrations_1.ThreeLeggedLaptopWoman} imageStyles={StyleUtils.getBackgroundColorStyle(colors_1.default.pink800)} titleStyles={[styles.textHeadline, styles.mbn3]}/>);
}
FocusModeNotification.displayName = 'FocusModeNotification';
exports.default = FocusModeNotification;
