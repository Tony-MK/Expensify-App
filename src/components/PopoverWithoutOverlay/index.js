"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ColorSchemeWrapper_1 = require("@components/ColorSchemeWrapper");
const PopoverProvider_1 = require("@components/PopoverProvider");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Modal_1 = require("@libs/actions/Modal");
const variables_1 = require("@styles/variables");
const viewRef_1 = require("@src/types/utils/viewRef");
const NOOP = () => { };
function PopoverWithoutOverlay({ anchorPosition = {}, anchorRef, withoutOverlayRef, innerContainerStyle = {}, outerStyle, onModalShow = () => { }, isVisible, onClose, onModalHide = () => { }, children, }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { onOpen, close } = (0, react_1.useContext)(PopoverProvider_1.PopoverContext);
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    const insets = (0, useSafeAreaInsets_1.default)();
    const { modalStyle, modalContainerStyle, shouldAddTopSafeAreaMargin, shouldAddBottomSafeAreaMargin, shouldAddTopSafeAreaPadding, shouldAddBottomSafeAreaPadding } = StyleUtils.getModalStyles('popover', {
        windowWidth,
        windowHeight,
        isSmallScreenWidth: false,
    }, anchorPosition, innerContainerStyle, outerStyle);
    (0, react_1.useEffect)(() => {
        let removeOnClose;
        if (isVisible) {
            onModalShow();
            onOpen?.({
                ref: withoutOverlayRef,
                close: onClose ?? NOOP,
                anchorRef,
            });
            removeOnClose = (0, Modal_1.setCloseModal)(onClose ?? NOOP);
        }
        else {
            onModalHide();
            close(anchorRef);
            (0, Modal_1.onModalDidClose)();
        }
        (0, Modal_1.willAlertModalBecomeVisible)(isVisible, true);
        return () => {
            if (!removeOnClose) {
                return;
            }
            removeOnClose();
        };
        // We want this effect to run strictly ONLY when isVisible prop changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isVisible]);
    const modalPaddingStyles = (0, react_1.useMemo)(() => StyleUtils.getModalPaddingStyles({
        shouldAddBottomSafeAreaMargin,
        shouldAddTopSafeAreaMargin,
        shouldAddBottomSafeAreaPadding,
        shouldAddTopSafeAreaPadding,
        modalContainerStyle,
        insets,
    }), [StyleUtils, insets, modalContainerStyle, shouldAddBottomSafeAreaMargin, shouldAddBottomSafeAreaPadding, shouldAddTopSafeAreaMargin, shouldAddTopSafeAreaPadding]);
    if (!isVisible) {
        return null;
    }
    return (<react_native_1.View style={[modalStyle, { zIndex: variables_1.default.popoverZIndex }]} ref={(0, viewRef_1.default)(withoutOverlayRef)} 
    // Prevent the parent element to capture a click. This is useful when the modal component is put inside a pressable.
    onClick={(e) => e.stopPropagation()} dataSet={{ dragArea: false }}>
            <react_native_1.View style={{
            ...styles.defaultModalContainer,
            ...modalContainerStyle,
            ...modalPaddingStyles,
        }} ref={ref}>
                <ColorSchemeWrapper_1.default>{children}</ColorSchemeWrapper_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
PopoverWithoutOverlay.displayName = 'PopoverWithoutOverlay';
exports.default = (0, react_1.forwardRef)(PopoverWithoutOverlay);
