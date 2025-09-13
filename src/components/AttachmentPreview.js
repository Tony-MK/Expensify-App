"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const expo_av_1 = require("expo-av");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const variables_1 = require("@styles/variables");
const AttachmentView_1 = require("./Attachments/AttachmentView");
const DefaultAttachmentView_1 = require("./Attachments/AttachmentView/DefaultAttachmentView");
const Icon_1 = require("./Icon");
const Expensicons_1 = require("./Icon/Expensicons");
const Image_1 = require("./Image");
const PDFThumbnail_1 = require("./PDFThumbnail");
const Pressable_1 = require("./Pressable");
function AttachmentPreview({ source, aspectRatio = 1, onPress, onLoadError }) {
    const styles = (0, useThemeStyles_1.default)();
    const fillStyle = aspectRatio < 1 ? styles.h100 : styles.w100;
    const [isEncryptedPDF, setIsEncryptedPDF] = (0, react_1.useState)(false);
    const fileName = (0, react_1.useMemo)(() => {
        const rawFileName = (0, FileUtils_1.getFileName)(source);
        return (0, FileUtils_1.cleanFileName)(rawFileName);
    }, [source]);
    if (typeof source === 'string' && expensify_common_1.Str.isVideo(source)) {
        return (<Pressable_1.PressableWithFeedback accessibilityRole="button" style={[fillStyle, styles.br2, styles.overflowHidden, styles.alignSelfStart, { aspectRatio }]} onPress={onPress} accessible accessibilityLabel="Attachment Thumbnail">
                <expo_av_1.Video style={[styles.w100, styles.h100]} source={{
                uri: source,
            }} shouldPlay={false} useNativeControls={false} resizeMode={expo_av_1.ResizeMode.CONTAIN} isLooping={false} onError={onLoadError}/>
                <react_native_1.View style={[styles.h100, styles.w100, styles.pAbsolute, styles.justifyContentCenter, styles.alignItemsCenter]}>
                    <react_native_1.View style={styles.videoThumbnailPlayButton}>
                        <Icon_1.default src={Expensicons_1.Play} fill="white" width={variables_1.default.iconSizeXLarge} height={variables_1.default.iconSizeXLarge}/>
                    </react_native_1.View>
                </react_native_1.View>
            </Pressable_1.PressableWithFeedback>);
    }
    const isFileImage = (0, AttachmentView_1.checkIsFileImage)(source, fileName);
    if (isFileImage) {
        return (<Pressable_1.PressableWithFeedback accessibilityRole="button" style={[styles.alignItemsStart, { aspectRatio: 1 }]} onPress={onPress} accessible accessibilityLabel="Image Thumbnail">
                <react_native_1.View style={[fillStyle, styles.br4, styles.overflowHidden, { aspectRatio }]}>
                    <Image_1.default source={{ uri: source }} style={[[styles.w100, styles.h100], styles.overflowHidden]}/>
                </react_native_1.View>
            </Pressable_1.PressableWithFeedback>);
    }
    if (typeof source === 'string' && expensify_common_1.Str.isPDF(source) && !isEncryptedPDF) {
        return (<Pressable_1.PressableWithFeedback accessibilityRole="button" style={[styles.justifyContentStart, { aspectRatio: 1 }]} onPress={onPress} accessible accessibilityLabel="PDF Thumbnail">
                <PDFThumbnail_1.default fitPolicy={1} previewSourceURL={source} style={[styles.br4]} onLoadError={onLoadError} onPassword={() => setIsEncryptedPDF(true)}/>
            </Pressable_1.PressableWithFeedback>);
    }
    return <DefaultAttachmentView_1.default fileName={fileName}/>;
}
AttachmentPreview.displayName = 'AttachmentPreview';
exports.default = AttachmentPreview;
