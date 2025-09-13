"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
// @ts-expect-error This is a workaround to display HelpPane on top of everything,
// Modal from react-native can't be used here, as it would block interactions with the rest of the app
const ModalPortal_1 = require("react-native-web/dist/exports/Modal/ModalPortal");
const ColorSchemeWrapper_1 = require("@components/ColorSchemeWrapper");
const FocusTrapForModal_1 = require("@components/FocusTrap/FocusTrapForModal");
const HelpContent_1 = require("@components/SidePanel/HelpComponents/HelpContent");
const HelpOverlay_1 = require("@components/SidePanel/HelpComponents/HelpOverlay");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ComposerFocusManager_1 = require("@libs/ComposerFocusManager");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function Help({ sidePanelTranslateX, closeSidePanel, shouldHideSidePanelBackdrop }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isExtraLargeScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { paddingTop, paddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const [isRHPVisible = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { selector: (modal) => modal?.type === CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED, canBeMissing: true });
    const uniqueModalId = (0, react_1.useMemo)(() => ComposerFocusManager_1.default.getId(), []);
    const onCloseSidePanelOnSmallScreens = () => {
        if (isExtraLargeScreenWidth) {
            return;
        }
        closeSidePanel();
    };
    // Close Side Panel on escape key press
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE, () => closeSidePanel(), { isActive: !isExtraLargeScreenWidth, shouldBubble: false });
    // Close Side Panel on debug key press i.e. opening the TestTools modal
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.DEBUG, () => closeSidePanel(), { shouldBubble: true });
    // Close Side Panel on small screens when navigation keyboard shortcuts are used
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.SEARCH, onCloseSidePanelOnSmallScreens, { shouldBubble: true });
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.NEW_CHAT, onCloseSidePanelOnSmallScreens, { shouldBubble: true });
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.SHORTCUTS, onCloseSidePanelOnSmallScreens, { shouldBubble: true });
    // Web back button: push history state and close Side Panel on popstate
    (0, react_1.useEffect)(() => {
        ComposerFocusManager_1.default.resetReadyToFocus(uniqueModalId);
        return () => {
            ComposerFocusManager_1.default.setReadyToFocus(uniqueModalId);
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return (<ModalPortal_1.default>
            <FocusTrapForModal_1.default active={!isExtraLargeScreenWidth}>
                <react_native_1.View style={styles.sidePanelContainer}>
                    <react_native_1.View>
                        {!shouldHideSidePanelBackdrop && (<HelpOverlay_1.default onBackdropPress={closeSidePanel} isRHPVisible={isRHPVisible}/>)}
                    </react_native_1.View>
                    <ColorSchemeWrapper_1.default>
                        <react_native_1.Animated.View style={[
            styles.sidePanelContent(shouldUseNarrowLayout, isExtraLargeScreenWidth),
            { transform: [{ translateX: sidePanelTranslateX.current }], paddingTop, paddingBottom },
        ]}>
                            <HelpContent_1.default closeSidePanel={closeSidePanel}/>
                        </react_native_1.Animated.View>
                    </ColorSchemeWrapper_1.default>
                </react_native_1.View>
            </FocusTrapForModal_1.default>
        </ModalPortal_1.default>);
}
Help.displayName = 'Help';
exports.default = Help;
