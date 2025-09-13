"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/features/array/at");
const react_1 = require("react");
const react_fast_pdf_1 = require("react-fast-pdf");
const react_native_1 = require("react-native");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const variables_1 = require("@styles/variables");
const CanvasSize_1 = require("@userActions/CanvasSize");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PDFPasswordForm_1 = require("./PDFPasswordForm");
const LOADING_THUMBNAIL_HEIGHT = 250;
const LOADING_THUMBNAIL_WIDTH = 250;
function PDFView({ onToggleKeyboard, fileName, onPress, isFocused, sourceURL, style, isUsedAsChatAttachment, onLoadError }) {
    const [isKeyboardOpen, setIsKeyboardOpen] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const prevWindowHeight = (0, usePrevious_1.default)(windowHeight);
    const { translate } = (0, useLocalize_1.default)();
    const [maxCanvasArea] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MAX_CANVAS_AREA, { canBeMissing: true });
    const [maxCanvasHeight] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MAX_CANVAS_HEIGHT, { canBeMissing: true });
    const [maxCanvasWidth] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MAX_CANVAS_WIDTH, { canBeMissing: true });
    /**
     * On small screens notify parent that the keyboard has opened or closed.
     *
     * @param isKBOpen True if keyboard is open
     */
    const toggleKeyboardOnSmallScreens = (0, react_1.useCallback)((isKBOpen) => {
        if (!shouldUseNarrowLayout) {
            return;
        }
        setIsKeyboardOpen(isKBOpen);
        onToggleKeyboard?.(isKBOpen);
    }, [shouldUseNarrowLayout, onToggleKeyboard]);
    /**
     * Verify that the canvas limits have been calculated already, if not calculate them and put them in Onyx
     */
    const retrieveCanvasLimits = () => {
        if (!maxCanvasArea) {
            (0, CanvasSize_1.retrieveMaxCanvasArea)();
        }
        if (!maxCanvasHeight) {
            (0, CanvasSize_1.retrieveMaxCanvasHeight)();
        }
        if (!maxCanvasWidth) {
            (0, CanvasSize_1.retrieveMaxCanvasWidth)();
        }
    };
    (0, react_1.useEffect)(() => {
        retrieveCanvasLimits();
        // This rule needs to be applied so that this effect is executed only when the component is mounted
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        // Use window height changes to toggle the keyboard. To maintain keyboard state
        // on all platforms we also use focus/blur events. So we need to make sure here
        // that we avoid redundant keyboard toggling.
        // Minus 100px is needed to make sure that when the internet connection is
        // disabled in android chrome and a small 'No internet connection' text box appears,
        // we do not take it as a sign to open the keyboard
        if (!isKeyboardOpen && windowHeight < prevWindowHeight - 100) {
            toggleKeyboardOnSmallScreens(true);
        }
        else if (isKeyboardOpen && windowHeight > prevWindowHeight) {
            toggleKeyboardOnSmallScreens(false);
        }
    }, [isKeyboardOpen, prevWindowHeight, toggleKeyboardOnSmallScreens, windowHeight]);
    const renderPDFView = () => {
        const outerContainerStyle = [styles.w100, styles.h100, styles.justifyContentCenter, styles.alignItemsCenter];
        return (<react_native_1.View style={outerContainerStyle} tabIndex={0}>
                <react_fast_pdf_1.PDFPreviewer contentContainerStyle={style} file={sourceURL} pageMaxWidth={variables_1.default.pdfPageMaxWidth} isSmallScreen={shouldUseNarrowLayout} maxCanvasWidth={maxCanvasWidth} maxCanvasHeight={maxCanvasHeight} maxCanvasArea={maxCanvasArea} LoadingComponent={<FullscreenLoadingIndicator_1.default style={isUsedAsChatAttachment && [
                    styles.chatItemPDFAttachmentLoading,
                    StyleUtils.getWidthAndHeightStyle(LOADING_THUMBNAIL_WIDTH, LOADING_THUMBNAIL_HEIGHT),
                    styles.pRelative,
                ]}/>} shouldShowErrorComponent={false} onLoadError={onLoadError} renderPasswordForm={({ isPasswordInvalid, onSubmit, onPasswordChange }) => (<PDFPasswordForm_1.default isFocused={!!isFocused} isPasswordInvalid={isPasswordInvalid} onSubmit={onSubmit} onPasswordUpdated={onPasswordChange}/>)}/>
            </react_native_1.View>);
    };
    return onPress ? (<PressableWithoutFeedback_1.default onPress={onPress} style={[styles.flex1, styles.flexRow, styles.alignSelfStretch]} accessibilityRole={CONST_1.default.ROLE.BUTTON} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    accessibilityLabel={fileName || translate('attachmentView.unknownFilename')}>
            {renderPDFView()}
        </PressableWithoutFeedback_1.default>) : (renderPDFView());
}
exports.default = (0, react_1.memo)(PDFView);
