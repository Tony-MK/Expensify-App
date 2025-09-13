"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const usePopoverPosition_1 = require("@hooks/usePopoverPosition");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getImageResolution_1 = require("@libs/fileDownload/getImageResolution");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const AttachmentModal_1 = require("./AttachmentModal");
const AttachmentPicker_1 = require("./AttachmentPicker");
const Avatar_1 = require("./Avatar");
const AvatarCropModal_1 = require("./AvatarCropModal/AvatarCropModal");
const DotIndicatorMessage_1 = require("./DotIndicatorMessage");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const OfflineWithFeedback_1 = require("./OfflineWithFeedback");
const PopoverMenu_1 = require("./PopoverMenu");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const Tooltip_1 = require("./Tooltip");
const anchorAlignment = { horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER, vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP };
function AvatarWithImagePicker({ DefaultAvatar = () => null, style, disabledStyle, editIconStyle, pendingAction, errors, errorRowStyles, onErrorClose = () => { }, source = '', avatarID, fallbackIcon = Expensicons.FallbackAvatar, size = CONST_1.default.AVATAR_SIZE.DEFAULT, type = CONST_1.default.ICON_TYPE_AVATAR, headerTitle = '', previewSource = '', originalFileName = '', isUsingDefaultAvatar = false, onImageSelected = () => { }, onImageRemoved = () => { }, editorMaskImage, avatarStyle, disabled = false, onViewPhotoPress, enablePreview = false, shouldDisableViewPhoto = false, editIcon = Expensicons.Pencil, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const [popoverPosition, setPopoverPosition] = (0, react_1.useState)({ horizontal: 0, vertical: 0 });
    const [isMenuVisible, setIsMenuVisible] = (0, react_1.useState)(false);
    const [errorData, setErrorData] = (0, react_1.useState)({ validationError: null, phraseParam: {} });
    const [isAvatarCropModalOpen, setIsAvatarCropModalOpen] = (0, react_1.useState)(false);
    const [imageData, setImageData] = (0, react_1.useState)({
        uri: '',
        name: '',
        type: '',
    });
    const { calculatePopoverPosition } = (0, usePopoverPosition_1.default)();
    const anchorRef = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    const setError = (error, phraseParam) => {
        setErrorData({
            validationError: error,
            phraseParam,
        });
    };
    (0, react_1.useEffect)(() => {
        if (isFocused) {
            return;
        }
        // Reset the error if the component is no longer focused.
        setError(null, {});
    }, [isFocused]);
    (0, react_1.useEffect)(() => {
        setError(null, {});
    }, [source, avatarID]);
    /**
     * Check if the attachment extension is allowed.
     */
    const isValidExtension = (0, react_1.useCallback)((image) => {
        const { fileExtension } = (0, FileUtils_1.splitExtensionFromFileName)(image?.name ?? '');
        return CONST_1.default.AVATAR_ALLOWED_EXTENSIONS.some((extension) => extension === fileExtension.toLowerCase());
    }, []);
    /**
     * Check if the attachment size is less than allowed size.
     */
    const isValidSize = (0, react_1.useCallback)((image) => (image?.size ?? 0) < CONST_1.default.AVATAR_MAX_ATTACHMENT_SIZE, []);
    /**
     * Check if the attachment resolution matches constraints.
     */
    const isValidResolution = (image) => (0, getImageResolution_1.default)(image).then(({ height, width }) => height >= CONST_1.default.AVATAR_MIN_HEIGHT_PX && width >= CONST_1.default.AVATAR_MIN_WIDTH_PX && height <= CONST_1.default.AVATAR_MAX_HEIGHT_PX && width <= CONST_1.default.AVATAR_MAX_WIDTH_PX);
    /**
     * Validates if an image has a valid resolution and opens an avatar crop modal
     */
    const showAvatarCropModal = (0, react_1.useCallback)((image) => {
        if (!isValidExtension(image)) {
            setError('avatarWithImagePicker.notAllowedExtension', { allowedExtensions: CONST_1.default.AVATAR_ALLOWED_EXTENSIONS });
            return;
        }
        if (!isValidSize(image)) {
            setError('avatarWithImagePicker.sizeExceeded', { maxUploadSizeInMB: CONST_1.default.AVATAR_MAX_ATTACHMENT_SIZE / (1024 * 1024) });
            return;
        }
        (0, FileUtils_1.validateImageForCorruption)(image)
            .then(() => isValidResolution(image))
            .then((isValid) => {
            if (!isValid) {
                setError('avatarWithImagePicker.resolutionConstraints', {
                    minHeightInPx: CONST_1.default.AVATAR_MIN_HEIGHT_PX,
                    minWidthInPx: CONST_1.default.AVATAR_MIN_WIDTH_PX,
                    maxHeightInPx: CONST_1.default.AVATAR_MAX_HEIGHT_PX,
                    maxWidthInPx: CONST_1.default.AVATAR_MAX_WIDTH_PX,
                });
                return;
            }
            setIsAvatarCropModalOpen(true);
            setError(null, {});
            setIsMenuVisible(false);
            setImageData({
                uri: image.uri ?? '',
                name: image.name ?? '',
                type: image.type ?? '',
            });
        })
            .catch(() => {
            setError('attachmentPicker.errorWhileSelectingCorruptedAttachment', {});
        });
    }, [isValidExtension, isValidSize]);
    const hideAvatarCropModal = () => {
        setIsAvatarCropModalOpen(false);
    };
    /**
     * Create menu items list for avatar menu
     */
    const createMenuItems = (openPicker) => {
        const menuItems = [
            {
                icon: Expensicons.Upload,
                text: translate('avatarWithImagePicker.uploadPhoto'),
                onSelected: () => {
                    if ((0, Browser_1.isSafari)()) {
                        return;
                    }
                    openPicker({
                        onPicked: (data) => showAvatarCropModal(data.at(0) ?? {}),
                    });
                },
                shouldCallAfterModalHide: true,
            },
        ];
        // If current avatar isn't a default avatar, allow Remove Photo option
        if (!isUsingDefaultAvatar) {
            menuItems.push({
                icon: Expensicons.Trashcan,
                text: translate('avatarWithImagePicker.removePhoto'),
                onSelected: () => {
                    setError(null, {});
                    onImageRemoved();
                },
            });
        }
        return menuItems;
    };
    const onPressAvatar = (0, react_1.useCallback)((openPicker) => {
        if (disabled && enablePreview && onViewPhotoPress) {
            onViewPhotoPress();
            return;
        }
        if (isUsingDefaultAvatar) {
            openPicker({
                onPicked: (data) => showAvatarCropModal(data.at(0) ?? {}),
            });
            return;
        }
        setIsMenuVisible((prev) => !prev);
    }, [disabled, enablePreview, isUsingDefaultAvatar, onViewPhotoPress, showAvatarCropModal]);
    (0, react_1.useLayoutEffect)(() => {
        if (!anchorRef.current || !isMenuVisible) {
            return;
        }
        calculatePopoverPosition(anchorRef, anchorAlignment).then(setPopoverPosition);
    }, [calculatePopoverPosition, isMenuVisible]);
    return (<react_native_1.View style={[styles.w100, style]}>
            <react_native_1.View style={styles.w100}>
                <AttachmentModal_1.default headerTitle={headerTitle} source={previewSource} originalFileName={originalFileName} fallbackSource={fallbackIcon} maybeIcon={isUsingDefaultAvatar}>
                    {({ show }) => (<AttachmentPicker_1.default type={CONST_1.default.ATTACHMENT_PICKER_TYPE.IMAGE} 
        // We need to skip the validation in AttachmentPicker because it is handled in this component itself
        shouldValidateImage={false}>
                            {({ openPicker }) => {
                const menuItems = createMenuItems(openPicker);
                // If the current avatar isn't a default avatar and we are not overriding this behavior allow the "View Photo" option
                if (!shouldDisableViewPhoto && !isUsingDefaultAvatar) {
                    menuItems.push({
                        icon: Expensicons.Eye,
                        text: translate('avatarWithImagePicker.viewPhoto'),
                        onSelected: () => {
                            if (typeof onViewPhotoPress !== 'function') {
                                show();
                                return;
                            }
                            onViewPhotoPress();
                        },
                        shouldCallAfterModalHide: true,
                    });
                }
                return (<>
                                        <OfflineWithFeedback_1.default errors={errors} errorRowStyles={errorRowStyles} onClose={onErrorClose}>
                                            <Tooltip_1.default shouldRender={!disabled} text={translate('avatarWithImagePicker.editImage')}>
                                                <PressableWithoutFeedback_1.default onPress={() => onPressAvatar(openPicker)} accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('avatarWithImagePicker.editImage')} disabled={isAvatarCropModalOpen || (disabled && !enablePreview)} disabledStyle={disabledStyle} style={[styles.pRelative, type === CONST_1.default.ICON_TYPE_AVATAR && styles.alignSelfCenter, avatarStyle]} ref={anchorRef}>
                                                    <OfflineWithFeedback_1.default pendingAction={pendingAction}>
                                                        {source ? (<Avatar_1.default containerStyles={avatarStyle} imageStyles={[styles.alignSelfCenter, avatarStyle]} source={source} avatarID={avatarID} fallbackIcon={fallbackIcon} size={size} type={type}/>) : (<DefaultAvatar />)}
                                                    </OfflineWithFeedback_1.default>
                                                    {!disabled && (<react_native_1.View style={react_native_1.StyleSheet.flatten([styles.smallEditIcon, styles.smallAvatarEditIcon, editIconStyle])}>
                                                            <Icon_1.default src={editIcon} width={variables_1.default.iconSizeSmall} height={variables_1.default.iconSizeSmall} fill={theme.icon}/>
                                                        </react_native_1.View>)}
                                                </PressableWithoutFeedback_1.default>
                                            </Tooltip_1.default>
                                        </OfflineWithFeedback_1.default>
                                        <PopoverMenu_1.default anchorPosition={popoverPosition} isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} onItemSelected={(item, index) => {
                        setIsMenuVisible(false);
                        // In order for the file picker to open dynamically, the click
                        // function must be called from within an event handler that was initiated
                        // by the user on Safari.
                        if (index === 0 && (0, Browser_1.isSafari)()) {
                            openPicker({
                                onPicked: (data) => showAvatarCropModal(data.at(0) ?? {}),
                            });
                        }
                    }} menuItems={menuItems} anchorAlignment={anchorAlignment} anchorRef={anchorRef}/>
                                    </>);
            }}
                        </AttachmentPicker_1.default>)}
                </AttachmentModal_1.default>
            </react_native_1.View>
            {!!errorData.validationError && (<DotIndicatorMessage_1.default style={[styles.mt6]} 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        messages={{ 0: translate(errorData.validationError, errorData.phraseParam) }} type="error"/>)}
            <AvatarCropModal_1.default onClose={hideAvatarCropModal} isVisible={isAvatarCropModalOpen} onSave={onImageSelected} imageUri={imageData.uri} imageName={imageData.name} imageType={imageData.type} maskImage={editorMaskImage}/>
        </react_native_1.View>);
}
AvatarWithImagePicker.displayName = 'AvatarWithImagePicker';
exports.default = AvatarWithImagePicker;
