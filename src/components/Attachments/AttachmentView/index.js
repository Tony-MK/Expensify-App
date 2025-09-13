"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsFileImage = checkIsFileImage;
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentCarouselPagerContext_1 = require("@components/Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const Button_1 = require("@components/Button");
const DistanceEReceipt_1 = require("@components/DistanceEReceipt");
const EReceipt_1 = require("@components/EReceipt");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const PerDiemEReceipt_1 = require("@components/PerDiemEReceipt");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const useFirstRenderRoute_1 = require("@hooks/useFirstRenderRoute");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CachedPDFPaths_1 = require("@libs/actions/CachedPDFPaths");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AttachmentViewImage_1 = require("./AttachmentViewImage");
const AttachmentViewPdf_1 = require("./AttachmentViewPdf");
const AttachmentViewVideo_1 = require("./AttachmentViewVideo");
const DefaultAttachmentView_1 = require("./DefaultAttachmentView");
const HighResolutionInfo_1 = require("./HighResolutionInfo");
function checkIsFileImage(source, fileName) {
    const isSourceImage = typeof source === 'number' || (typeof source === 'string' && expensify_common_1.Str.isImage(source));
    const isFileNameImage = fileName && expensify_common_1.Str.isImage(fileName);
    return isSourceImage || isFileNameImage;
}
function AttachmentView({ source, previewSource, file, isAuthTokenRequired, onPress, shouldShowLoadingSpinnerIcon, shouldShowDownloadIcon, containerStyles, onToggleKeyboard, onPDFLoadError: onPDFLoadErrorProp = () => { }, isFocused, isUsedInAttachmentModal, isWorkspaceAvatar, maybeIcon, fallbackSource, transactionID = '-1', reportActionID, isHovered, duration, isUsedAsChatAttachment, isUploaded = true, isDeleted, isUploading = false, reportID, }) {
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const { updateCurrentURLAndReportID } = (0, PlaybackContext_1.usePlaybackContext)();
    const attachmentCarouselPagerContext = (0, react_1.useContext)(AttachmentCarouselPagerContext_1.default);
    const { onAttachmentError, onAttachmentLoaded } = attachmentCarouselPagerContext ?? {};
    const theme = (0, useTheme_1.default)();
    const { safeAreaPaddingBottomStyle } = (0, useSafeAreaPaddings_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [loadComplete, setLoadComplete] = (0, react_1.useState)(false);
    const [isHighResolution, setIsHighResolution] = (0, react_1.useState)(false);
    const [hasPDFFailedToLoad, setHasPDFFailedToLoad] = (0, react_1.useState)(false);
    const isVideo = (typeof source === 'string' && expensify_common_1.Str.isVideo(source)) || (file?.name && expensify_common_1.Str.isVideo(file.name));
    const firstRenderRoute = (0, useFirstRenderRoute_1.default)();
    const isInFocusedModal = firstRenderRoute.isFocused && isFocused === undefined;
    (0, react_1.useEffect)(() => {
        if (!isFocused && !isInFocusedModal && !(file && isUsedInAttachmentModal)) {
            return;
        }
        updateCurrentURLAndReportID(isVideo && typeof source === 'string' ? source : undefined, reportID);
    }, [file, isFocused, isInFocusedModal, isUsedInAttachmentModal, isVideo, reportID, source, updateCurrentURLAndReportID]);
    const [imageError, setImageError] = (0, react_1.useState)(false);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: () => setImageError(false) });
    (0, react_1.useEffect)(() => {
        (0, FileUtils_1.getFileResolution)(file).then((resolution) => {
            setIsHighResolution((0, FileUtils_1.isHighResolutionImage)(resolution));
        });
    }, [file]);
    (0, react_1.useEffect)(() => {
        const isImageSource = typeof source !== 'function' && !!checkIsFileImage(source, file?.name);
        const isErrorInImage = imageError && (typeof fallbackSource === 'number' || typeof fallbackSource === 'function');
        onAttachmentError?.(source, isErrorInImage && isImageSource);
    }, [fallbackSource, file?.name, imageError, onAttachmentError, source]);
    // Handles case where source is a component (ex: SVG) or a number
    // Number may represent a SVG or an image
    if (typeof source === 'function' || (maybeIcon && typeof source === 'number')) {
        let iconFillColor = '';
        let additionalStyles = [];
        if (isWorkspaceAvatar && file) {
            const defaultWorkspaceAvatarColor = StyleUtils.getDefaultWorkspaceAvatarColor(file.name ?? '');
            iconFillColor = defaultWorkspaceAvatarColor.fill;
            additionalStyles = [defaultWorkspaceAvatarColor];
        }
        return (<Icon_1.default src={source} height={variables_1.default.defaultAvatarPreviewSize} width={variables_1.default.defaultAvatarPreviewSize} fill={iconFillColor} additionalStyles={additionalStyles} enableMultiGestureCanvas/>);
    }
    if ((0, TransactionUtils_1.isPerDiemRequest)(transaction) && transaction && !(0, TransactionUtils_1.hasReceiptSource)(transaction)) {
        return <PerDiemEReceipt_1.default transactionID={transaction.transactionID}/>;
    }
    if (transaction && !(0, TransactionUtils_1.hasReceiptSource)(transaction) && (0, TransactionUtils_1.hasEReceipt)(transaction)) {
        return (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter]}>
                <ScrollView_1.default style={styles.w100} contentContainerStyle={[styles.flexGrow1, styles.justifyContentCenter, styles.alignItemsCenter]}>
                    <EReceipt_1.default transactionID={transaction.transactionID}/>
                </ScrollView_1.default>
            </react_native_1.View>);
    }
    // Check both source and file.name since PDFs dragged into the text field
    // will appear with a source that is a blob
    const isSourcePDF = typeof source === 'string' && expensify_common_1.Str.isPDF(source);
    const isFilePDF = file && expensify_common_1.Str.isPDF(file.name ?? translate('attachmentView.unknownFilename'));
    if (!hasPDFFailedToLoad && !isUploading && (isSourcePDF || isFilePDF)) {
        const encryptedSourceUrl = isAuthTokenRequired ? (0, addEncryptedAuthTokenToURL_1.default)(source) : source;
        const onPDFLoadComplete = (path) => {
            const id = (transaction && transaction.transactionID) ?? reportActionID;
            if (path && id) {
                (0, CachedPDFPaths_1.add)(id, path);
            }
            if (!loadComplete) {
                setLoadComplete(true);
            }
        };
        const onPDFLoadError = () => {
            setHasPDFFailedToLoad(true);
            onPDFLoadErrorProp();
        };
        // We need the following View component on android native
        // So that the event will propagate properly and
        // the Password protected preview will be shown for pdf attachment we are about to send.
        return (<react_native_1.View style={[styles.flex1, styles.attachmentCarouselContainer]}>
                <AttachmentViewPdf_1.default file={file} isFocused={isFocused} encryptedSourceUrl={encryptedSourceUrl} onPress={onPress} onToggleKeyboard={onToggleKeyboard} onLoadComplete={onPDFLoadComplete} style={isUsedInAttachmentModal ? styles.imageModalPDF : styles.flex1} isUsedAsChatAttachment={isUsedAsChatAttachment} onLoadError={onPDFLoadError}/>
            </react_native_1.View>);
    }
    if ((0, TransactionUtils_1.isDistanceRequest)(transaction) && !(0, TransactionUtils_1.isManualDistanceRequest)(transaction) && transaction) {
        return <DistanceEReceipt_1.default transaction={transaction}/>;
    }
    // For this check we use both source and file.name since temporary file source is a blob
    // both PDFs and images will appear as images when pasted into the text field.
    // We also check for numeric source since this is how static images (used for preview) are represented in RN.
    // isLocalSource checks if the source is blob as that's the type of the temp image coming from mobile web
    const isFileImage = checkIsFileImage(source, file?.name);
    const isLocalSourceImage = typeof source === 'string' && source.startsWith('blob:');
    const isImage = isFileImage ?? isLocalSourceImage;
    if (isImage) {
        if (imageError && (typeof fallbackSource === 'number' || typeof fallbackSource === 'function')) {
            return (<react_native_1.View style={[styles.flexColumn, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    <Icon_1.default src={fallbackSource} width={variables_1.default.iconSizeSuperLarge} height={variables_1.default.iconSizeSuperLarge} fill={theme.icon}/>
                    <react_native_1.View>
                        <Text_1.default style={[styles.notFoundTextHeader]}>{translate('attachmentView.attachmentNotFound')}</Text_1.default>
                    </react_native_1.View>
                    <Button_1.default text={translate('attachmentView.retry')} icon={Expensicons_1.ArrowCircleClockwise} onPress={() => {
                    if (isOffline) {
                        return;
                    }
                    setImageError(false);
                }}/>
                </react_native_1.View>);
        }
        let imageSource = imageError && fallbackSource ? fallbackSource : source;
        if (isHighResolution) {
            if (!isUploaded) {
                return (<>
                        <react_native_1.View style={styles.imageModalImageCenterContainer}>
                            <DefaultAttachmentView_1.default icon={Expensicons_1.Gallery} fileName={file?.name} shouldShowDownloadIcon={shouldShowDownloadIcon} shouldShowLoadingSpinnerIcon={shouldShowLoadingSpinnerIcon} containerStyles={containerStyles}/>
                        </react_native_1.View>
                        <HighResolutionInfo_1.default isUploaded={isUploaded}/>
                    </>);
            }
            imageSource = previewSource?.toString() ?? imageSource;
        }
        return (<>
                <react_native_1.View style={styles.imageModalImageCenterContainer}>
                    <AttachmentViewImage_1.default url={imageSource} file={file} isAuthTokenRequired={isAuthTokenRequired} loadComplete={loadComplete} isImage={isImage} onPress={onPress} onLoad={() => onAttachmentLoaded?.(source, true)} onError={() => {
                if (isOffline) {
                    return;
                }
                setImageError(true);
            }}/>
                </react_native_1.View>
                {isHighResolution && (<react_native_1.View style={safeAreaPaddingBottomStyle}>
                        <HighResolutionInfo_1.default isUploaded={isUploaded}/>
                    </react_native_1.View>)}
            </>);
    }
    if ((isVideo ?? (file?.name && expensify_common_1.Str.isVideo(file.name))) && typeof source === 'string') {
        return (<AttachmentViewVideo_1.default source={source} shouldUseSharedVideoElement={!CONST_1.default.ATTACHMENT_LOCAL_URL_PREFIX.some((prefix) => source.startsWith(prefix))} isHovered={isHovered} duration={duration} reportID={reportID}/>);
    }
    return (<DefaultAttachmentView_1.default fileName={file?.name} shouldShowDownloadIcon={shouldShowDownloadIcon} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    shouldShowLoadingSpinnerIcon={shouldShowLoadingSpinnerIcon || isUploading} containerStyles={containerStyles} isDeleted={isDeleted} isUploading={isUploading}/>);
}
AttachmentView.displayName = 'AttachmentView';
exports.default = (0, react_1.memo)(AttachmentView);
