"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function DefaultAttachmentView({ fileName = '', shouldShowLoadingSpinnerIcon = false, shouldShowDownloadIcon, containerStyles, icon, isUploading, isDeleted }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.defaultAttachmentView, containerStyles]}>
            <react_native_1.View style={styles.mr2}>
                <Icon_1.default fill={theme.icon} src={icon ?? Expensicons.Paperclip}/>
            </react_native_1.View>

            <Text_1.default style={[styles.textStrong, styles.flexShrink1, styles.breakAll, styles.flexWrap, styles.mw100, isDeleted && styles.lineThrough]}>{fileName}</Text_1.default>
            {!shouldShowLoadingSpinnerIcon && !!shouldShowDownloadIcon && (<Tooltip_1.default text={translate('common.download')}>
                    <react_native_1.View style={styles.ml2}>
                        <Icon_1.default fill={theme.icon} src={Expensicons.Download}/>
                    </react_native_1.View>
                </Tooltip_1.default>)}
            {shouldShowLoadingSpinnerIcon && (<react_native_1.View style={styles.ml2}>
                    <Tooltip_1.default text={isUploading ? translate('common.uploading') : translate('common.downloading')}>
                        <react_native_1.ActivityIndicator size="small" color={theme.textSupporting} testID="attachment-loading-spinner"/>
                    </Tooltip_1.default>
                </react_native_1.View>)}
        </react_native_1.View>);
}
DefaultAttachmentView.displayName = 'DefaultAttachmentView';
exports.default = DefaultAttachmentView;
