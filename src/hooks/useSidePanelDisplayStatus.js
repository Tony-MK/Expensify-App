"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useLocalize_1 = require("./useLocalize");
var useOnyx_1 = require("./useOnyx");
var useResponsiveLayout_1 = require("./useResponsiveLayout");
/**
 * Hook to get the display status of the Side Panel
 */
function useSidePanelDisplayStatus() {
    var _a = (0, useResponsiveLayout_1.default)(), isExtraLargeScreenWidth = _a.isExtraLargeScreenWidth, shouldUseNarrowLayout = _a.shouldUseNarrowLayout;
    var preferredLocale = (0, useLocalize_1.default)().preferredLocale;
    var sidePanelNVP = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_SIDE_PANEL, { canBeMissing: true })[0];
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, {
        canBeMissing: true,
        selector: function (modal) {
            return (modal === null || modal === void 0 ? void 0 : modal.type) === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SWIPEABLE_TO_RIGHT ||
                (modal === null || modal === void 0 ? void 0 : modal.type) === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE ||
                (modal === null || modal === void 0 ? void 0 : modal.type) === CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SMALL ||
                (modal === null || modal === void 0 ? void 0 : modal.type) === CONST_1.default.MODAL.MODAL_TYPE.CENTERED;
        },
    })[0], isModalCenteredVisible = _b === void 0 ? false : _b;
    var isLanguageUnsupported = preferredLocale !== CONST_1.default.LOCALES.EN;
    var isSidePanelVisible = isExtraLargeScreenWidth ? sidePanelNVP === null || sidePanelNVP === void 0 ? void 0 : sidePanelNVP.open : sidePanelNVP === null || sidePanelNVP === void 0 ? void 0 : sidePanelNVP.openNarrowScreen;
    // The Side Panel is hidden when:
    // - NVP is not set or it is false
    // - language is unsupported
    // - modal centered is visible
    var shouldHideSidePanel = !isSidePanelVisible || isLanguageUnsupported || isModalCenteredVisible || !sidePanelNVP;
    var isSidePanelHiddenOrLargeScreen = !isSidePanelVisible || isLanguageUnsupported || isExtraLargeScreenWidth || !sidePanelNVP;
    // The help button is hidden when:
    // - side pane nvp is not set
    // - Side Panel is displayed currently
    // - language is unsupported
    var shouldHideHelpButton = !sidePanelNVP || !shouldHideSidePanel || isLanguageUnsupported;
    var shouldHideSidePanelBackdrop = shouldHideSidePanel || isExtraLargeScreenWidth || shouldUseNarrowLayout;
    return {
        sidePanelNVP: sidePanelNVP,
        shouldHideSidePanel: shouldHideSidePanel,
        isSidePanelHiddenOrLargeScreen: isSidePanelHiddenOrLargeScreen,
        shouldHideHelpButton: shouldHideHelpButton,
        shouldHideSidePanelBackdrop: shouldHideSidePanelBackdrop,
    };
}
exports.default = useSidePanelDisplayStatus;
