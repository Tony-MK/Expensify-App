"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderGap_1 = require("@components/HeaderGap");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useRefreshKeyAfterInteraction_1 = require("@hooks/useRefreshKeyAfterInteraction");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function TestDriveBanner({ onPress }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // Forcing a key change here forces React to fully re-mount this component
    // This helps reset the underlying drag region boundaries so that
    // interactive elements (like buttons) become clickable again after certain UI changes.
    // Without this, the OS-level drag region overlap clickable elements,
    // making them unresponsive until the container is refreshed.
    // For more context: https://github.com/Expensify/App/issues/68139
    const key = (0, useRefreshKeyAfterInteraction_1.default)('test-drive-banner');
    return (<react_native_1.View style={[styles.highlightBG]} dataSet={{ dragArea: false }} key={key}>
            <HeaderGap_1.default styles={styles.testDriveBannerGap}/>
            <react_native_1.View style={[styles.gap2, styles.alignItemsCenter, styles.flexRow, styles.justifyContentCenter, styles.h10]}>
                <Text_1.default>
                    {shouldUseNarrowLayout
            ? translate('testDrive.banner.currentlyTestDrivingExpensify')
            : `${translate('testDrive.banner.currentlyTestDrivingExpensify')}. ${translate('testDrive.banner.readyForTheRealThing')}`}
                </Text_1.default>
                <Button_1.default text={translate('testDrive.banner.getStarted')} small success onPress={onPress}/>
            </react_native_1.View>
        </react_native_1.View>);
}
TestDriveBanner.displayName = 'TestDriveBanner';
exports.default = TestDriveBanner;
