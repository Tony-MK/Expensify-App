"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
function WorkspaceCompanyCardsListRow({ cardholder, name, cardNumber }) {
    const styles = (0, useThemeStyles_1.default)();
    const cardholderName = (0, react_1.useMemo)(() => PersonalDetailsUtils.getDisplayNameOrDefault(cardholder), [cardholder]);
    return (<react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.br3, styles.p4]}>
            <react_native_1.View style={[styles.flexRow, styles.gap3, styles.alignItemsCenter, styles.flex3]}>
                <Avatar_1.default source={cardholder?.avatar ?? (0, UserUtils_1.getDefaultAvatarURL)(cardholder?.accountID)} avatarID={cardholder?.accountID} type={CONST_1.default.ICON_TYPE_AVATAR} size={CONST_1.default.AVATAR_SIZE.DEFAULT}/>
                <react_native_1.View style={[styles.flex1, styles.pr2]}>
                    <Text_1.default numberOfLines={1} style={[styles.optionDisplayName, styles.textStrong, styles.pre]}>
                        {cardholderName}
                    </Text_1.default>
                    <Text_1.default numberOfLines={1} style={[styles.textLabelSupporting, styles.lh16]}>
                        {name}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[styles.flex1, styles.alignItemsEnd]}>
                <Text_1.default numberOfLines={1} style={[styles.textLabelSupporting, styles.lh16]}>
                    {cardNumber}
                </Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
WorkspaceCompanyCardsListRow.displayName = 'WorkspaceCompanyCardsListRow';
exports.default = WorkspaceCompanyCardsListRow;
