"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons = require("@components/Icon/Expensicons");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const mergeRefs_1 = require("@libs/mergeRefs");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const DatePickerModal_1 = require("./DatePickerModal");
const PADDING_MODAL_DATE_PICKER = 8;
function DatePicker({ defaultValue, disabled, errorText, inputID, label, minDate = (0, date_fns_1.setYear)(new Date(), CONST_1.default.CALENDAR_PICKER.MIN_YEAR), maxDate = (0, date_fns_1.setYear)(new Date(), CONST_1.default.CALENDAR_PICKER.MAX_YEAR), onInputChange, onTouched = () => { }, placeholder, value, shouldSaveDraft = false, formID, autoFocus = false, shouldHideClearButton = false, }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { windowHeight, windowWidth } = (0, useWindowDimensions_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(value || defaultValue || undefined);
    const [popoverPosition, setPopoverPosition] = (0, react_1.useState)({ horizontal: 0, vertical: 0 });
    const textInputRef = (0, react_1.useRef)(null);
    const anchorRef = (0, react_1.useRef)(null);
    const [isInverted, setIsInverted] = (0, react_1.useState)(false);
    const isAutoFocused = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (shouldSaveDraft && formID) {
            (0, FormActions_1.setDraftValues)(formID, { [inputID]: selectedDate });
        }
        if (selectedDate === value || !value) {
            return;
        }
        setSelectedDate(value);
    }, [formID, inputID, selectedDate, shouldSaveDraft, value]);
    const calculatePopoverPosition = (0, react_1.useCallback)(() => {
        anchorRef.current?.measureInWindow((x, y, width, height) => {
            const wouldExceedBottom = y + CONST_1.default.POPOVER_DATE_MAX_HEIGHT + PADDING_MODAL_DATE_PICKER > windowHeight;
            setIsInverted(wouldExceedBottom);
            setPopoverPosition({
                horizontal: x + width,
                vertical: y + (wouldExceedBottom ? 0 : height + PADDING_MODAL_DATE_PICKER),
            });
        });
    }, [windowHeight]);
    const handlePress = (0, react_1.useCallback)(() => {
        calculatePopoverPosition();
        setIsModalVisible(true);
    }, [calculatePopoverPosition]);
    const closeDatePicker = (0, react_1.useCallback)(() => {
        textInputRef.current?.blur();
        setIsModalVisible(false);
    }, []);
    const handleDateSelected = (newDate) => {
        onTouched?.();
        onInputChange?.(newDate);
        setSelectedDate(newDate);
        closeDatePicker();
    };
    const handleClear = () => {
        onTouched?.();
        onInputChange?.('');
        setSelectedDate('');
    };
    (0, react_1.useEffect)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            calculatePopoverPosition();
        });
    }, [calculatePopoverPosition, windowWidth]);
    (0, react_1.useEffect)(() => {
        if (!autoFocus || isAutoFocused.current) {
            return;
        }
        isAutoFocused.current = true;
        react_native_1.InteractionManager.runAfterInteractions(() => {
            handlePress();
        });
    }, [handlePress, autoFocus]);
    const getValidDateForCalendar = (0, react_1.useMemo)(() => {
        if (!selectedDate) {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            return defaultValue || (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING);
        }
        return selectedDate;
    }, [selectedDate, defaultValue]);
    return (<>
            <react_native_1.View ref={anchorRef} style={styles.mv2}>
                <TextInput_1.default ref={(0, mergeRefs_1.default)(ref, textInputRef)} inputID={inputID} forceActiveLabel icon={selectedDate ? null : Expensicons.Calendar} iconContainerStyle={styles.pr0} label={label} accessibilityLabel={label} role={CONST_1.default.ROLE.PRESENTATION} value={selectedDate} placeholder={placeholder ?? translate('common.dateFormat')} errorText={errorText} inputStyle={styles.pointerEventsNone} disabled={disabled} readOnly onPress={handlePress} textInputContainerStyles={isModalVisible ? styles.borderColorFocus : {}} shouldHideClearButton={shouldHideClearButton} onClearInput={handleClear}/>
            </react_native_1.View>

            <DatePickerModal_1.default inputID={inputID} minDate={minDate} maxDate={maxDate} value={getValidDateForCalendar} onSelected={handleDateSelected} isVisible={isModalVisible} onClose={closeDatePicker} anchorPosition={popoverPosition} shouldPositionFromTop={!isInverted}/>
        </>);
}
DatePicker.displayName = 'DatePicker';
exports.default = (0, react_1.forwardRef)(DatePicker);
