"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Avatar_1 = require("@components/Avatar");
var Checkbox_1 = require("@components/Checkbox");
var TextWithTooltip_1 = require("@components/TextWithTooltip");
var UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var CONST_1 = require("@src/CONST");
var TotalCell_1 = require("./TotalCell");
function MemberListItemHeader(_a) {
    var memberItem = _a.member, onCheckboxPress = _a.onCheckboxPress, isDisabled = _a.isDisabled, canSelectMultiple = _a.canSelectMultiple, isSelectAllChecked = _a.isSelectAllChecked, isIndeterminate = _a.isIndeterminate;
    var styles = (0, useThemeStyles_1.default)();
    var _b = (0, useLocalize_1.default)(), translate = _b.translate, formatPhoneNumber = _b.formatPhoneNumber;
    var _c = (0, react_1.useMemo)(function () { var _a; return [formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(memberItem)), formatPhoneNumber((_a = memberItem.login) !== null && _a !== void 0 ? _a : '')]; }, [memberItem, formatPhoneNumber]), formattedDisplayName = _c[0], formattedLogin = _c[1];
    return (<react_native_1.View>
            <react_native_1.View style={[styles.pv1Half, styles.ph3, styles.flexRow, styles.alignItemsCenter, styles.justifyContentStart]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                    {!!canSelectMultiple && (<Checkbox_1.default onPress={function () { return onCheckboxPress === null || onCheckboxPress === void 0 ? void 0 : onCheckboxPress(memberItem); }} isChecked={isSelectAllChecked} isIndeterminate={isIndeterminate} disabled={!!isDisabled || memberItem.isDisabledCheckbox} accessibilityLabel={translate('common.select')}/>)}
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
