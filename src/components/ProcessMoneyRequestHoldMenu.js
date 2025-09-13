"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const FeatureTrainingModal_1 = require("./FeatureTrainingModal");
const HoldMenuSectionList_1 = require("./HoldMenuSectionList");
const Illustrations = require("./Icon/Illustrations");
const Text_1 = require("./Text");
const TextPill_1 = require("./TextPill");
function ProcessMoneyRequestHoldMenu({ onClose, onConfirm }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    (0, useBeforeRemove_1.default)(onClose);
    const title = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, onboardingIsMediumOrLargerScreenWidth ? styles.mb1 : styles.mb2]}>
                <Text_1.default style={[styles.textHeadline, styles.mr2]}>{translate('iou.holdEducationalTitle')}</Text_1.default>
                <TextPill_1.default textStyles={styles.holdRequestInline}>{translate('iou.holdEducationalText')}</TextPill_1.default>
            </react_native_1.View>), [onboardingIsMediumOrLargerScreenWidth, styles.flexRow, styles.alignItemsCenter, styles.mb1, styles.mb2, styles.textHeadline, styles.mr2, styles.holdRequestInline, translate]);
    return (<FeatureTrainingModal_1.default title={title} description={translate('iou.whatIsHoldExplain')} confirmText={translate('common.buttonConfirm')} image={Illustrations.HoldExpense} contentFitImage="cover" width={variables_1.default.holdEducationModalWidth} illustrationAspectRatio={CONST_1.default.ILLUSTRATION_ASPECT_RATIO} contentInnerContainerStyles={styles.mb5} modalInnerContainerStyle={styles.pt0} illustrationOuterContainerStyle={styles.p0} onClose={onClose} onConfirm={onConfirm}>
            <HoldMenuSectionList_1.default />
        </FeatureTrainingModal_1.default>);
}
ProcessMoneyRequestHoldMenu.displayName = 'ProcessMoneyRequestHoldMenu';
exports.default = ProcessMoneyRequestHoldMenu;
