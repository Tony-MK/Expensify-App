"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ExampleCheckImage() {
    const styles = (0, useThemeStyles_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const { preferredLocale } = (0, useLocalize_1.default)();
    const isSpanish = (preferredLocale ?? CONST_1.default.LOCALES.DEFAULT) === CONST_1.default.LOCALES.ES;
    return (<react_native_1.Image resizeMode="contain" style={[styles.exampleCheckImage, styles.mb5]} source={isSpanish ? illustrations.ExampleCheckES : illustrations.ExampleCheckEN}/>);
}
ExampleCheckImage.displayName = 'ExampleCheckImage';
exports.default = ExampleCheckImage;
