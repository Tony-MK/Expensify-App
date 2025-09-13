"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const utils_1 = require("@components/Button/utils");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PopoverMenu_1 = require("@components/PopoverMenu");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
const PopoverAnchorTooltip_1 = require("@components/Tooltip/PopoverAnchorTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePopoverPosition_1 = require("@hooks/usePopoverPosition");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser_1 = require("@libs/Browser");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ThreeDotsMenu({ iconTooltip = 'common.more', icon = Expensicons.ThreeDots, iconFill, iconStyles, onIconPress = () => { }, menuItems, anchorPosition, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP, // we assume that popover menu opens below the button, anchor is at TOP
}, getAnchorPosition, shouldOverlay = false, shouldSetModalVisibility = true, disabled = false, hideProductTrainingTooltip, renderProductTrainingTooltipContent, shouldShowProductTrainingTooltip = false, isNested = false, shouldSelfPosition = false, threeDotsMenuRef, }) {
    const [modal] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true });
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isPopupMenuVisible, setPopupMenuVisible] = (0, react_1.useState)(false);
    const [restoreFocusType, setRestoreFocusType] = (0, react_1.useState)();
    const [position, setPosition] = (0, react_1.useState)();
    const buttonRef = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    const isBehindModal = modal?.willAlertModalBecomeVisible && !modal?.isPopover && !shouldOverlay;
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    const showPopoverMenu = () => {
        setPopupMenuVisible(true);
    };
    const hidePopoverMenu = (0, react_1.useCallback)((selectedItem) => {
        if (selectedItem && selectedItem.shouldKeepModalOpen) {
            return;
        }
        setPopupMenuVisible(false);
    }, []);
    (0, react_1.useImperativeHandle)(threeDotsMenuRef, () => ({
        isPopupMenuVisible,
        hidePopoverMenu,
    }));
    (0, react_1.useEffect)(() => {
        if (!isBehindModal || !isPopupMenuVisible) {
            return;
        }
        hidePopoverMenu();
    }, [hidePopoverMenu, isBehindModal, isPopupMenuVisible]);
    const { calculatePopoverPosition } = (0, usePopoverPosition_1.default)();
    const calculateAndSetThreeDotsMenuPosition = (0, react_1.useCallback)(() => calculatePopoverPosition(buttonRef, anchorAlignment), [anchorAlignment, calculatePopoverPosition]);
    const getMenuPosition = shouldSelfPosition ? calculateAndSetThreeDotsMenuPosition : getAnchorPosition;
    (0, react_1.useLayoutEffect)(() => {
        if (!getMenuPosition || !isPopupMenuVisible) {
            return;
        }
        getMenuPosition?.().then((value) => {
            setPosition(value);
        });
    }, [windowWidth, windowHeight, shouldSelfPosition, getMenuPosition, isPopupMenuVisible]);
    const onThreeDotsPress = () => {
        if (isPopupMenuVisible) {
            hidePopoverMenu();
            return;
        }
        hideProductTrainingTooltip?.();
        buttonRef.current?.blur();
        if (getMenuPosition) {
            getMenuPosition?.().then((value) => {
                setPosition(value);
                showPopoverMenu();
            });
        }
        else {
            showPopoverMenu();
        }
        onIconPress?.();
    };
    const TooltipToRender = shouldShowProductTrainingTooltip ? EducationalTooltip_1.default : PopoverAnchorTooltip_1.default;
    const tooltipProps = shouldShowProductTrainingTooltip
        ? {
            renderTooltipContent: renderProductTrainingTooltipContent,
            shouldRender: shouldShowProductTrainingTooltip,
            anchorAlignment: {
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            },
            shiftHorizontal: variables_1.default.savedSearchShiftHorizontal,
            shiftVertical: variables_1.default.savedSearchShiftVertical,
            wrapperStyle: [styles.mh4, styles.pv2, styles.productTrainingTooltipWrapper],
            onTooltipPress: onThreeDotsPress,
        }
        : { text: translate(iconTooltip), shouldRender: true };
    return (<>
            <react_native_1.View>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <TooltipToRender {...tooltipProps}>
                    <PressableWithoutFeedback_1.default onPress={onThreeDotsPress} disabled={disabled} onMouseDown={(e) => {
            /* Keep the focus state on mWeb like we did on the native apps. */
            if (!(0, Browser_1.isMobile)()) {
                return;
            }
            e.preventDefault();
        }} ref={buttonRef} style={[styles.touchableButtonImage, iconStyles]} role={(0, utils_1.getButtonRole)(isNested)} isNested={isNested} accessibilityLabel={translate(iconTooltip)}>
                        <Icon_1.default src={icon} fill={(iconFill ?? isPopupMenuVisible) ? theme.success : theme.icon}/>
                    </PressableWithoutFeedback_1.default>
                </TooltipToRender>
            </react_native_1.View>
            <PopoverMenu_1.default onClose={hidePopoverMenu} onModalHide={() => setRestoreFocusType(undefined)} isVisible={isPopupMenuVisible && !isBehindModal} anchorPosition={position ?? anchorPosition ?? { horizontal: 0, vertical: 0 }} anchorAlignment={anchorAlignment} onItemSelected={(item) => {
            setRestoreFocusType(CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.PRESERVE);
            hidePopoverMenu(item);
        }} menuItems={menuItems} withoutOverlay={!shouldOverlay} shouldSetModalVisibility={shouldSetModalVisibility} anchorRef={buttonRef} shouldEnableNewFocusManagement restoreFocusType={restoreFocusType}/>
        </>);
}
ThreeDotsMenu.displayName = 'ThreeDotsMenu';
exports.default = ThreeDotsMenu;
