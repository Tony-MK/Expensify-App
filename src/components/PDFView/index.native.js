"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_pdf_1 = require("react-native-pdf");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const KeyboardAvoidingView_1 = require("@components/KeyboardAvoidingView");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const CONST_1 = require("@src/CONST");
const PDFPasswordForm_1 = require("./PDFPasswordForm");
/**
 * On the native layer, we use react-native-pdf/PDF to display PDFs. If a PDF is
 * password-protected we render a PDFPasswordForm to request a password
 * from the user.
 *
 * In order to render things nicely during a password challenge we need
 * to keep track of additional state. In particular, the
 * react-native-pdf/PDF component is both conditionally rendered and hidden
 * depending upon the situation. It needs to be rerendered on each password
 * submission because it doesn't dynamically handle updates to its
 * password property. And we need to hide it during password challenges
 * so that PDFPasswordForm doesn't bounce when react-native-pdf/PDF
 * is (temporarily) rendered.
 */
const LOADING_THUMBNAIL_HEIGHT = 250;
const LOADING_THUMBNAIL_WIDTH = 250;
function PDFView({ onToggleKeyboard, onLoadComplete, fileName, onPress, isFocused, onScaleChanged, sourceURL, onLoadError, isUsedAsChatAttachment }) {
    const [shouldRequestPassword, setShouldRequestPassword] = (0, react_1.useState)(false);
    const [shouldAttemptPDFLoad, setShouldAttemptPDFLoad] = (0, react_1.useState)(true);
    const [shouldShowLoadingIndicator, setShouldShowLoadingIndicator] = (0, react_1.useState)(true);
    const [isPasswordInvalid, setIsPasswordInvalid] = (0, react_1.useState)(false);
    const [failedToLoadPDF, setFailedToLoadPDF] = (0, react_1.useState)(false);
    const [successToLoadPDF, setSuccessToLoadPDF] = (0, react_1.useState)(false);
    const [password, setPassword] = (0, react_1.useState)('');
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const themeStyles = (0, useThemeStyles_1.default)();
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    (0, react_1.useEffect)(() => {
        onToggleKeyboard?.(isKeyboardShown);
    });
    /**
     * Initiate password challenge if message received from react-native-pdf/PDF
     * indicates that a password is required or invalid.
     *
     * For a password challenge the message is "Password required or incorrect password."
     * Note that the message doesn't specify whether the password is simply empty or
     * invalid.
     */
    const initiatePasswordChallenge = (0, react_1.useCallback)(() => {
        setShouldShowLoadingIndicator(false);
        // Render password form, and don't render PDF and loading indicator.
        setShouldRequestPassword(true);
        setShouldAttemptPDFLoad(false);
        // The message provided by react-native-pdf doesn't indicate whether this
        // is an initial password request or if the password is invalid. So we just assume
        // that if a password was already entered then it's an invalid password error.
        if (password) {
            setIsPasswordInvalid(true);
        }
    }, [password]);
    const handleFailureToLoadPDF = ((error) => {
        if (error.message.match(/password/i)) {
            initiatePasswordChallenge();
            return;
        }
        setFailedToLoadPDF(true);
        setShouldShowLoadingIndicator(false);
        setShouldRequestPassword(false);
        setShouldAttemptPDFLoad(false);
        onLoadError?.();
        // eslint-disable-next-line @typescript-eslint/ban-types
    });
    /**
     * When the password is submitted via PDFPasswordForm, save the password
     * in state and attempt to load the PDF. Also show the loading indicator
     * since react-native-pdf/PDF will need to reload the PDF.
     *
     * @param pdfPassword Password submitted via PDFPasswordForm
     */
    const attemptPDFLoadWithPassword = (pdfPassword) => {
        // Render react-native-pdf/PDF so that it can validate the password.
        // Note that at this point in the password challenge, shouldRequestPassword is true.
        // Thus react-native-pdf/PDF will be rendered - but not visible.
        setPassword(pdfPassword);
        setShouldAttemptPDFLoad(true);
        setShouldShowLoadingIndicator(true);
    };
    /**
     * After the PDF is successfully loaded hide PDFPasswordForm and the loading
     * indicator.
     * @param numberOfPages
     * @param path - Path to cache location
     */
    const finishPDFLoad = (numberOfPages, path) => {
        setShouldRequestPassword(false);
        setShouldShowLoadingIndicator(false);
        setSuccessToLoadPDF(true);
        onLoadComplete(path);
    };
    function renderPDFView() {
        const pdfWidth = isUsedAsChatAttachment ? LOADING_THUMBNAIL_WIDTH : windowWidth;
        const pdfHeight = isUsedAsChatAttachment ? LOADING_THUMBNAIL_HEIGHT : windowHeight;
        const pdfStyles = [themeStyles.imageModalPDF, StyleUtils.getWidthAndHeightStyle(pdfWidth, pdfHeight)];
        // If we haven't yet successfully validated the password and loaded the PDF,
        // then we need to hide the react-native-pdf/PDF component so that PDFPasswordForm
        // is positioned nicely. We're specifically hiding it because we still need to render
        // the PDF component so that it can validate the password.
        if (shouldRequestPassword) {
            pdfStyles.push(themeStyles.invisible);
        }
        const containerStyles = 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        isUsedAsChatAttachment || (shouldRequestPassword && shouldUseNarrowLayout) ? [themeStyles.w100, themeStyles.flex1] : [themeStyles.alignItemsCenter, themeStyles.flex1];
        const loadingIndicatorStyles = isUsedAsChatAttachment
            ? [themeStyles.chatItemPDFAttachmentLoading, StyleUtils.getWidthAndHeightStyle(LOADING_THUMBNAIL_WIDTH, LOADING_THUMBNAIL_HEIGHT)]
            : [];
        return (<react_native_1.View style={containerStyles}>
                {shouldAttemptPDFLoad && (<react_native_pdf_1.default fitPolicy={0} trustAllCerts={false} renderActivityIndicator={() => <FullscreenLoadingIndicator_1.default style={loadingIndicatorStyles}/>} source={{ uri: sourceURL, cache: true, expiration: 864000 }} style={pdfStyles} onError={handleFailureToLoadPDF} password={password} onLoadComplete={finishPDFLoad} onPageSingleTap={onPress} onScaleChanged={onScaleChanged}/>)}
                {shouldRequestPassword && (<KeyboardAvoidingView_1.default style={themeStyles.flex1}>
                        <PDFPasswordForm_1.default isFocused={!!isFocused} onSubmit={attemptPDFLoadWithPassword} onPasswordUpdated={() => setIsPasswordInvalid(false)} isPasswordInvalid={isPasswordInvalid} shouldShowLoadingIndicator={shouldShowLoadingIndicator}/>
                    </KeyboardAvoidingView_1.default>)}
            </react_native_1.View>);
    }
    return onPress ? (<PressableWithoutFeedback_1.default onPress={onPress} fullDisabled={successToLoadPDF} style={[themeStyles.flex1, themeStyles.alignSelfStretch, !failedToLoadPDF && themeStyles.flexRow]} accessibilityRole={CONST_1.default.ROLE.BUTTON} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    accessibilityLabel={fileName || translate('attachmentView.unknownFilename')}>
            {renderPDFView()}
        </PressableWithoutFeedback_1.default>) : (renderPDFView());
}
PDFView.displayName = 'PDFView';
exports.default = PDFView;
