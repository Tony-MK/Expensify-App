"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Accordion_1 = require("@components/Accordion");
const Icon_1 = require("@components/Icon");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Parser_1 = require("@libs/Parser");
const ICON_SIZE = 48;
function ToggleSettingOptionRow({ icon, title, customTitle, subtitle, subtitleStyle, accordionStyle, switchAccessibilityLabel, shouldPlaceSubtitleBelowSwitch, shouldEscapeText = undefined, shouldParseSubtitle = false, wrapperStyle, titleStyle, onToggle, subMenuItems, isActive, disabledAction, pendingAction, errors, onCloseError, disabled = false, showLockIcon = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(isActive);
    (0, react_1.useEffect)(() => {
        isAccordionExpanded.set(isActive);
    }, [isAccordionExpanded, isActive]);
    const subtitleHtml = (0, react_1.useMemo)(() => {
        if (!subtitle || !shouldParseSubtitle || typeof subtitle !== 'string') {
            return '';
        }
        return Parser_1.default.replace(subtitle, { shouldEscapeText });
    }, [subtitle, shouldParseSubtitle, shouldEscapeText]);
    const processedSubtitle = (0, react_1.useMemo)(() => {
        let textToWrap = '';
        if (shouldParseSubtitle) {
            textToWrap = subtitleHtml;
        }
        return textToWrap ? `<comment><muted-text-label>${textToWrap}</muted-text-label></comment>` : '';
    }, [shouldParseSubtitle, subtitleHtml]);
    const subTitleView = (0, react_1.useMemo)(() => {
        if (typeof subtitle === 'string') {
            if (!!subtitle && shouldParseSubtitle) {
                return (<react_native_1.View style={[styles.flexRow, styles.renderHTML, shouldPlaceSubtitleBelowSwitch ? styles.mt1 : { ...styles.mt1, ...styles.mr5 }]}>
                        <RenderHTML_1.default html={processedSubtitle}/>
                    </react_native_1.View>);
            }
            return <Text_1.default style={[styles.mutedNormalTextLabel, shouldPlaceSubtitleBelowSwitch ? styles.mt1 : { ...styles.mt1, ...styles.mr5 }, subtitleStyle]}>{subtitle}</Text_1.default>;
        }
        return subtitle;
    }, [
        subtitle,
        shouldParseSubtitle,
        styles.mutedNormalTextLabel,
        styles.mt1,
        styles.mr5,
        styles.flexRow,
        styles.renderHTML,
        shouldPlaceSubtitleBelowSwitch,
        subtitleStyle,
        processedSubtitle,
    ]);
    return (<OfflineWithFeedback_1.default pendingAction={pendingAction} errors={errors} errorRowStyles={[styles.mt2]} style={[wrapperStyle]} onClose={onCloseError}>
            <react_native_1.View style={styles.pRelative}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, shouldPlaceSubtitleBelowSwitch && styles.h10]}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.flex1]}>
                        {!!icon && (<Icon_1.default src={icon} height={ICON_SIZE} width={ICON_SIZE} additionalStyles={[styles.mr3]}/>)}
                        {customTitle ?? (<react_native_1.View style={[styles.flexColumn, styles.flex1]}>
                                <Text_1.default style={[styles.textNormal, styles.lh20, titleStyle]}>{title}</Text_1.default>
                                {!shouldPlaceSubtitleBelowSwitch && subtitle && subTitleView}
                            </react_native_1.View>)}
                    </react_native_1.View>
                    <Switch_1.default disabledAction={disabledAction} accessibilityLabel={switchAccessibilityLabel} onToggle={(isOn) => {
            shouldAnimateAccordionSection.set(true);
            onToggle(isOn);
        }} isOn={isActive} disabled={disabled} showLockIcon={showLockIcon}/>
                </react_native_1.View>
                {shouldPlaceSubtitleBelowSwitch && subtitle && subTitleView}
                <Accordion_1.default isExpanded={isAccordionExpanded} style={accordionStyle} isToggleTriggered={shouldAnimateAccordionSection}>
                    {subMenuItems}
                </Accordion_1.default>
            </react_native_1.View>
        </OfflineWithFeedback_1.default>);
}
exports.default = ToggleSettingOptionRow;
