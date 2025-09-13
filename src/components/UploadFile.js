"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const CONST_1 = require("@src/CONST");
const AttachmentPicker_1 = require("./AttachmentPicker");
const Button_1 = require("./Button");
const DotIndicatorMessage_1 = require("./DotIndicatorMessage");
const Icon_1 = require("./Icon");
const Expensicons_1 = require("./Icon/Expensicons");
const Pressable_1 = require("./Pressable");
const TextWithMiddleEllipsis_1 = require("./TextWithMiddleEllipsis");
function UploadFile({ buttonText, uploadedFiles, onUpload, onRemove, acceptedFileTypes, style, errorText = '', setError, onInputChange = () => { }, totalFilesSizeLimit = 0, fileLimit = 0, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const handleFileUpload = (files) => {
        const resultedFiles = [...uploadedFiles, ...files];
        const totalSize = resultedFiles.reduce((sum, file) => sum + (file.size ?? 0), 0);
        if (totalFilesSizeLimit) {
            if (totalSize > totalFilesSizeLimit) {
                setError(translate('attachmentPicker.sizeExceededWithValue', { maxUploadSizeInMB: totalFilesSizeLimit / (1024 * 1024) }));
                return;
            }
        }
        if (fileLimit && resultedFiles.length > 0 && resultedFiles.length > fileLimit) {
            setError(translate('attachmentPicker.tooManyFiles', { fileLimit }));
            return;
        }
        if (acceptedFileTypes.length > 0) {
            const filesExtensions = files.map((file) => (0, FileUtils_1.splitExtensionFromFileName)(file?.name ?? '').fileExtension.toLowerCase());
            if (acceptedFileTypes.every((element) => !filesExtensions.includes(element))) {
                setError(translate('attachmentPicker.notAllowedExtension'));
                return;
            }
        }
        const uploadedFilesNames = uploadedFiles.map((uploadedFile) => uploadedFile.name);
        const newFilesToUpload = files.filter((file) => !uploadedFilesNames.includes(file.name));
        onInputChange(newFilesToUpload);
        onUpload(newFilesToUpload);
        setError('');
    };
    return (<react_native_1.View style={[styles.alignItemsStart, style]}>
            <AttachmentPicker_1.default acceptedFileTypes={acceptedFileTypes} fileLimit={fileLimit} allowMultiple={fileLimit > 1}>
                {({ openPicker }) => (<Button_1.default medium text={buttonText} accessibilityLabel={buttonText} onPress={() => {
                openPicker({
                    onPicked: handleFileUpload,
                });
            }}/>)}
            </AttachmentPicker_1.default>
            {uploadedFiles.map((file) => (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentCenter, styles.border, styles.p5, styles.mt3, styles.mw100]} key={file.name}>
                    <Icon_1.default src={Expensicons_1.Paperclip} fill={theme.icon} medium/>
                    <TextWithMiddleEllipsis_1.default text={file.name ?? ''} style={[styles.ml2, styles.mr2, styles.w100, styles.flexShrink1]} textStyle={styles.textBold}/>
                    <Pressable_1.PressableWithFeedback onPress={() => onRemove(file?.name ?? '')} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.remove')}>
                        <Icon_1.default src={Expensicons_1.Close} fill={theme.icon} medium/>
                    </Pressable_1.PressableWithFeedback>
                </react_native_1.View>))}
            {errorText !== '' && (<DotIndicatorMessage_1.default style={[styles.formError, styles.mt3]} type="error" messages={{ errorText }}/>)}
        </react_native_1.View>);
}
UploadFile.displayName = 'UploadFile';
exports.default = UploadFile;
