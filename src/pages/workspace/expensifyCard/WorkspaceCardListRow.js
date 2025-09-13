"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
function WorkspaceCardListRow({ limit, cardholder, lastFourPAN, name, currency, isVirtual }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const cardholderName = (0, react_1.useMemo)(() => (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(cardholder), [cardholder]);
    const cardType = isVirtual ? translate('workspace.expensifyCard.virtual') : translate('workspace.expensifyCard.physical');
    return (<react_native_1.View style={[styles.flexRow, styles.gap3, styles.br3, styles.p4]}>
            <react_native_1.View style={[styles.flexRow, styles.flex4, styles.gap3, styles.alignItemsCenter]}>
                <Avatar_1.default source={cardholder?.avatar ?? Expensicons_1.FallbackAvatar} avatarID={cardholder?.accountID} type={CONST_1.default.ICON_TYPE_AVATAR} size={CONST_1.default.AVATAR_SIZE.DEFAULT}/>
                <react_native_1.View style={[styles.flex1, styles.h100]}>
                    <Text_1.default numberOfLines={1} style={[styles.optionDisplayName, styles.textStrong, styles.pre]}>
                        {cardholderName}
                    </Text_1.default>
                    <Text_1.default numberOfLines={1} style={[styles.textLabelSupporting, styles.lh16]}>
                        {name}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            {!shouldUseNarrowLayout && (<react_native_1.View style={[styles.flexRow, styles.gap2, styles.flex1, styles.alignItemsCenter, styles.justifyContentStart]}>
                    <Text_1.default numberOfLines={1} style={[styles.textNormalThemeText, styles.lh16]}>
                        {cardType}
                    </Text_1.default>
                </react_native_1.View>)}
            <react_native_1.View style={[
            styles.flexRow,
            styles.gap2,
            shouldUseNarrowLayout ? styles.flex2 : styles.flex1,
            shouldUseNarrowLayout ? styles.alignItemsStart : styles.alignItemsCenter,
            shouldUseNarrowLayout ? styles.justifyContentCenter : styles.justifyContentStart,
        ]}>
                <Text_1.default numberOfLines={1} style={[styles.textNormalThemeText]}>
                    {lastFourPAN}
                </Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[
            !shouldUseNarrowLayout ? styles.flexRow : styles.flexColumn,
            shouldUseNarrowLayout ? styles.flex3 : styles.flex1,
            !shouldUseNarrowLayout && styles.gap2,
            !shouldUseNarrowLayout ? styles.alignItemsCenter : styles.alignItemsEnd,
            shouldUseNarrowLayout ? styles.justifyContentStart : styles.justifyContentEnd,
        ]}>
                <Text_1.default numberOfLines={1} style={[styles.textNormalThemeText]}>
                    {(0, CurrencyUtils_1.convertToShortDisplayString)(limit, currency)}
                </Text_1.default>
                {shouldUseNarrowLayout && (<Text_1.default numberOfLines={1} style={[styles.textLabelSupporting, styles.lh16]}>
                        {cardType}
                    </Text_1.default>)}
            </react_native_1.View>
        </react_native_1.View>);
}
WorkspaceCardListRow.displayName = 'WorkspaceCardListRow';
exports.default = WorkspaceCardListRow;
