"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const useGeographicalStateAndCountryFromRoute_1 = require("@hooks/useGeographicalStateAndCountryFromRoute");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const MenuItemWithTopDescription_1 = require("./MenuItemWithTopDescription");
function StateSelector({ errorText, onBlur, value: stateCode, label, onInputChange, wrapperStyle, stateSelectorRoute = ROUTES_1.default.SETTINGS_ADDRESS_STATE }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { state: stateFromUrl } = (0, useGeographicalStateAndCountryFromRoute_1.default)();
    const didOpenStateSelector = (0, react_1.useRef)(false);
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        // Check if the state selector was opened and no value was selected, triggering onBlur to display an error
        if (isFocused && didOpenStateSelector.current) {
            didOpenStateSelector.current = false;
            if (!stateFromUrl) {
                onBlur?.();
            }
        }
        // If no state is selected from the URL, exit the effect early to avoid further processing.
        if (!stateFromUrl) {
            return;
        }
        // If a state is selected, invoke `onInputChange` to update the form and clear any validation errors related to the state selection.
        if (onInputChange) {
            onInputChange(stateFromUrl);
        }
        // Clears the `state` parameter from the URL to ensure the component state is driven by the parent component rather than URL parameters.
        // This helps prevent issues where the component might not update correctly if the state is controlled by both the parent and the URL.
        Navigation_1.default.setParams({ state: undefined });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [stateFromUrl, onBlur, isFocused]);
    const title = stateCode && Object.keys(expensify_common_1.CONST.STATES).includes(stateCode) ? translate(`allStates.${stateCode}.stateName`) : '';
    const descStyle = title.length === 0 ? styles.textNormal : null;
    return (<MenuItemWithTopDescription_1.default descriptionTextStyle={descStyle} ref={ref} shouldShowRightIcon title={title} 
    // Label can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    description={label || translate('common.state')} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} onPress={() => {
            const activeRoute = Navigation_1.default.getActiveRoute();
            didOpenStateSelector.current = true;
            Navigation_1.default.navigate(stateSelectorRoute.getRoute(stateCode, activeRoute, label));
        }} wrapperStyle={wrapperStyle}/>);
}
StateSelector.displayName = 'StateSelector';
exports.default = react_1.default.forwardRef(StateSelector);
