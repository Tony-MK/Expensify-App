"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function VideoErrorIndicator({ isPreview = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.flexColumn, styles.alignItemsCenter, styles.justifyContentCenter, styles.pAbsolute, styles.h100, styles.w100]}>
            <Icon_1.default fill={isPreview ? theme.border : theme.icon} src={Expensicons.VideoSlash} width={variables_1.default.eReceiptEmptyIconWidth} height={variables_1.default.eReceiptEmptyIconWidth}/>
            {!isPreview && (<react_native_1.View>
                    <Text_1.default style={[styles.notFoundTextHeader, styles.ph11]}>{translate('common.errorOccurredWhileTryingToPlayVideo')}</Text_1.default>
                </react_native_1.View>)}
        </react_native_1.View>);
}
VideoErrorIndicator.displayName = 'VideoErrorIndicator';
exports.default = VideoErrorIndicator;
