"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var LinearGradientEmptyStateBackground_1 = require("./LinearGradientEmptyStateBackground");
/**
 * Provides global SVG definitions and helps avoid duplicated ids.
 * Duplicated ids in the <defs> cause rendering issues (like missing gradients).
 */
function SVGDefinitionsProvider(_a) {
    var children = _a.children;
    return (<>
            <svg aria-hidden style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                    <LinearGradientEmptyStateBackground_1.default />
                    <LinearGradientEmptyStateBackground_1.default isDarkTheme/>
                </defs>
            </svg>
            {children}
        </>);
}
SVGDefinitionsProvider.displayName = 'SVGDefinitionsProvider';
exports.default = SVGDefinitionsProvider;
