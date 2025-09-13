"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const colors_1 = require("@styles/theme/colors");
const variables_1 = require("@styles/variables");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const FeatureTrainingModal_1 = require("./FeatureTrainingModal");
const Icon_1 = require("./Icon");
const Illustrations = require("./Icon/Illustrations");
const Text_1 = require("./Text");
const menuSections = [
    {
        icon: Illustrations.PaperAirplane,
        titleTranslationKey: 'autoSubmitModal.submittedExpensesTitle',
        descriptionTranslationKey: 'autoSubmitModal.submittedExpensesDescription',
    },
    {
        icon: Illustrations.Pencil,
        titleTranslationKey: 'autoSubmitModal.pendingExpensesTitle',
        descriptionTranslationKey: 'autoSubmitModal.pendingExpensesDescription',
    },
];
function AutoSubmitModal() {
    const [dismissedASAPSubmitExplanation] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_ASAP_SUBMIT_EXPLANATION, { canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const onClose = (0, react_1.useCallback)((willShowAgain) => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            if (!willShowAgain) {
                (0, User_1.dismissASAPSubmitExplanation)(true);
            }
            else {
                (0, User_1.dismissASAPSubmitExplanation)(false);
            }
        });
    }, []);
    return (<FeatureTrainingModal_1.default title={translate('autoSubmitModal.title')} description={translate('autoSubmitModal.description')} confirmText={translate('common.buttonConfirm')} image={Illustrations.ReceiptsStackedOnPin} contentFitImage="cover" width={variables_1.default.holdEducationModalWidth} imageWidth={variables_1.default.changePolicyEducationModalIconWidth} imageHeight={variables_1.default.changePolicyEducationModalIconHeight} illustrationAspectRatio={CONST_1.default.ILLUSTRATION_ASPECT_RATIO} illustrationInnerContainerStyle={[styles.alignItemsCenter, styles.justifyContentCenter, StyleUtils.getBackgroundColorStyle(colors_1.default.green700), styles.p8]} modalInnerContainerStyle={styles.pt0} illustrationOuterContainerStyle={styles.p0} shouldShowDismissModalOption={dismissedASAPSubmitExplanation === false} onConfirm={onClose} titleStyles={[styles.mb1]} contentInnerContainerStyles={[styles.mb5]}>
            {menuSections.map((section) => (<react_native_1.View key={section.titleTranslationKey} style={[styles.flexRow, styles.alignItemsCenter, styles.mt3]}>
                    <Icon_1.default width={variables_1.default.menuIconSize} height={variables_1.default.menuIconSize} src={section.icon} additionalStyles={[styles.mr4]}/>
                    <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                        <Text_1.default style={[styles.textStrong, styles.mb1]}>{translate(section.titleTranslationKey)}</Text_1.default>
                        <Text_1.default style={[styles.mutedTextLabel, styles.lh16]}>{translate(section.descriptionTranslationKey)}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>))}
        </FeatureTrainingModal_1.default>);
}
exports.default = AutoSubmitModal;
AutoSubmitModal.displayName = 'AutoSubmitModal';
