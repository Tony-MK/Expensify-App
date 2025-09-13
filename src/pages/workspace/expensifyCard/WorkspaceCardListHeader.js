"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
function WorkspaceCardListHeader({ cardSettings }) {
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isMediumScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isLessThanMediumScreen = isMediumScreenWidth || isSmallScreenWidth;
    const errorMessage = (0, ErrorUtils_1.getLatestErrorMessage)(cardSettings) ?? '';
    return (<react_native_1.View style={styles.appBG}>
            {!!errorMessage && (<react_native_1.View style={[styles.mh5, styles.pr4, styles.mt2]}>
                    <FormHelpMessage_1.default isError message={errorMessage}/>
                </react_native_1.View>)}
            <react_native_1.View style={[styles.flexRow, styles.mh5, styles.gap2, styles.p4, isLessThanMediumScreen ? styles.mt3 : styles.mt5]}>
                <react_native_1.View style={[styles.flexRow, styles.flex4, styles.gap2, styles.alignItemsCenter]}>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.lh16]}>
                        {translate('workspace.expensifyCard.name')}
                    </Text_1.default>
                </react_native_1.View>
                {!shouldUseNarrowLayout && (<react_native_1.View style={[styles.flexRow, styles.gap2, styles.flex1, styles.alignItemsCenter, styles.justifyContentStart]}>
                        <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.lh16]}>
                            {translate('common.type')}
                        </Text_1.default>
                    </react_native_1.View>)}
                <react_native_1.View style={[
            styles.flexRow,
            styles.gap2,
            shouldUseNarrowLayout ? styles.flex2 : styles.flex1,
            styles.alignItemsCenter,
            shouldUseNarrowLayout ? styles.justifyContentCenter : styles.justifyContentStart,
        ]}>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.lh16]}>
                        {translate('workspace.expensifyCard.lastFour')}
                    </Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.flexRow, shouldUseNarrowLayout ? styles.flex3 : styles.flex1, styles.gap2, styles.alignItemsCenter, styles.justifyContentEnd]}>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, styles.lh16]}>
                        {translate('workspace.expensifyCard.limit')}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
WorkspaceCardListHeader.displayName = 'WorkspaceCardListHeader';
exports.default = WorkspaceCardListHeader;
