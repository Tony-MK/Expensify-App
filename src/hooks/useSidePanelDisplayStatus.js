"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useLocalize_1 = require("./useLocalize");
const useOnyx_1 = require("./useOnyx");
const useResponsiveLayout_1 = require("./useResponsiveLayout");
/**
 * Hook to get the display status of the Side Panel
 */
function useSidePanelDisplayStatus() {
    const { isExtraLargeScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { preferredLocale } = (0, useLocalize_1.default)();
    const [sidePanelNVP] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_SIDE_PANEL, { canBeMissing: true });
    const [isModalCenteredVisible = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, {
        canBeMissing: true,
        selector: (modal) => modal?.type === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SWIPEABLE_TO_RIGHT ||
            modal?.type === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE ||
            modal?.type === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SMALL ||
            modal?.type === CONST_1.default.MODAL.MODAL_TYPE.CENTERED,
    });
    const isLanguageUnsupported = preferredLocale !== CONST_1.default.LOCALES.EN;
    const isSidePanelVisible = isExtraLargeScreenWidth ? sidePanelNVP?.open : sidePanelNVP?.openNarrowScreen;
    // The Side Panel is hidden when:
    // - NVP is not set or it is false
    // - language is unsupported
    // - modal centered is visible
    const shouldHideSidePanel = !isSidePanelVisible || isLanguageUnsupported || isModalCenteredVisible || !sidePanelNVP;
    const isSidePanelHiddenOrLargeScreen = !isSidePanelVisible || isLanguageUnsupported || isExtraLargeScreenWidth || !sidePanelNVP;
    // The help button is hidden when:
    // - side pane nvp is not set
    // - Side Panel is displayed currently
    // - language is unsupported
    const shouldHideHelpButton = !sidePanelNVP || !shouldHideSidePanel || isLanguageUnsupported;
    const shouldHideSidePanelBackdrop = shouldHideSidePanel || isExtraLargeScreenWidth || shouldUseNarrowLayout;
    return {
        sidePanelNVP,
        shouldHideSidePanel,
        isSidePanelHiddenOrLargeScreen,
        shouldHideHelpButton,
        shouldHideSidePanelBackdrop,
    };
}
exports.default = useSidePanelDisplayStatus;
