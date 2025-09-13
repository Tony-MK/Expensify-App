"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const InteractiveStepSubHeader_1 = require("./InteractiveStepSubHeader");
const ScreenWrapper_1 = require("./ScreenWrapper");
function InteractiveStepWrapper({ children, wrapperID, handleBackButtonPress, headerTitle, headerSubtitle, startStepIndex, stepNames, shouldEnableMaxHeight, shouldShowOfflineIndicator, shouldEnablePickerAvoiding = false, offlineIndicatorStyle, shouldKeyboardOffsetBottomSafeAreaPadding, enableEdgeToEdgeBottomSafeAreaPadding, }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    return (<ScreenWrapper_1.default ref={ref} testID={wrapperID} includeSafeAreaPaddingBottom enableEdgeToEdgeBottomSafeAreaPadding={enableEdgeToEdgeBottomSafeAreaPadding} shouldEnablePickerAvoiding={shouldEnablePickerAvoiding} shouldEnableMaxHeight={shouldEnableMaxHeight} shouldShowOfflineIndicator={shouldShowOfflineIndicator} offlineIndicatorStyle={offlineIndicatorStyle} shouldKeyboardOffsetBottomSafeAreaPadding={shouldKeyboardOffsetBottomSafeAreaPadding}>
            <HeaderWithBackButton_1.default title={headerTitle} subtitle={headerSubtitle} onBackButtonPress={handleBackButtonPress}/>
            {!!stepNames && (<react_native_1.View style={[styles.ph5, styles.mb5, styles.mt3, { height: CONST_1.default.BANK_ACCOUNT.STEPS_HEADER_HEIGHT }]}>
                    <InteractiveStepSubHeader_1.default startStepIndex={startStepIndex} stepNames={stepNames}/>
                </react_native_1.View>)}
            {children}
        </ScreenWrapper_1.default>);
}
InteractiveStepWrapper.displayName = 'InteractiveStepWrapper';
exports.default = (0, react_1.forwardRef)(InteractiveStepWrapper);
