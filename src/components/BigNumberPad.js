"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ControlSelection_1 = require("@libs/ControlSelection");
const Button_1 = require("./Button");
const Expensicons = require("./Icon/Expensicons");
const padNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '<'],
];
function BigNumberPad({ numberPressed, longPressHandlerStateChanged = () => { }, id = 'numPadView', isLongPressDisabled = false }) {
    const { toLocaleDigit } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [timer, setTimer] = (0, react_1.useState)(null);
    const { isExtraSmallScreenHeight } = (0, useResponsiveLayout_1.default)();
    const numberPressedRef = (0, react_1.useRef)(numberPressed);
    (0, react_1.useEffect)(() => {
        numberPressedRef.current = numberPressed;
    }, [numberPressed]);
    /**
     * Handle long press key on number pad.
     * Only handles the '<' key and starts the continuous input timer.
     */
    const handleLongPress = (key) => {
        if (key !== '<') {
            return;
        }
        longPressHandlerStateChanged(true);
        const newTimer = setInterval(() => {
            numberPressedRef.current?.(key);
        }, 100);
        setTimer(newTimer);
    };
    return (<react_native_1.View style={[styles.flexColumn, styles.w100]} id={id}>
            {padNumbers.map((row) => (<react_native_1.View key={`NumberPadRow-${row[0]}`} style={[styles.flexRow, styles.mt3]}>
                    {row.map((column, columnIndex) => {
                // Adding margin between buttons except first column to
                // avoid unnecessary space before the first column.
                const marginLeft = columnIndex > 0 ? styles.ml3 : {};
                return (<Button_1.default key={column} medium={isExtraSmallScreenHeight} large={!isExtraSmallScreenHeight} shouldEnableHapticFeedback style={[styles.flex1, marginLeft]} text={column === '<' ? undefined : toLocaleDigit(column)} icon={column === '<' ? Expensicons.BackArrow : undefined} onLongPress={() => handleLongPress(column)} onPress={() => numberPressed(column)} onPressIn={ControlSelection_1.default.block} onPressOut={() => {
                        if (timer) {
                            clearInterval(timer);
                        }
                        ControlSelection_1.default.unblock();
                        longPressHandlerStateChanged(false);
                    }} onMouseDown={(e) => {
                        e.preventDefault();
                    }} isLongPressDisabled={isLongPressDisabled} testID={`button_${column}`}/>);
            })}
                </react_native_1.View>))}
        </react_native_1.View>);
}
BigNumberPad.displayName = 'BigNumberPad';
exports.default = BigNumberPad;
