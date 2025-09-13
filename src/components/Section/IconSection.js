"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function IconSection({ icon, iconContainerStyles, width = variables_1.default.menuIconSize, height = variables_1.default.menuIconSize }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.flexGrow1, styles.flexRow, styles.justifyContentEnd, iconContainerStyles]}>
            {!!icon && (<Icon_1.default src={icon} height={height} width={width}/>)}
        </react_native_1.View>);
}
IconSection.displayName = 'IconSection';
exports.default = IconSection;
