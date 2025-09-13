"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const PopoverWithMeasuredContent_1 = require("@components/PopoverWithMeasuredContent");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const CalendarPicker_1 = require("./CalendarPicker");
const DEFAULT_ANCHOR_ORIGIN = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
const popoverDimensions = {
    height: CONST_1.default.POPOVER_DATE_MIN_HEIGHT,
    width: CONST_1.default.POPOVER_DATE_WIDTH,
};
function DatePickerModal({ value, defaultValue, inputID, minDate = (0, date_fns_1.setYear)(new Date(), CONST_1.default.CALENDAR_PICKER.MIN_YEAR), maxDate = (0, date_fns_1.setYear)(new Date(), CONST_1.default.CALENDAR_PICKER.MAX_YEAR), onInputChange, onTouched, shouldSaveDraft = false, formID, isVisible, onClose, anchorPosition, onSelected, shouldCloseWhenBrowserNavigationChanged = false, shouldPositionFromTop = false, }) {
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(value ?? defaultValue ?? undefined);
    const anchorRef = (0, react_1.useRef)(null);
    const styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to distinguish RHL and narrow layout
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    (0, react_1.useEffect)(() => {
        if (shouldSaveDraft && formID) {
            (0, FormActions_1.setDraftValues)(formID, { [inputID]: selectedDate });
        }
        if (selectedDate !== value) {
            setSelectedDate(value);
        }
    }, [formID, inputID, selectedDate, shouldSaveDraft, value]);
    const handleDateSelection = (newValue) => {
        onSelected?.(newValue);
        onTouched?.();
        onInputChange?.(newValue);
        setSelectedDate(newValue);
    };
    return (<PopoverWithMeasuredContent_1.default anchorRef={anchorRef} isVisible={isVisible} onClose={onClose} anchorPosition={anchorPosition} popoverDimensions={popoverDimensions} shouldCloseWhenBrowserNavigationChanged={shouldCloseWhenBrowserNavigationChanged} innerContainerStyle={isSmallScreenWidth ? styles.w100 : { width: CONST_1.default.POPOVER_DATE_WIDTH }} anchorAlignment={DEFAULT_ANCHOR_ORIGIN} restoreFocusType={CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DELETE} shouldSwitchPositionIfOverflow shouldEnableNewFocusManagement shouldMeasureAnchorPositionFromTop={shouldPositionFromTop} shouldSkipRemeasurement>
            <CalendarPicker_1.default minDate={minDate} maxDate={maxDate} value={selectedDate} onSelected={handleDateSelection}/>
        </PopoverWithMeasuredContent_1.default>);
}
DatePickerModal.displayName = 'DatePickerModal';
exports.default = DatePickerModal;
