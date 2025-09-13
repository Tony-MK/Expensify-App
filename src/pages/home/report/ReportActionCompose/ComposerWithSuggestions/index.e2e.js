"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRerenderCount = exports.getRerenderCount = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const client_1 = require("@libs/E2E/client");
const ComposerWithSuggestions_1 = require("./ComposerWithSuggestions");
let rerenderCount = 0;
const getRerenderCount = () => rerenderCount;
exports.getRerenderCount = getRerenderCount;
const resetRerenderCount = () => {
    rerenderCount = 0;
};
exports.resetRerenderCount = resetRerenderCount;
function IncrementRenderCount() {
    rerenderCount += 1;
    return null;
}
function ComposerWithSuggestionsE2e(props, ref) {
    'use no memo';
    // we rely on waterfall rendering in react, so we intentionally disable compiler
    // for this component. This file is only used for e2e tests, so it's okay to
    // disable compiler for this file.
    const textInputRef = (0, react_1.useRef)(null);
    const hasFocusBeenRequested = (0, react_1.useRef)(false);
    const onLayout = (0, react_1.useCallback)((event) => {
        const testConfig = client_1.default.getCurrentActiveTestConfig();
        if (testConfig?.reportScreen && typeof testConfig.reportScreen !== 'string' && !testConfig?.reportScreen.autoFocus) {
            return;
        }
        const canRequestFocus = event.nativeEvent.layout.width > 0 && !hasFocusBeenRequested.current;
        if (!canRequestFocus) {
            return;
        }
        hasFocusBeenRequested.current = true;
        const setFocus = () => {
            console.debug('[E2E] Requesting focus for ComposerWithSuggestions');
            if (!(textInputRef && 'current' in textInputRef)) {
                console.error('[E2E] textInputRef is not available, failed to focus');
                return;
            }
            textInputRef.current?.focus(true);
            setTimeout(() => {
                // and actually let's verify that the keyboard is visible
                if (react_native_1.Keyboard.isVisible()) {
                    return;
                }
                textInputRef.current?.blur();
                setFocus();
                // 1000ms is enough time for any keyboard to open
            }, 1000);
        };
        // Simulate user behavior and don't set focus immediately
        setTimeout(setFocus, 2000);
    }, []);
    return (<ComposerWithSuggestions_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={(composerRef) => {
            textInputRef.current = composerRef;
            if (typeof ref === 'function') {
                ref(composerRef);
            }
        }} onLayout={onLayout}>
            {/* Important:
                this has to be a child, as this container might not
                re-render while the actual ComposerWithSuggestions will.
        */}
            <IncrementRenderCount />
        </ComposerWithSuggestions_1.default>);
}
ComposerWithSuggestionsE2e.displayName = 'ComposerWithSuggestionsE2e';
exports.default = (0, react_1.forwardRef)(ComposerWithSuggestionsE2e);
