"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ChangeWorkspaceMenuSectionList_1 = require("@components/ChangeWorkspaceMenuSectionList");
const FeatureTrainingModal_1 = require("@components/FeatureTrainingModal");
const Illustrations = require("@components/Icon/Illustrations");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const colors_1 = require("@styles/theme/colors");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function ChangePolicyEducationalModal() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const onConfirm = (0, react_1.useCallback)(() => {
        (0, Report_1.dismissChangePolicyModal)();
    }, []);
    (0, useBeforeRemove_1.default)(onConfirm);
    return (<FeatureTrainingModal_1.default title={translate('iou.changePolicyEducational.title')} description={translate('iou.changePolicyEducational.description')} confirmText={translate('common.buttonConfirm')} image={Illustrations.ReceiptFairy} imageWidth={variables_1.default.changePolicyEducationModalIconWidth} imageHeight={variables_1.default.changePolicyEducationModalIconHeight} contentFitImage="cover" width={variables_1.default.changePolicyEducationModalWidth} illustrationAspectRatio={CONST_1.default.ILLUSTRATION_ASPECT_RATIO} illustrationInnerContainerStyle={[styles.alignItemsCenter, styles.justifyContentCenter, StyleUtils.getBackgroundColorStyle(colors_1.default.blue700)]} modalInnerContainerStyle={styles.pt0} illustrationOuterContainerStyle={styles.p0} contentInnerContainerStyles={[styles.mb5, styles.gap2]} onClose={onConfirm} onConfirm={onConfirm}>
            <ChangeWorkspaceMenuSectionList_1.default />
        </FeatureTrainingModal_1.default>);
}
ChangePolicyEducationalModal.displayName = 'ChangePolicyEducationalModal';
exports.default = ChangePolicyEducationalModal;
