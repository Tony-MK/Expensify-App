"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function EmptyMoneyRequestReportPreview() {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<react_native_1.View style={[styles.alignItemsCenter, styles.highlightBG, styles.ml0, styles.mr0, styles.gap4, styles.reportContainerBorderRadius]}>
            <react_native_1.View style={[styles.emptyStateMoneyRequestPreviewReport, styles.justifyContentCenter, styles.alignItemsCenter]}>
                <react_native_1.View style={[{ width: shouldUseNarrowLayout ? '100%' : 303 }, styles.m1, styles.justifyContentCenter, styles.alignItemsCenter, styles.gap4]}>
                    <ImageSVG_1.default fill={theme.border} height={64} width={64} src={Expensicons.Folder}/>
                    <Text_1.default style={[styles.textAlignCenter, styles.textSupporting, styles.fontSizeLabel]}>{translate('search.moneyRequestReport.emptyStateTitle')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
EmptyMoneyRequestReportPreview.displayName = 'EmptyRequestReport';
exports.default = EmptyMoneyRequestReportPreview;
