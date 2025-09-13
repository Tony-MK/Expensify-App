"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const UserInfoCell_1 = require("./UserInfoCell");
function UserInfoCellsWithArrow({ shouldShowToRecipient, participantFrom, participantFromDisplayName, participantTo, participantToDisplayName, avatarSize, style, infoCellsTextStyle, infoCellsAvatarStyle, fromRecipientStyle, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    if (!participantFrom) {
        return null;
    }
    return (<react_native_1.View style={[styles.flex1, style]}>
            <UserInfoCell_1.default accountID={participantFrom.accountID} avatar={participantFrom.avatar} displayName={participantFromDisplayName} avatarSize={avatarSize} textStyle={infoCellsTextStyle} avatarStyle={infoCellsAvatarStyle} containerStyle={[styles.mw50, styles.flexShrink1, fromRecipientStyle]}/>
            {shouldShowToRecipient && (<>
                    <Icon_1.default src={Expensicons.ArrowRightLong} width={variables_1.default.iconSizeXXSmall} height={variables_1.default.iconSizeXXSmall} fill={theme.icon} testID="ArrowRightLong Icon"/>
                    <UserInfoCell_1.default accountID={participantTo.accountID} avatar={participantTo.avatar} displayName={participantToDisplayName} avatarSize={avatarSize} textStyle={infoCellsTextStyle} avatarStyle={infoCellsAvatarStyle} containerStyle={[styles.mw50, styles.flexShrink1, fromRecipientStyle]}/>
                </>)}
        </react_native_1.View>);
}
UserInfoCellsWithArrow.displayName = 'UserInfoCellsWithArrow';
exports.default = UserInfoCellsWithArrow;
