"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const FeatureTrainingModal_1 = require("./FeatureTrainingModal");
const Icon_1 = require("./Icon");
const Illustrations = require("./Icon/Illustrations");
const Text_1 = require("./Text");
const menuSections = [
    {
        icon: Illustrations.Stopwatch,
        titleTranslationKey: 'iou.reject.holdExpenseTitle',
    },
    {
        icon: Illustrations.RealtimeReport,
        titleTranslationKey: 'iou.reject.heldExpenseLeftBehindTitle',
    },
    {
        icon: Illustrations.ThumbsDown,
        titleTranslationKey: 'iou.reject.rejectExpenseTitle',
    },
];
function HoldOrRejectEducationalModal({ onClose, onConfirm }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    (0, useBeforeRemove_1.default)(onClose);
    return (<FeatureTrainingModal_1.default title={translate('iou.reject.educationalTitle')} description={translate('iou.reject.educationalText')} confirmText={translate('common.buttonConfirm')} image={Illustrations.ModalHoldOrReject} contentFitImage="cover" width={variables_1.default.holdEducationModalWidth} illustrationAspectRatio={CONST_1.default.ILLUSTRATION_ASPECT_RATIO} contentInnerContainerStyles={styles.mb5} modalInnerContainerStyle={styles.pt0} illustrationOuterContainerStyle={styles.p0} shouldCloseOnConfirm={false} onClose={onClose} onConfirm={onConfirm}>
            <>
                {menuSections.map((section) => (<react_native_1.View key={section.titleTranslationKey} style={[styles.flexRow, styles.alignItemsStart, styles.mt5]}>
                        <Icon_1.default width={variables_1.default.menuIconSize} height={variables_1.default.menuIconSize} src={section.icon} additionalStyles={[styles.mr4]}/>
                        <Text_1.default style={[styles.mb1, styles.textStrong]}>{translate(section.titleTranslationKey)}</Text_1.default>
                    </react_native_1.View>))}
            </>
        </FeatureTrainingModal_1.default>);
}
HoldOrRejectEducationalModal.displayName = 'HoldOrRejectEducationalModal';
exports.default = HoldOrRejectEducationalModal;
