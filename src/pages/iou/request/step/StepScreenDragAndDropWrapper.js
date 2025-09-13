"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Provider_1 = require("@components/DragAndDrop/Provider");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const callOrReturn_1 = require("@src/types/utils/callOrReturn");
function StepScreenDragAndDropWrapper({ testID, headerTitle, onBackButtonPress, onEntryTransitionEnd, children, shouldShowWrapper }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isDraggingOver, setIsDraggingOver] = (0, react_1.useState)(false);
    if (!shouldShowWrapper) {
        return (0, callOrReturn_1.default)(children, false);
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} onEntryTransitionEnd={onEntryTransitionEnd} testID={testID} shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} headerGapStyles={isDraggingOver ? styles.dropWrapper : []}>
            {({ safeAreaPaddingBottomStyle }) => (<Provider_1.default setIsDraggingOver={setIsDraggingOver}>
                    <react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                        <HeaderWithBackButton_1.default title={headerTitle} onBackButtonPress={onBackButtonPress}/>
                        {(0, callOrReturn_1.default)(children, isDraggingOver)}
                    </react_native_1.View>
                </Provider_1.default>)}
        </ScreenWrapper_1.default>);
}
StepScreenDragAndDropWrapper.displayName = 'StepScreenDragAndDropWrapper';
exports.default = StepScreenDragAndDropWrapper;
