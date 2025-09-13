"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BaseAutoCompleteSuggestions_1 = require("@components/AutoCompleteSuggestions/BaseAutoCompleteSuggestions");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const getBottomSuggestionPadding_1 = require("./getBottomSuggestionPadding");
const TransparentOverlay_1 = require("./TransparentOverlay/TransparentOverlay");
function AutoCompleteSuggestionsPortal({ left = 0, width = 0, bottom = 0, resetSuggestions = () => { }, ...props }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const bottomPadding = (0, getBottomSuggestionPadding_1.default)(bottom);
    const styles = (0, react_1.useMemo)(() => StyleUtils.getBaseAutoCompleteSuggestionContainerStyle({ left, width, bottom: bottom + bottomPadding }), [StyleUtils, left, width, bottom, bottomPadding]);
    if (!width) {
        return null;
    }
    return (<portal_1.Portal hostName="suggestions">
            <TransparentOverlay_1.default onPress={resetSuggestions}/>
            <react_native_1.View style={styles}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <BaseAutoCompleteSuggestions_1.default width={width} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>
            </react_native_1.View>
        </portal_1.Portal>);
}
AutoCompleteSuggestionsPortal.displayName = 'AutoCompleteSuggestionsPortal';
exports.default = AutoCompleteSuggestionsPortal;
