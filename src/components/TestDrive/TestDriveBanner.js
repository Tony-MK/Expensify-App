"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var HeaderGap_1 = require("@components/HeaderGap");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useRefreshKeyAfterInteraction_1 = require("@hooks/useRefreshKeyAfterInteraction");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
function TestDriveBanner(_a) {
    var onPress = _a.onPress;
    var styles = (0, useThemeStyles_1.default)();
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var translate = (0, useLocalize_1.default)().translate;
    // Forcing a key change here forces React to fully re-mount this component
    // This helps reset the underlying drag region boundaries so that
    // interactive elements (like buttons) become clickable again after certain UI changes.
    // Without this, the OS-level drag region overlap clickable elements,
    // making them unresponsive until the container is refreshed.
    // For more context: https://github.com/Expensify/App/issues/68139
    var key = (0, useRefreshKeyAfterInteraction_1.default)('test-drive-banner');
    return (<react_native_1.View style={[styles.highlightBG]} dataSet={{ dragArea: false }} key={key}>
            <HeaderGap_1.default styles={styles.testDriveBannerGap}/>
            <react_native_1.View style={[styles.gap2, styles.alignItemsCenter, styles.flexRow, styles.justifyContentCenter, styles.h10]}>
                <Text_1.default>
                    {shouldUseNarrowLayout
            ? translate('testDrive.banner.currentlyTestDrivingExpensify')
            : "".concat(translate('testDrive.banner.currentlyTestDrivingExpensify'), ". ").concat(translate('testDrive.banner.readyForTheRealThing'))}
                </Text_1.default>
                <Button_1.default text={translate('testDrive.banner.getStarted')} small success onPress={onPress}/>
            </react_native_1.View>
        </react_native_1.View>);
}
TestDriveBanner.displayName = 'TestDriveBanner';
exports.default = TestDriveBanner;
