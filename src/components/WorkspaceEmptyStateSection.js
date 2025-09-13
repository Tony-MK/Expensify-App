"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Icon_1 = require("./Icon");
const Text_1 = require("./Text");
function WorkspaceEmptyStateSection({ icon, subtitle, title, containerStyle, shouldStyleAsCard = true, subtitleComponent }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<react_native_1.View style={[
            styles.pageWrapper,
            shouldStyleAsCard && styles.cardSectionContainer,
            styles.workspaceSection,
            styles.ph8,
            shouldUseNarrowLayout ? styles.pv10 : styles.pv12,
            containerStyle,
        ]}>
            <Icon_1.default src={icon} width={184} height={116}/>

            <react_native_1.View style={[styles.w100, styles.pt5]}>
                <react_native_1.View style={[styles.flexRow, styles.justifyContentCenter, styles.w100, styles.mh1, styles.flexShrink1]}>
                    <Text_1.default style={[styles.textHeadline, styles.emptyCardSectionTitle]}>{title}</Text_1.default>
                </react_native_1.View>

                {(!!subtitle || !!subtitleComponent) && (<react_native_1.View style={[styles.flexRow, styles.justifyContentCenter, styles.w100, styles.mt1, styles.mh1]}>
                        {subtitleComponent ?? <Text_1.default style={[styles.textNormal, styles.emptyCardSectionSubtitle]}>{subtitle}</Text_1.default>}
                    </react_native_1.View>)}
            </react_native_1.View>
        </react_native_1.View>);
}
WorkspaceEmptyStateSection.displayName = 'WorkspaceEmptyStateSection';
exports.default = WorkspaceEmptyStateSection;
