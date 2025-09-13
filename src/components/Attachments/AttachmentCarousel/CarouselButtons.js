"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function CarouselButtons({ page, attachments, shouldShowArrows, onBack, onForward, cancelAutoHideArrow, autoHideArrow }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const isBackDisabled = page === 0;
    const isForwardDisabled = page === attachments.length - 1;
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return shouldShowArrows ? (<>
            {!isBackDisabled && (<Tooltip_1.default text={translate('common.previous')}>
                    <react_native_1.View style={[styles.attachmentArrow, shouldUseNarrowLayout ? styles.l2 : styles.l8]}>
                        <Button_1.default small innerStyles={[styles.arrowIcon]} icon={Expensicons.BackArrow} iconFill={theme.text} onPress={onBack} onPressIn={cancelAutoHideArrow} onPressOut={autoHideArrow}/>
                    </react_native_1.View>
                </Tooltip_1.default>)}
            {!isForwardDisabled && (<Tooltip_1.default text={translate('common.next')}>
                    <react_native_1.View style={[styles.attachmentArrow, shouldUseNarrowLayout ? styles.r2 : styles.r8]}>
                        <Button_1.default small innerStyles={[styles.arrowIcon]} icon={Expensicons.ArrowRight} iconFill={theme.text} onPress={onForward} onPressIn={cancelAutoHideArrow} onPressOut={autoHideArrow}/>
                    </react_native_1.View>
                </Tooltip_1.default>)}
        </>) : null;
}
CarouselButtons.displayName = 'CarouselButtons';
exports.default = CarouselButtons;
