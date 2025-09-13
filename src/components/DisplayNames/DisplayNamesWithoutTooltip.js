"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function DisplayNamesWithoutTooltip({ textStyles = [], numberOfLines = 1, fullTitle = '', renderAdditionalText, forwardedFSClass }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Text_1.default style={[textStyles, numberOfLines === 1 ? styles.pre : styles.preWrap]} numberOfLines={numberOfLines} fsClass={forwardedFSClass}>
            {fullTitle}
            {renderAdditionalText?.()}
        </Text_1.default>);
}
DisplayNamesWithoutTooltip.displayName = 'DisplayNamesWithoutTooltip';
exports.default = DisplayNamesWithoutTooltip;
