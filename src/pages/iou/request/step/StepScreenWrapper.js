"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const callOrReturn_1 = require("@src/types/utils/callOrReturn");
function StepScreenWrapper({ testID, headerTitle, onBackButtonPress, onEntryTransitionEnd, children, shouldShowWrapper, shouldShowNotFoundPage, includeSafeAreaPaddingBottom, shouldShowOfflineIndicator = true, shouldEnableKeyboardAvoidingView = true, }) {
    const styles = (0, useThemeStyles_1.default)();
    if (!shouldShowWrapper) {
        return <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundPage}>{children}</FullPageNotFoundView_1.default>;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={includeSafeAreaPaddingBottom} onEntryTransitionEnd={onEntryTransitionEnd} testID={testID} shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} shouldShowOfflineIndicator={shouldShowOfflineIndicator} shouldEnableKeyboardAvoidingView={shouldEnableKeyboardAvoidingView}>
            {({ insets, safeAreaPaddingBottomStyle, didScreenTransitionEnd }) => (<FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundPage}>
                    <react_native_1.View style={[styles.flex1]}>
                        <HeaderWithBackButton_1.default title={headerTitle} onBackButtonPress={onBackButtonPress}/>
                        {
            // If props.children is a function, call it to provide the insets to the children
            (0, callOrReturn_1.default)(children, { insets, safeAreaPaddingBottomStyle, didScreenTransitionEnd })}
                    </react_native_1.View>
                </FullPageNotFoundView_1.default>)}
        </ScreenWrapper_1.default>);
}
exports.default = StepScreenWrapper;
