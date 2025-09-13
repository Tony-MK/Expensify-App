"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useDragAndDrop_1 = require("@hooks/useDragAndDrop");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const htmlDivElementRef_1 = require("@src/types/utils/htmlDivElementRef");
const viewRef_1 = require("@src/types/utils/viewRef");
function TransparentOverlay({ onPress: onPressProp }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const dropZone = (0, react_1.useRef)(null);
    const { isDraggingOver } = (0, useDragAndDrop_1.default)({
        // eslint-disable-next-line react-compiler/react-compiler
        dropZone: (0, htmlDivElementRef_1.default)(dropZone),
        onDrop: () => { },
    });
    const onPress = (0, react_1.useCallback)((event) => {
        event?.preventDefault();
        onPressProp();
    }, [onPressProp]);
    const handlePointerDown = (0, react_1.useCallback)((e) => {
        e?.preventDefault();
    }, []);
    // The overlay is a semi-transparent layer that covers the entire screen and is used to close a modal when clicked.
    // The touch event passes through the transparent overlay to the elements underneath, so we need to prevent that by adding a nearly invisible background color to the overlay.
    const overlay = (0, react_1.useMemo)(() => ({
        backgroundColor: 'rgba(0, 0, 0, 0.005)',
    }), []);
    return (<react_native_1.View onPointerDown={handlePointerDown} style={[styles.fullScreen, isDraggingOver && styles.dNone]} 
    // eslint-disable-next-line react-compiler/react-compiler
    ref={(0, viewRef_1.default)(dropZone)}>
            <PressableWithoutFeedback_1.default onPress={onPress} style={[styles.flex1, styles.cursorDefault, overlay]} accessibilityLabel={translate('common.close')} role={CONST_1.default.ROLE.BUTTON}/>
        </react_native_1.View>);
}
exports.default = TransparentOverlay;
