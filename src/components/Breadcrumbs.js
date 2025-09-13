"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_wordmark_svg_1 = require("@assets/images/expensify-wordmark.svg");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const Header_1 = require("./Header");
const ImageSVG_1 = require("./ImageSVG");
const Text_1 = require("./Text");
function Breadcrumbs({ breadcrumbs, style }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [primaryBreadcrumb, secondaryBreadcrumb] = breadcrumbs;
    const isRootBreadcrumb = primaryBreadcrumb.type === CONST_1.default.BREADCRUMB_TYPE.ROOT;
    const fontScale = react_native_1.PixelRatio.getFontScale() > CONST_1.default.LOGO_MAX_SCALE ? CONST_1.default.LOGO_MAX_SCALE : react_native_1.PixelRatio.getFontScale();
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1, styles.w100, styles.breadcrumbsContainer, style]}>
            {isRootBreadcrumb ? (<react_native_1.View style={styles.breadcrumbLogo}>
                    <Header_1.default title={<ImageSVG_1.default contentFit="contain" src={expensify_wordmark_svg_1.default} fill={theme.text} width={variables_1.default.lhnLogoWidth * fontScale} height={variables_1.default.lhnLogoHeight * fontScale}/>} style={styles.justifyContentCenter} shouldShowEnvironmentBadge/>
                </react_native_1.View>) : (<Text_1.default numberOfLines={1} style={[styles.flexShrink1, styles.breadcrumb, styles.breadcrumbStrong]}>
                    {primaryBreadcrumb.text}
                </Text_1.default>)}

            {!!secondaryBreadcrumb && (<>
                    <Text_1.default style={[styles.breadcrumbSeparator]}>/</Text_1.default>
                    <Text_1.default numberOfLines={1} style={[styles.mw75, styles.breadcrumb, isRootBreadcrumb ? styles.flex1 : styles.flexShrink0]}>
                        {secondaryBreadcrumb.text}
                    </Text_1.default>
                </>)}
        </react_native_1.View>);
}
Breadcrumbs.displayName = 'Breadcrumbs';
exports.default = Breadcrumbs;
