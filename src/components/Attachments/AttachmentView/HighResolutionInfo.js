"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function HighResolutionInfo({ isUploaded }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const stylesUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2, styles.justifyContentCenter, stylesUtils.getHighResolutionInfoWrapperStyle(isUploaded)]}>
            <Icon_1.default src={Expensicons.Info} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall} fill={theme.icon} additionalStyles={styles.p1}/>
            <Text_1.default style={[styles.textLabelSupporting]}>{isUploaded ? translate('attachmentPicker.attachmentImageResized') : translate('attachmentPicker.attachmentImageTooLarge')}</Text_1.default>
        </react_native_1.View>);
}
exports.default = HighResolutionInfo;
