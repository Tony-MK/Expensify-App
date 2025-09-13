"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Illustrations = require("@components/Icon/Illustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const BlockingView_1 = require("./BlockingView");
const ForceFullScreenView_1 = require("./ForceFullScreenView");
// eslint-disable-next-line rulesdir/no-negated-variables
function FullPageErrorView({ testID, children = null, shouldShow = false, title = '', subtitle = '', shouldForceFullScreen = false, subtitleStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    if (shouldShow) {
        return (<ForceFullScreenView_1.default shouldForceFullScreen={shouldForceFullScreen}>
                <react_native_1.View style={[styles.flex1, styles.blockingErrorViewContainer]} testID={testID}>
                    <BlockingView_1.default icon={Illustrations.BrokenMagnifyingGlass} iconWidth={variables_1.default.errorPageIconWidth} iconHeight={variables_1.default.errorPageIconHeight} title={title} subtitle={subtitle} subtitleStyle={subtitleStyle}/>
                </react_native_1.View>
            </ForceFullScreenView_1.default>);
    }
    return children;
}
FullPageErrorView.displayName = 'FullPageErrorView';
exports.default = FullPageErrorView;
