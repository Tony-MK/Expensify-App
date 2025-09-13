"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
const ArrowIcon_1 = require("./ArrowIcon");
const Day_1 = require("./Day");
const generateMonthMatrix_1 = require("./generateMonthMatrix");
const YearPickerModal_1 = require("./YearPickerModal");
function getInitialCurrentDateView(value, minDate, maxDate) {
    let initialCurrentDateView = typeof value === 'string' ? (0, date_fns_1.parseISO)(value) : new Date(value);
    if (maxDate < initialCurrentDateView) {
        initialCurrentDateView = maxDate;
    }
    else if (minDate > initialCurrentDateView) {
        initialCurrentDateView = minDate;
    }
    return initialCurrentDateView;
}
function CalendarPicker({ value = new Date(), minDate = (0, date_fns_1.setYear)(new Date(), CONST_1.default.CALENDAR_PICKER.MIN_YEAR), maxDate = (0, date_fns_1.setYear)(new Date(), CONST_1.default.CALENDAR_PICKER.MAX_YEAR), onSelected, DayComponent = Day_1.default, selectableDates, }) {
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const themeStyles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const pressableRef = (0, react_1.useRef)(null);
    const [currentDateView, setCurrentDateView] = (0, react_1.useState)(() => getInitialCurrentDateView(value, minDate, maxDate));
    const [isYearPickerVisible, setIsYearPickerVisible] = (0, react_1.useState)(false);
    const isFirstRender = (0, react_1.useRef)(true);
    const currentMonthView = currentDateView.getMonth();
    const currentYearView = currentDateView.getFullYear();
    const calendarDaysMatrix = (0, generateMonthMatrix_1.default)(currentYearView, currentMonthView);
    const initialHeight = (calendarDaysMatrix?.length || CONST_1.default.MAX_CALENDAR_PICKER_ROWS) * CONST_1.default.CALENDAR_PICKER_DAY_HEIGHT;
    const heightValue = (0, react_native_reanimated_1.useSharedValue)(initialHeight);
    const minYear = (0, date_fns_1.getYear)(new Date(minDate));
    const maxYear = (0, date_fns_1.getYear)(new Date(maxDate));
    const [years, setYears] = (0, react_1.useState)(() => Array.from({ length: maxYear - minYear + 1 }, (v, i) => i + minYear).map((year) => ({
        text: year.toString(),
        value: year,
        keyForList: year.toString(),
        isSelected: year === currentDateView.getFullYear(),
    })));
    const onYearSelected = (year) => {
        setCurrentDateView((prev) => {
            const newCurrentDateView = (0, date_fns_1.setYear)(new Date(prev), year);
            setYears((prevYears) => prevYears.map((item) => ({
                ...item,
                isSelected: item.value === newCurrentDateView.getFullYear(),
            })));
            return newCurrentDateView;
        });
        requestAnimationFrame(() => setIsYearPickerVisible(false));
    };
    /**
     * Calls the onSelected function with the selected date.
     * @param day - The day of the month that was selected.
     */
    const onDayPressed = (day) => {
        setCurrentDateView((prev) => {
            const newCurrentDateView = (0, date_fns_1.setDate)(new Date(prev), day);
            onSelected?.((0, date_fns_1.format)(new Date(newCurrentDateView), CONST_1.default.DATE.FNS_FORMAT_STRING));
            return newCurrentDateView;
        });
    };
    /**
     * Handles the user pressing the previous month arrow of the calendar picker.
     */
    const moveToPrevMonth = () => {
        setCurrentDateView((prev) => {
            const prevMonth = (0, date_fns_1.subMonths)(new Date(prev), 1);
            // if year is subtracted, we need to update the years list
            if (prevMonth.getFullYear() < prev.getFullYear()) {
                setYears((prevYears) => prevYears.map((item) => ({
                    ...item,
                    isSelected: item.value === prevMonth.getFullYear(),
                })));
            }
            return prevMonth;
        });
    };
    /**
     * Handles the user pressing the next month arrow of the calendar picker.
     */
    const moveToNextMonth = () => {
        setCurrentDateView((prev) => {
            const nextMonth = (0, date_fns_1.addMonths)(new Date(prev), 1);
            // if year is added, we need to update the years list
            if (nextMonth.getFullYear() > prev.getFullYear()) {
                setYears((prevYears) => prevYears.map((item) => ({
                    ...item,
                    isSelected: item.value === nextMonth.getFullYear(),
                })));
            }
            return nextMonth;
        });
    };
    const monthNames = DateUtils_1.default.getMonthNames().map((month) => expensify_common_1.Str.recapitalize(month));
    const daysOfWeek = DateUtils_1.default.getDaysOfWeek().map((day) => day.toUpperCase());
    const hasAvailableDatesNextMonth = (0, date_fns_1.startOfDay)(new Date(maxDate)) > (0, date_fns_1.endOfMonth)(new Date(currentDateView));
    const hasAvailableDatesPrevMonth = (0, date_fns_1.endOfDay)(new Date(minDate)) < (0, date_fns_1.startOfMonth)(new Date(currentDateView));
    (0, react_1.useEffect)(() => {
        if (isSmallScreenWidth || isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const rowCount = calendarDaysMatrix?.length || CONST_1.default.MAX_CALENDAR_PICKER_ROWS;
        const newHeight = rowCount * CONST_1.default.CALENDAR_PICKER_DAY_HEIGHT;
        heightValue.set((0, react_native_reanimated_1.withTiming)(newHeight, { duration: 50 }));
    }, [calendarDaysMatrix, heightValue, isSmallScreenWidth]);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            height: heightValue.get(),
        };
    });
    const webOnlyMarginStyle = isSmallScreenWidth ? {} : styles.mh1;
    const calendarContainerStyle = isSmallScreenWidth ? [webOnlyMarginStyle, themeStyles.calendarBodyContainer] : [webOnlyMarginStyle, animatedStyle];
    return (<react_native_1.View style={[themeStyles.pb4]}>
            <react_native_1.View style={[themeStyles.calendarHeader, themeStyles.flexRow, themeStyles.justifyContentBetween, themeStyles.alignItemsCenter, themeStyles.ph5]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                <PressableWithFeedback_1.default onPress={() => {
            pressableRef?.current?.blur();
            setIsYearPickerVisible(true);
        }} ref={pressableRef} style={[themeStyles.alignItemsCenter, themeStyles.flexRow, themeStyles.flex1, themeStyles.justifyContentStart]} wrapperStyle={[themeStyles.alignItemsCenter]} hoverDimmingValue={1} disabled={years.length <= 1} testID="currentYearButton" accessibilityLabel={translate('common.currentYear')}>
                    <Text_1.default style={themeStyles.sidebarLinkTextBold} testID="currentYearText" accessibilityLabel={translate('common.currentYear')}>
                        {currentYearView}
                    </Text_1.default>
                    <ArrowIcon_1.default disabled={years.length <= 1}/>
                </PressableWithFeedback_1.default>
                <react_native_1.View style={[themeStyles.alignItemsCenter, themeStyles.flexRow, themeStyles.flex1, themeStyles.justifyContentEnd, themeStyles.mrn2]}>
                    <Text_1.default style={themeStyles.sidebarLinkTextBold} testID="currentMonthText" accessibilityLabel={translate('common.currentMonth')}>
                        {monthNames.at(currentMonthView)}
                    </Text_1.default>
                    <PressableWithFeedback_1.default shouldUseAutoHitSlop={false} testID="prev-month-arrow" disabled={!hasAvailableDatesPrevMonth} onPress={moveToPrevMonth} hoverDimmingValue={1} accessibilityLabel={translate('common.previous')}>
                        <ArrowIcon_1.default disabled={!hasAvailableDatesPrevMonth} direction={CONST_1.default.DIRECTION.LEFT}/>
                    </PressableWithFeedback_1.default>
                    <PressableWithFeedback_1.default shouldUseAutoHitSlop={false} testID="next-month-arrow" disabled={!hasAvailableDatesNextMonth} onPress={moveToNextMonth} hoverDimmingValue={1} accessibilityLabel={translate('common.next')}>
                        <ArrowIcon_1.default disabled={!hasAvailableDatesNextMonth}/>
                    </PressableWithFeedback_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[themeStyles.flexRow, webOnlyMarginStyle]}>
                {daysOfWeek.map((dayOfWeek) => (<react_native_1.View key={dayOfWeek} style={[themeStyles.calendarDayRoot, themeStyles.flex1, themeStyles.justifyContentCenter, themeStyles.alignItemsCenter]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                        <Text_1.default style={themeStyles.sidebarLinkTextBold}>{dayOfWeek[0]}</Text_1.default>
                    </react_native_1.View>))}
            </react_native_1.View>
            <react_native_reanimated_1.default.View style={calendarContainerStyle}>
                {calendarDaysMatrix?.map((week) => (<react_native_1.View key={`week-${week.toString()}`} style={[themeStyles.flexRow, themeStyles.calendarWeekContainer]}>
                        {week.map((day, index) => {
                const currentDate = new Date(currentYearView, currentMonthView, day);
                const isBeforeMinDate = currentDate < (0, date_fns_1.startOfDay)(new Date(minDate));
                const isAfterMaxDate = currentDate > (0, date_fns_1.startOfDay)(new Date(maxDate));
                const isSelectable = selectableDates ? selectableDates?.some((date) => (0, date_fns_1.isSameDay)((0, date_fns_1.parseISO)(date), currentDate)) : true;
                const isDisabled = !day || isBeforeMinDate || isAfterMaxDate || !isSelectable;
                const isSelected = !!day && (0, date_fns_1.isSameDay)((0, date_fns_1.parseISO)(value.toString()), new Date(currentYearView, currentMonthView, day));
                const handleOnPress = () => {
                    if (!day || isDisabled) {
                        return;
                    }
                    onDayPressed(day);
                };
                const key = `${index}_day-${day}`;
                return (<PressableWithoutFeedback_1.default key={key} disabled={isDisabled} onPress={handleOnPress} style={themeStyles.calendarDayRoot} accessibilityLabel={day?.toString() ?? ''} tabIndex={day ? 0 : -1} accessible={!!day} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                                    {({ hovered, pressed }) => (<DayComponent selected={isSelected} disabled={isDisabled} hovered={hovered} pressed={pressed}>
                                            {day}
                                        </DayComponent>)}
                                </PressableWithoutFeedback_1.default>);
            })}
                    </react_native_1.View>))}
            </react_native_reanimated_1.default.View>
            <YearPickerModal_1.default isVisible={isYearPickerVisible} years={years} currentYear={currentYearView} onYearChange={onYearSelected} onClose={() => setIsYearPickerVisible(false)}/>
        </react_native_1.View>);
}
exports.default = CalendarPicker;
