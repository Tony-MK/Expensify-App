"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-compiler/react-compiler */
const react_1 = require("react");
const react_native_1 = require("react-native");
const FocusTrapForModal_1 = require("@components/FocusTrap/FocusTrapForModal");
const PopoverWithMeasuredContent_1 = require("@components/PopoverWithMeasuredContent");
const withViewportOffsetTop_1 = require("@components/withViewportOffsetTop");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const Browser_1 = require("@libs/Browser");
const calculateAnchorPosition_1 = require("@libs/calculateAnchorPosition");
const DomUtils_1 = require("@libs/DomUtils");
const Modal_1 = require("@userActions/Modal");
const CONST_1 = require("@src/CONST");
const keyboard_1 = require("@src/utils/keyboard");
const EmojiPickerMenu_1 = require("./EmojiPickerMenu");
const DEFAULT_ANCHOR_ORIGIN = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
};
function EmojiPicker({ viewportOffsetTop }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = (0, react_1.useState)(false);
    const [emojiPopoverAnchorPosition, setEmojiPopoverAnchorPosition] = (0, react_1.useState)({
        horizontal: 0,
        vertical: 0,
    });
    const [emojiPopoverAnchorOrigin, setEmojiPopoverAnchorOrigin] = (0, react_1.useState)(DEFAULT_ANCHOR_ORIGIN);
    const [isWithoutOverlay, setIsWithoutOverlay] = (0, react_1.useState)(true);
    const [activeID, setActiveID] = (0, react_1.useState)();
    const emojiPopoverAnchorRef = (0, react_1.useRef)(null);
    const emojiAnchorDimension = (0, react_1.useRef)({
        width: 0,
        height: 0,
    });
    const onModalHide = (0, react_1.useRef)(() => { });
    const onEmojiSelected = (0, react_1.useRef)(() => { });
    const activeEmoji = (0, react_1.useRef)(undefined);
    const emojiSearchInput = (0, react_1.useRef)(null);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    /**
     * Get the popover anchor ref
     *
     * emojiPopoverAnchorRef contains either null or the ref object of the anchor element.
     * { current: { current: anchorElement } }
     *
     * Don't directly get the ref from emojiPopoverAnchorRef, instead use getEmojiPopoverAnchor()
     */
    const getEmojiPopoverAnchor = (0, react_1.useCallback)(() => emojiPopoverAnchorRef.current ?? emojiPopoverAnchorRef, []);
    /**
     * Show the emoji picker menu.
     *
     * @param [onModalHideValue=() => {}] - Run a callback when Modal hides.
     * @param [onEmojiSelectedValue=() => {}] - Run a callback when Emoji selected.
     * @param emojiPopoverAnchorValue - Element to which Popover is anchored
     * @param [anchorOrigin=DEFAULT_ANCHOR_ORIGIN] - Anchor origin for Popover
     * @param [onWillShow] - Run a callback when Popover will show
     * @param id - Unique id for EmojiPicker
     * @param activeEmojiValue - Selected emoji to be highlighted
     */
    const showEmojiPicker = (onModalHideValue, onEmojiSelectedValue, emojiPopoverAnchorValue, anchorOrigin, onWillShow, id, activeEmojiValue, withoutOverlay = true) => {
        onModalHide.current = onModalHideValue;
        onEmojiSelected.current = onEmojiSelectedValue;
        activeEmoji.current = activeEmojiValue;
        setIsWithoutOverlay(withoutOverlay);
        emojiPopoverAnchorRef.current = emojiPopoverAnchorValue;
        const emojiPopoverAnchor = getEmojiPopoverAnchor();
        // Drop focus to avoid blue focus ring.
        emojiPopoverAnchor?.current?.blur();
        const anchorOriginValue = anchorOrigin ?? DEFAULT_ANCHOR_ORIGIN;
        // It's possible that the anchor is inside an active modal (e.g., add emoji reaction in report context menu).
        // So, we need to get the anchor position first before closing the active modal which will also destroy the anchor.
        keyboard_1.default.dismiss().then(() => (0, calculateAnchorPosition_1.default)(emojiPopoverAnchor?.current, anchorOriginValue).then((value) => {
            (0, Modal_1.close)(() => {
                onWillShow?.();
                setIsEmojiPickerVisible(true);
                setEmojiPopoverAnchorPosition({
                    horizontal: value.horizontal,
                    vertical: value.vertical,
                });
                emojiAnchorDimension.current = {
                    width: value.width,
                    height: value.height,
                };
                setEmojiPopoverAnchorOrigin(anchorOriginValue);
                setActiveID(id);
            });
        }));
    };
    /**
     * Hide the emoji picker menu.
     */
    const hideEmojiPicker = (isNavigating) => {
        const activeElementId = DomUtils_1.default.getActiveElement()?.id;
        if (activeElementId !== CONST_1.default.COMPOSER.NATIVE_ID) {
            (0, blurActiveElement_1.default)();
        }
        const currOnModalHide = onModalHide.current;
        onModalHide.current = () => {
            if (currOnModalHide) {
                currOnModalHide(!!isNavigating);
            }
            emojiPopoverAnchorRef.current = null;
        };
        setIsEmojiPickerVisible(false);
    };
    /**
     * Focus the search input in the emoji picker.
     */
    const focusEmojiSearchInput = () => {
        if (!emojiSearchInput.current) {
            return;
        }
        emojiSearchInput.current.focus();
    };
    /**
     * Callback for the emoji picker to add whatever emoji is chosen into the main input
     */
    const selectEmoji = (emoji, emojiObject) => {
        // Prevent fast click / multiple emoji selection;
        // The first click will hide the emoji picker by calling the hideEmojiPicker() function
        if (!isEmojiPickerVisible) {
            return;
        }
        hideEmojiPicker(false);
        if (typeof onEmojiSelected.current === 'function') {
            onEmojiSelected.current(emoji, emojiObject);
        }
    };
    /**
     * Whether emoji picker is active for the given id.
     */
    const isActive = (id) => !!id && id === activeID;
    const clearActive = () => setActiveID(null);
    const resetEmojiPopoverAnchor = () => (emojiPopoverAnchorRef.current = null);
    (0, react_1.useImperativeHandle)(ref, () => ({ showEmojiPicker, isActive, clearActive, hideEmojiPicker, isEmojiPickerVisible, resetEmojiPopoverAnchor }));
    (0, react_1.useEffect)(() => {
        const emojiPopoverDimensionListener = react_native_1.Dimensions.addEventListener('change', () => {
            const emojiPopoverAnchor = getEmojiPopoverAnchor();
            if (!emojiPopoverAnchor?.current) {
                // In small screen width, the window size change might be due to keyboard open/hide, we should avoid hide EmojiPicker in those cases
                if (isEmojiPickerVisible && !shouldUseNarrowLayout) {
                    hideEmojiPicker();
                }
                return;
            }
            (0, calculateAnchorPosition_1.default)(emojiPopoverAnchor?.current, emojiPopoverAnchorOrigin).then((value) => {
                setEmojiPopoverAnchorPosition({
                    horizontal: value.horizontal,
                    vertical: value.vertical,
                });
                emojiAnchorDimension.current = {
                    width: value.width,
                    height: value.height,
                };
            });
        });
        return () => {
            if (!emojiPopoverDimensionListener) {
                return;
            }
            emojiPopoverDimensionListener.remove();
        };
    }, [isEmojiPickerVisible, shouldUseNarrowLayout, emojiPopoverAnchorOrigin, getEmojiPopoverAnchor]);
    return (<PopoverWithMeasuredContent_1.default shouldHandleNavigationBack={(0, Browser_1.isMobileChrome)()} isVisible={isEmojiPickerVisible} onClose={hideEmojiPicker} onModalShow={focusEmojiSearchInput} onModalHide={onModalHide.current} shouldSetModalVisibility={false} anchorPosition={{
            vertical: emojiPopoverAnchorPosition.vertical,
            horizontal: emojiPopoverAnchorPosition.horizontal,
        }} anchorRef={getEmojiPopoverAnchor()} withoutOverlay={isWithoutOverlay} popoverDimensions={{
            width: CONST_1.default.EMOJI_PICKER_SIZE.WIDTH,
            height: CONST_1.default.EMOJI_PICKER_SIZE.HEIGHT,
        }} anchorAlignment={emojiPopoverAnchorOrigin} outerStyle={StyleUtils.getOuterModalStyle(windowHeight, viewportOffsetTop)} innerContainerStyle={styles.popoverInnerContainer} anchorDimensions={emojiAnchorDimension.current} avoidKeyboard shouldSwitchPositionIfOverflow shouldEnableNewFocusManagement restoreFocusType={CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DELETE} shouldSkipRemeasurement>
            <FocusTrapForModal_1.default active={isEmojiPickerVisible}>
                <react_native_1.View>
                    <EmojiPickerMenu_1.default onEmojiSelected={selectEmoji} activeEmoji={activeEmoji.current} ref={(el) => {
            emojiSearchInput.current = el;
        }}/>
                </react_native_1.View>
            </FocusTrapForModal_1.default>
        </PopoverWithMeasuredContent_1.default>);
}
EmojiPicker.displayName = 'EmojiPicker';
exports.default = (0, withViewportOffsetTop_1.default)((0, react_1.forwardRef)(EmojiPicker));
