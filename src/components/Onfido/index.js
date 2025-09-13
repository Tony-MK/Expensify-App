"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseOnfidoWeb_1 = require("./BaseOnfidoWeb");
function Onfido({ sdkToken, onSuccess, onError, onUserExit }) {
    const baseOnfidoRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const onfidoOut = baseOnfidoRef.current?.onfidoOut;
        const observer = new MutationObserver(() => {
            const fidoRef = baseOnfidoRef.current;
            /** This condition is needed because we are using external embedded content and they are
             * causing two scrollbars to be displayed which make it difficult to accept the consent for
             * the processing of biometric data and sensitive data we are resizing the first iframe so
             * that this problem no longer occurs.
             */
            if (fidoRef) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                const onfidoSdk = fidoRef.querySelector('#onfido-sdk > iframe');
                if (onfidoSdk) {
                    const viewportHeight = window.innerHeight; // Get the viewport height
                    const desiredHeight = viewportHeight * 0.8;
                    onfidoSdk.style.height = `${desiredHeight}px`;
                }
            }
        });
        if (baseOnfidoRef.current) {
            observer.observe(baseOnfidoRef.current, { attributes: false, childList: true, subtree: true });
        }
        if (!onfidoOut) {
            return;
        }
        onfidoOut.tearDown();
        // Clean up function to remove the observer when component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);
    (0, react_1.useEffect)(() => { }, []);
    return (<BaseOnfidoWeb_1.default ref={baseOnfidoRef} sdkToken={sdkToken} onSuccess={onSuccess} onError={onError} onUserExit={onUserExit}/>);
}
Onfido.displayName = 'Onfido';
exports.default = Onfido;
