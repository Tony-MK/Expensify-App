"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const MenuItemWithTopDescription_1 = require("./MenuItemWithTopDescription");
function CurrencySelector({ errorText = '', value: currency, onInputChange = () => { }, onBlur, currencySelectorRoute = ROUTES_1.default.SETTINGS_CHANGE_CURRENCY }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const currencyTitleDescStyle = currency ? styles.textNormal : null;
    const didOpenCurrencySelector = (0, react_1.useRef)(false);
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        if (!isFocused || !didOpenCurrencySelector.current) {
            return;
        }
        didOpenCurrencySelector.current = false;
        onBlur?.();
    }, [isFocused, onBlur]);
    (0, react_1.useEffect)(() => {
        // This will cause the form to revalidate and remove any error related to currency
        onInputChange(currency);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [currency]);
    return (<MenuItemWithTopDescription_1.default shouldShowRightIcon title={currency} ref={ref} descriptionTextStyle={currencyTitleDescStyle} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} description={translate('common.currency')} errorText={errorText} onPress={() => {
            didOpenCurrencySelector.current = true;
            Navigation_1.default.navigate(currencySelectorRoute);
        }}/>);
}
CurrencySelector.displayName = 'CurrencySelector';
exports.default = (0, react_1.forwardRef)(CurrencySelector);
