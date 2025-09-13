"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Visibility_1 = require("@libs/Visibility");
/**
 * This component renders a function as a child and
 * returns a "show file picker" method that takes
 * a callback. This is the web/mWeb/desktop version since
 * on a Browser we must append a hidden input to the DOM
 * and listen to onChange event.
 */
function FilePicker({ children, acceptableFileTypes = '' }) {
    const fileInput = (0, react_1.useRef)(null);
    const onPicked = (0, react_1.useRef)(() => { });
    const onCanceled = (0, react_1.useRef)(() => { });
    return (<>
            <input hidden type="file" ref={fileInput} onChange={(e) => {
            if (!e.target.files) {
                return;
            }
            const file = e.target.files[0];
            if (file) {
                file.uri = URL.createObjectURL(file);
                onPicked.current(file);
            }
            // Cleanup after selecting a file to start from a fresh state
            if (fileInput.current) {
                // eslint-disable-next-line react-compiler/react-compiler
                fileInput.current.value = '';
            }
        }} 
    // We are stopping the event propagation because triggering the `click()` on the hidden input
    // causes the event to unexpectedly bubble up to anything wrapping this component e.g. Pressable
    onClick={(e) => {
            e.stopPropagation();
            if (!fileInput.current) {
                return;
            }
            fileInput.current.addEventListener('cancel', () => {
                // For Android Chrome, the cancel event happens before the page is visible on physical devices,
                // which makes it unreliable for us to show the keyboard, while on emulators it happens after the page is visible.
                // So here we can delay calling the onCanceled.current function based on visibility in order to reliably show the keyboard.
                if (Visibility_1.default.isVisible()) {
                    onCanceled.current();
                    return;
                }
                const unsubscribeVisibilityListener = Visibility_1.default.onVisibilityChange(() => {
                    onCanceled.current();
                    unsubscribeVisibilityListener();
                });
            }, { once: true });
        }} accept={acceptableFileTypes}/>
            {/* eslint-disable-next-line react-compiler/react-compiler */}
            {children({
            openPicker: ({ onPicked: newOnPicked, onCanceled: newOnCanceled = () => { } }) => {
                onPicked.current = newOnPicked;
                fileInput.current?.click();
                onCanceled.current = newOnCanceled;
            },
        })}
        </>);
}
FilePicker.displayName = 'FilePicker';
exports.default = FilePicker;
