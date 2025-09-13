"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AvatarWithIndicator_1 = require("@components/AvatarWithIndicator");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ProfileAvatarWithIndicator({ isSelected = false, containerStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [isLoading = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    return (<OfflineWithFeedback_1.default pendingAction={currentUserPersonalDetails.pendingFields?.avatar} style={containerStyles}>
            <react_native_1.View style={[styles.pRelative]}>
                <react_native_1.View style={[isSelected && styles.selectedAvatarBorder, styles.pAbsolute]} testID="avatar-ring"/>
                <AvatarWithIndicator_1.default source={currentUserPersonalDetails.avatar} accountID={currentUserPersonalDetails.accountID} fallbackIcon={currentUserPersonalDetails.fallbackIcon} isLoading={!!(isLoading && !currentUserPersonalDetails.avatar)}/>
            </react_native_1.View>
        </OfflineWithFeedback_1.default>);
}
ProfileAvatarWithIndicator.displayName = 'ProfileAvatarWithIndicator';
exports.default = ProfileAvatarWithIndicator;
