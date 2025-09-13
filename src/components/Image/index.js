"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Session_1 = require("@libs/actions/Session");
const AttachmentImageReauthenticator_1 = require("@libs/actions/Session/AttachmentImageReauthenticator");
const CONST_1 = require("@src/CONST");
const BaseImage_1 = require("./BaseImage");
const ImageBehaviorContextProvider_1 = require("./ImageBehaviorContextProvider");
function Image({ source: propsSource, isAuthTokenRequired = false, onLoad, objectPosition = CONST_1.default.IMAGE_OBJECT_POSITION.INITIAL, style, loadingIconSize, loadingIndicatorStyles, ...forwardedProps }) {
    const [aspectRatio, setAspectRatio] = (0, react_1.useState)(null);
    const isObjectPositionTop = objectPosition === CONST_1.default.IMAGE_OBJECT_POSITION.TOP;
    const session = (0, OnyxListItemProvider_1.useSession)();
    const { shouldSetAspectRatioInStyle } = (0, react_1.useContext)(ImageBehaviorContextProvider_1.ImageBehaviorContext);
    const updateAspectRatio = (0, react_1.useCallback)((width, height) => {
        if (!isObjectPositionTop) {
            return;
        }
        if (width > height) {
            setAspectRatio(1);
            return;
        }
        setAspectRatio(height ? width / height : 'auto');
    }, [isObjectPositionTop]);
    const handleLoad = (0, react_1.useCallback)((event) => {
        const { width, height } = event.nativeEvent;
        onLoad?.(event);
        updateAspectRatio(width, height);
    }, [onLoad, updateAspectRatio]);
    // accepted sessions are sessions of a certain criteria that we think can necessitate a reload of the images
    // because images sources barely changes unless specific events occur like network issues (offline/online) per example.
    // Here we target new session received less than 60s after the previous session (that could be from fresh reauthentication, the previous session was not necessarily expired)
    // or new session after the previous session was expired (based on timestamp gap between the 2 creationDate and the freshness of the new session).
    const isAcceptedSession = (0, react_1.useCallback)((sessionCreationDateDiff, sessionCreationDate) => {
        return sessionCreationDateDiff < 60000 || (sessionCreationDateDiff >= CONST_1.default.SESSION_EXPIRATION_TIME_MS && new Date().getTime() - sessionCreationDate < 60000);
    }, []);
    /**
     * trying to figure out if the current session is expired or fresh from a necessary reauthentication
     */
    const previousSessionAge = (0, react_1.useRef)(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const validSessionAge = (0, react_1.useMemo)(() => {
        // Authentication is required only for certain types of images (attachments and receipts),
        // so we only calculate the session age for those
        if (!isAuthTokenRequired) {
            return undefined;
        }
        if (session?.creationDate) {
            if (previousSessionAge.current) {
                // Most likely a reauthentication happened, but unless the calculated source is different from the previous, the image won't reload
                if (isAcceptedSession(session.creationDate - previousSessionAge.current, session.creationDate)) {
                    return session.creationDate;
                }
                return previousSessionAge.current;
            }
            if ((0, Session_1.isExpiredSession)(session.creationDate)) {
                // reset the countdown to now so future sessions creationDate can be compared to that time
                return new Date().getTime();
            }
            return session.creationDate;
        }
        return undefined;
    }, [session, isAuthTokenRequired, isAcceptedSession]);
    (0, react_1.useEffect)(() => {
        if (!isAuthTokenRequired) {
            return;
        }
        previousSessionAge.current = validSessionAge;
    });
    /**
     * Check if the image source is a URL - if so the `encryptedAuthToken` is appended
     * to the source.
     */
    const source = (0, react_1.useMemo)(() => {
        if (typeof propsSource === 'object' && 'uri' in propsSource) {
            if (typeof propsSource.uri === 'number') {
                return propsSource.uri;
            }
            const authToken = session?.encryptedAuthToken ?? null;
            if (isAuthTokenRequired && authToken) {
                if (!!session?.creationDate && !(0, Session_1.isExpiredSession)(session.creationDate)) {
                    return {
                        ...propsSource,
                        headers: {
                            [CONST_1.default.CHAT_ATTACHMENT_TOKEN_KEY]: authToken,
                        },
                    };
                }
                if (session) {
                    (0, AttachmentImageReauthenticator_1.default)(session);
                }
                return undefined;
            }
        }
        return propsSource;
        // The session prop is not required, as it causes the image to reload whenever the session changes. For more information, please refer to issue #26034.
        // but we still need the image to reload sometimes (example : when the current session is expired)
        // by forcing a recalculation of the source (which value could indeed change) through the modification of the variable validSessionAge
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [propsSource, isAuthTokenRequired, validSessionAge]);
    (0, react_1.useEffect)(() => {
        if (!isAuthTokenRequired || source !== undefined) {
            return;
        }
        forwardedProps?.waitForSession?.();
    }, [source, isAuthTokenRequired, forwardedProps]);
    /**
     * If the image fails to load and the object position is top, we should hide the image by setting the opacity to 0.
     */
    const shouldOpacityBeZero = isObjectPositionTop && !aspectRatio;
    if (source === undefined && !!forwardedProps?.waitForSession) {
        return undefined;
    }
    if (source === undefined) {
        return (<FullscreenLoadingIndicator_1.default iconSize={loadingIconSize} style={loadingIndicatorStyles}/>);
    }
    return (<BaseImage_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...forwardedProps} onLoad={handleLoad} style={[style, shouldSetAspectRatioInStyle && aspectRatio ? { aspectRatio, height: 'auto' } : {}, shouldOpacityBeZero && { opacity: 0 }]} source={source}/>);
}
function imagePropsAreEqual(prevProps, nextProps) {
    return prevProps.source === nextProps.source;
}
const ImageWithOnyx = react_1.default.memo(Image, imagePropsAreEqual);
ImageWithOnyx.displayName = 'Image';
exports.default = ImageWithOnyx;
