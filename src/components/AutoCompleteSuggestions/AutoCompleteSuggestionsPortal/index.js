"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_native_1 = require("react-native");
const BaseAutoCompleteSuggestions_1 = require("@components/AutoCompleteSuggestions/BaseAutoCompleteSuggestions");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const getBottomSuggestionPadding_1 = require("./getBottomSuggestionPadding");
const TransparentOverlay_1 = require("./TransparentOverlay/TransparentOverlay");
/**
 * On the mobile-web platform, when long-pressing on auto-complete suggestions,
 * we need to prevent focus shifting to avoid blurring the main input (which makes the suggestions picker close and fires the onSelect callback).
 * The desired pattern for all platforms is to do nothing on long-press.
 * On the native platform, tapping on auto-complete suggestions will not blur the main input.
 */
function AutoCompleteSuggestionsPortal({ left = 0, width = 0, bottom = 0, resetSuggestions = () => { }, ...props }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const bodyElement = document.querySelector('body');
    const componentToRender = (<BaseAutoCompleteSuggestions_1.default width={width} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
    return (!!width &&
        bodyElement &&
        react_dom_1.default.createPortal(<>
                <TransparentOverlay_1.default onPress={resetSuggestions}/>
                <react_native_1.View style={StyleUtils.getBaseAutoCompleteSuggestionContainerStyle({ left, width, bottom: bottom - (0, getBottomSuggestionPadding_1.default)() })}>{componentToRender}</react_native_1.View>
            </>, bodyElement));
}
AutoCompleteSuggestionsPortal.displayName = 'AutoCompleteSuggestionsPortal';
exports.default = AutoCompleteSuggestionsPortal;
