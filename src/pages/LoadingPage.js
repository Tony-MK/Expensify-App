"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function LoadingPage({ onBackButtonPress, title }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<ScreenWrapper_1.default testID={LoadingPage.displayName}>
            <HeaderWithBackButton_1.default onBackButtonPress={onBackButtonPress} shouldShowBackButton title={title}/>
            <FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>
        </ScreenWrapper_1.default>);
}
LoadingPage.displayName = 'LoadingPage';
exports.default = LoadingPage;
