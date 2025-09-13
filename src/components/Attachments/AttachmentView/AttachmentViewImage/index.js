"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ImageView_1 = require("@components/ImageView");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function AttachmentViewImage({ url, file, isAuthTokenRequired, loadComplete, onPress, onError, onLoad, isImage }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const children = (<ImageView_1.default onError={onError} onLoad={onLoad} url={url} fileName={file?.name ?? ''} isAuthTokenRequired={isImage && isAuthTokenRequired}/>);
    return onPress ? (<PressableWithoutFeedback_1.default onPress={onPress} disabled={loadComplete} style={[styles.flex1, styles.flexRow, styles.alignSelfStretch]} accessibilityRole={CONST_1.default.ROLE.BUTTON} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    accessibilityLabel={file?.name || translate('attachmentView.unknownFilename')}>
            {children}
        </PressableWithoutFeedback_1.default>) : (children);
}
AttachmentViewImage.displayName = 'AttachmentViewImage';
exports.default = (0, react_1.memo)(AttachmentViewImage);
