"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Displays the user's local time and updates it every minute.
 * The time auto-update logic is extracted to this component to avoid re-rendering a more complex component, e.g. DetailsPage.
 */
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const MenuItemWithTopDescription_1 = require("./MenuItemWithTopDescription");
function AutoUpdateTime({ timezone }) {
    const { translate, getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    /** @returns Returns the locale Date object */
    const getCurrentUserLocalTime = (0, react_1.useCallback)(() => getLocalDateFromDatetime(undefined, timezone.selected), [getLocalDateFromDatetime, timezone.selected]);
    const [currentUserLocalTime, setCurrentUserLocalTime] = (0, react_1.useState)(getCurrentUserLocalTime);
    const minuteRef = (0, react_1.useRef)(new Date().getMinutes());
    const timezoneName = (0, react_1.useMemo)(() => {
        if (timezone.selected) {
            return DateUtils_1.default.getZoneAbbreviation(currentUserLocalTime, timezone.selected);
        }
        return '';
    }, [currentUserLocalTime, timezone.selected]);
    (0, react_1.useEffect)(() => {
        // If any of the props that getCurrentUserLocalTime depends on change, we want to update the displayed time immediately
        setCurrentUserLocalTime(getCurrentUserLocalTime());
        // Also, if the user leaves this page open, we want to make sure the displayed time is updated every minute when the clock changes
        // To do this we create an interval to check if the minute has changed every second and update the displayed time if it has
        const interval = setInterval(() => {
            const currentMinute = new Date().getMinutes();
            if (currentMinute !== minuteRef.current) {
                setCurrentUserLocalTime(getCurrentUserLocalTime());
                minuteRef.current = currentMinute;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [getCurrentUserLocalTime]);
    return (<react_native_1.View style={[styles.w100, styles.detailsPageSectionContainer]}>
            <MenuItemWithTopDescription_1.default style={[styles.ph0]} title={`${DateUtils_1.default.formatToLocalTime(currentUserLocalTime)} ${timezoneName}`} description={translate('detailsPage.localTime')} interactive={false}/>
        </react_native_1.View>);
}
AutoUpdateTime.displayName = 'AutoUpdateTime';
exports.default = AutoUpdateTime;
