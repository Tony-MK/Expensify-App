"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetails = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function TimezoneInitialPage({ currentUserPersonalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const timezone = currentUserPersonalDetails?.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE;
    const { translate } = (0, useLocalize_1.default)();
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    /**
     * Updates setting for automatic timezone selection.
     * Note: If we are updating automatically, we'll immediately calculate the user's timezone.
     */
    const updateAutomaticTimezone = (isAutomatic) => {
        PersonalDetails.updateAutomaticTimezone({
            automatic: isAutomatic,
            selected: isAutomatic && !(0, EmptyObject_1.isEmptyObject)(currentTimezone) ? currentTimezone : timezone.selected,
        });
    };
    return (<ScreenWrapper_1.default testID={TimezoneInitialPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('timezonePage.timezone')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <react_native_1.View style={styles.flex1}>
                <react_native_1.View style={[styles.ph5]}>
                    <Text_1.default style={[styles.mb5]}>{translate('timezonePage.isShownOnProfile')}</Text_1.default>
                    <react_native_1.View style={[styles.flexRow, styles.mb5, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                        <Text_1.default style={[styles.flexShrink1, styles.mr2]}>{translate('timezonePage.getLocationAutomatically')}</Text_1.default>
                        <Switch_1.default accessibilityLabel={translate('timezonePage.getLocationAutomatically')} isOn={!!timezone.automatic} onToggle={updateAutomaticTimezone}/>
                    </react_native_1.View>
                </react_native_1.View>
                <MenuItemWithTopDescription_1.default title={timezone.selected} description={translate('timezonePage.timezone')} shouldShowRightIcon disabled={timezone.automatic} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_TIMEZONE_SELECT)}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
TimezoneInitialPage.displayName = 'TimezoneInitialPage';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(TimezoneInitialPage);
