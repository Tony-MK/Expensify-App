"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Checkbox_1 = require("@components/Checkbox");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
const TotalCell_1 = require("./TotalCell");
function MemberListItemHeader({ member: memberItem, onCheckboxPress, isDisabled, canSelectMultiple, isSelectAllChecked, isIndeterminate, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [formattedDisplayName, formattedLogin] = (0, react_1.useMemo)(() => [formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(memberItem)), formatPhoneNumber(memberItem.login ?? '')], [memberItem, formatPhoneNumber]);
    return (<react_native_1.View>
            <react_native_1.View style={[styles.pv1Half, styles.ph3, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                    {!!canSelectMultiple && (<Checkbox_1.default onPress={() => onCheckboxPress?.(memberItem)} isChecked={isSelectAllChecked} isIndeterminate={isIndeterminate} disabled={!!isDisabled || memberItem.isDisabledCheckbox} accessibilityLabel={translate('common.select')}/>)}
                    <react_native_1.View style={[styles.flexRow, styles.flex1, styles.gap3]}>
                        <UserDetailsTooltip_1.default accountID={memberItem.accountID}>
                            <react_native_1.View>
                                <Avatar_1.default source={memberItem.avatar} type={CONST_1.default.ICON_TYPE_AVATAR} name={formattedDisplayName} avatarID={memberItem.accountID}/>
                            </react_native_1.View>
                        </UserDetailsTooltip_1.default>
                        <react_native_1.View style={[styles.gapHalf, styles.flexShrink1]}>
                            <TextWithTooltip_1.default text={formattedDisplayName} style={[styles.optionDisplayName, styles.sidebarLinkTextBold, styles.pre]}/>
                            <TextWithTooltip_1.default text={formattedLogin || formattedDisplayName} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={[styles.flexShrink0, styles.mr3]}>
                    <TotalCell_1.default total={memberItem.total} currency={memberItem.currency}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
MemberListItemHeader.displayName = 'MemberListItemHeader';
exports.default = MemberListItemHeader;
