"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragAndDropContext = void 0;
/* eslint-disable react-compiler/react-compiler */
const portal_1 = require("@gorhom/portal");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useDragAndDrop_1 = require("@hooks/useDragAndDrop");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const htmlDivElementRef_1 = require("@src/types/utils/htmlDivElementRef");
const viewRef_1 = require("@src/types/utils/viewRef");
const DragAndDropContext = react_1.default.createContext({});
exports.DragAndDropContext = DragAndDropContext;
function shouldAcceptDrop(event) {
    return !!event.dataTransfer?.types.some((type) => type === 'Files');
}
function DragAndDropProvider({ children, isDisabled = false, setIsDraggingOver = () => { } }) {
    const styles = (0, useThemeStyles_1.default)();
    const dropZone = (0, react_1.useRef)(null);
    const dropZoneID = (0, react_1.useRef)(expensify_common_1.Str.guid('drag-n-drop'));
    const onDropHandler = (0, react_1.useRef)(() => { });
    const setOnDropHandler = (0, react_1.useCallback)((callback) => {
        onDropHandler.current = callback;
    }, []);
    const { isDraggingOver } = (0, useDragAndDrop_1.default)({
        dropZone: (0, htmlDivElementRef_1.default)(dropZone),
        onDrop: onDropHandler.current,
        shouldAcceptDrop,
        isDisabled,
    });
    (0, react_1.useEffect)(() => {
        setIsDraggingOver(isDraggingOver);
    }, [isDraggingOver, setIsDraggingOver]);
    const contextValue = (0, react_1.useMemo)(() => ({ isDraggingOver, setOnDropHandler, dropZoneID: dropZoneID.current }), [isDraggingOver, setOnDropHandler]);
    return (<DragAndDropContext.Provider value={contextValue}>
            <react_native_1.View ref={(0, viewRef_1.default)(dropZone)} style={[styles.flex1, styles.w100, styles.h100]}>
                {isDraggingOver && (<react_native_1.View style={[styles.fullScreen, styles.invisibleOverlay]}>
                        <portal_1.PortalHost name={dropZoneID.current}/>
                    </react_native_1.View>)}
                {children}
            </react_native_1.View>
        </DragAndDropContext.Provider>);
}
DragAndDropProvider.displayName = 'DragAndDropProvider';
exports.default = DragAndDropProvider;
