"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ProfileAvatarWithIndicator_1 = require("./ProfileAvatarWithIndicator");
function AvatarWithOptionalStatus({ emojiStatus = '', isSelected = false, containerStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.sidebarStatusAvatarContainer, containerStyle]}>
            <ProfileAvatarWithIndicator_1.default isSelected={isSelected}/>
            <react_native_1.View style={styles.sidebarStatusAvatar}>
                <react_native_1.View>
                    <Text_1.default style={styles.emojiStatusLHN} numberOfLines={1}>
                        {emojiStatus}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
AvatarWithOptionalStatus.displayName = 'AvatarWithOptionalStatus';
exports.default = AvatarWithOptionalStatus;
