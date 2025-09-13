"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_svg_1 = require("react-native-svg");
var SkeletonViewContentLoader_1 = require("@components/SkeletonViewContentLoader");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var variables_1 = require("@styles/variables");
function SearchInputSelectionSkeleton() {
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.searchRouterTextInputContainer, styles.searchAutocompleteInputResults, styles.br2, styles.justifyContentCenter]}>
            <SkeletonViewContentLoader_1.default height={variables_1.default.searchAutocompleteInputSkeletonHeight} backgroundColor={theme.skeletonLHNIn} foregroundColor={theme.skeletonLHNOut} style={[styles.ml1]}>
                <react_native_svg_1.Rect x="0" y="0" width={variables_1.default.searchAutocompleteInputSkeletonWidth} height={variables_1.default.searchAutocompleteInputSkeletonHeight}/>
            </SkeletonViewContentLoader_1.default>
        </react_native_1.View>);
}
exports.default = SearchInputSelectionSkeleton;
