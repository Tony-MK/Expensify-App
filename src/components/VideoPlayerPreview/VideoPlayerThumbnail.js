"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentDeletedIndicator_1 = require("@components/AttachmentDeletedIndicator");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Image_1 = require("@components/Image");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ControlSelection_1 = require("@libs/ControlSelection");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function VideoPlayerThumbnail({ thumbnailUrl, onPress, accessibilityLabel, isDeleted }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={styles.flex1}>
            {!!thumbnailUrl && (<react_native_1.View style={[styles.flex1, { borderRadius: variables_1.default.componentBorderRadiusNormal }, styles.overflowHidden]}>
                    <Image_1.default source={{ uri: thumbnailUrl }} style={styles.flex1} 
        // The auth header is required except for static images on Cloudfront, which makes them fail to load
        isAuthTokenRequired={!CONST_1.default.CLOUDFRONT_DOMAIN_REGEX.test(thumbnailUrl)}/>
                </react_native_1.View>)}
            {!isDeleted ? (<ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
                    {({ anchor, report, isReportArchived, action, checkIfContextMenuActive, isDisabled, onShowContextMenu, shouldDisplayContextMenu }) => (<PressableWithoutFeedback_1.default style={[styles.videoThumbnailContainer]} accessibilityLabel={accessibilityLabel} accessibilityRole={CONST_1.default.ROLE.BUTTON} onPress={onPress} onPressIn={() => (0, DeviceCapabilities_1.canUseTouchScreen)() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()} onLongPress={(event) => {
                    if (isDisabled || !shouldDisplayContextMenu) {
                        return;
                    }
                    onShowContextMenu(() => {
                        (0, ShowContextMenuContext_1.showContextMenuForReport)(event, anchor, report?.reportID, action, checkIfContextMenuActive, (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived));
                    });
                }} shouldUseHapticsOnLongPress>
                            <react_native_1.View style={[styles.videoThumbnailPlayButton]}>
                                <Icon_1.default src={Expensicons_1.Play} fill="white" width={variables_1.default.iconSizeXLarge} height={variables_1.default.iconSizeXLarge}/>
                            </react_native_1.View>
                        </PressableWithoutFeedback_1.default>)}
                </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>) : (<AttachmentDeletedIndicator_1.default containerStyles={{ borderRadius: variables_1.default.componentBorderRadiusNormal }}/>)}
        </react_native_1.View>);
}
VideoPlayerThumbnail.displayName = 'VideoPlayerThumbnail';
exports.default = VideoPlayerThumbnail;
