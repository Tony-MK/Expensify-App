"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_draggable_flatlist_1 = require("react-native-draggable-flatlist");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function DraggableList({ ref, ...viewProps }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_draggable_flatlist_1.default ref={ref} containerStyle={styles.flex1} contentContainerStyle={styles.flexGrow1} ListFooterComponentStyle={styles.flex1} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewProps}/>);
}
DraggableList.displayName = 'DraggableList';
exports.default = DraggableList;
