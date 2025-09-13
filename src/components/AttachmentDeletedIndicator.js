"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
function AttachmentDeletedIndicator({ containerStyles }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    if (!isOffline) {
        return null;
    }
    return (<>
            <react_native_1.View style={[
            styles.pAbsolute,
            styles.alignItemsCenter,
            styles.justifyContentCenter,
            styles.highlightBG,
            styles.deletedIndicatorOverlay,
            styles.deletedAttachmentIndicator,
            containerStyles,
        ]}/>
            <react_native_1.View style={[styles.pAbsolute, styles.deletedAttachmentIndicator, styles.alignItemsCenter, styles.justifyContentCenter, containerStyles]}>
                <Icon_1.default fill={theme.icon} src={Expensicons.Trashcan} width={variables_1.default.iconSizeSuperLarge} height={variables_1.default.iconSizeSuperLarge}/>
            </react_native_1.View>
        </>);
}
AttachmentDeletedIndicator.displayName = 'AttachmentDeletedIndicator';
exports.default = AttachmentDeletedIndicator;
