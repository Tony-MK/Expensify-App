"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useDragAndDrop_1 = require("@hooks/useDragAndDrop");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const htmlDivElementRef_1 = require("@src/types/utils/htmlDivElementRef");
const viewRef_1 = require("@src/types/utils/viewRef");
function DropZoneWrapper({ onDrop, children }) {
    const styles = (0, useThemeStyles_1.default)();
    const dropZone = (0, react_1.useRef)(null);
    const { isDraggingOver } = (0, useDragAndDrop_1.default)({
        shouldAcceptDrop: (event) => !!event.dataTransfer?.types.some((type) => type === 'Files'),
        onDrop,
        shouldStopPropagation: false,
        shouldHandleDragEvent: false,
        dropZone: (0, htmlDivElementRef_1.default)(dropZone),
    });
    return (<react_native_1.View ref={(0, viewRef_1.default)(dropZone)} style={styles.flex1}>
            {children({ isDraggingOver })}
        </react_native_1.View>);
}
exports.default = DropZoneWrapper;
