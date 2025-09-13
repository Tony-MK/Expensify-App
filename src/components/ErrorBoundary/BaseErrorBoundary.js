"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_error_boundary_1 = require("react-error-boundary");
const BootSplash_1 = require("@libs/BootSplash");
const GenericErrorPage_1 = require("@pages/ErrorPage/GenericErrorPage");
const UpdateRequiredView_1 = require("@pages/ErrorPage/UpdateRequiredView");
const CONST_1 = require("@src/CONST");
const SplashScreenStateContext_1 = require("@src/SplashScreenStateContext");
/**
 * This component captures an error in the child component tree and logs it to the server
 * It can be used to wrap the entire app as well as to wrap specific parts for more granularity
 * @see {@link https://reactjs.org/docs/error-boundaries.html#where-to-place-error-boundaries}
 */
function BaseErrorBoundary({ logError = () => { }, errorMessage, children }) {
    const [errorContent, setErrorContent] = (0, react_1.useState)('');
    const { setSplashScreenState } = (0, SplashScreenStateContext_1.useSplashScreenStateContext)();
    const catchError = (errorObject, errorInfo) => {
        logError(errorMessage, errorObject, JSON.stringify(errorInfo));
        // We hide the splash screen since the error might happened during app init
        BootSplash_1.default.hide().then(() => setSplashScreenState(CONST_1.default.BOOT_SPLASH_STATE.HIDDEN));
        setErrorContent(errorObject.message);
    };
    const updateRequired = errorContent === CONST_1.default.ERROR.UPDATE_REQUIRED;
    return (<react_error_boundary_1.ErrorBoundary FallbackComponent={updateRequired ? UpdateRequiredView_1.default : GenericErrorPage_1.default} onError={catchError}>
            {children}
        </react_error_boundary_1.ErrorBoundary>);
}
BaseErrorBoundary.displayName = 'BaseErrorBoundary';
exports.default = BaseErrorBoundary;
