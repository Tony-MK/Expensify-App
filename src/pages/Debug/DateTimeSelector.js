"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function DateTimeSelector({ errorText = '', name, value, onInputChange }, 
// The ref is required by React.forwardRef to avoid warnings, even though it's not used yet.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ref) {
    const fieldValue = (0, native_1.useRoute)().params?.[name];
    (0, react_1.useEffect)(() => {
        // If no datetime is present in the URL, exit the effect early to avoid further processing.
        if (!fieldValue) {
            return;
        }
        // If datetime is present, invoke `onInputChange` to update the form and clear any validation errors related to the constant selection.
        if (onInputChange) {
            onInputChange(fieldValue);
        }
        // Clears the `datetime` parameter from the URL to ensure the component datetime is driven by the parent component rather than URL parameters.
        // This helps prevent issues where the component might not update correctly if the country is controlled by both the parent and the URL.
        Navigation_1.default.setParams({ [name]: undefined });
    }, [fieldValue, name, onInputChange]);
    return (<MenuItemWithTopDescription_1.default title={value} description={name} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.DETAILS_DATE_TIME_PICKER_PAGE.getRoute(name, value, Navigation_1.default.getActiveRoute()));
        }} shouldShowRightIcon/>);
}
DateTimeSelector.displayName = 'DateTimeSelector';
exports.default = (0, react_1.forwardRef)(DateTimeSelector);
