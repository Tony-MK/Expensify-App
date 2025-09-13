"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Browser_1 = require("@libs/Browser");
const Visibility_1 = require("@libs/Visibility");
const CONST_1 = require("@src/CONST");
/**
 * Returns acceptable FileTypes based on ATTACHMENT_PICKER_TYPE
 */
function getAcceptableFileTypes(type) {
    if (type !== CONST_1.default.ATTACHMENT_PICKER_TYPE.IMAGE || (0, Browser_1.isMobileChrome)()) {
        return;
    }
    return 'image/*';
}
function getAcceptableFileTypesFromAList(fileTypes) {
    const acceptValue = fileTypes
        .map((type) => {
        switch (type) {
            case 'msword':
                return 'application/msword';
            case 'text':
                return 'text/plain';
            case 'message':
                return 'message/rfc822';
            default:
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return `.${type}`;
        }
    })
        .join(',');
    return acceptValue;
}
/**
 * This component renders a function as a child and
 * returns a "show attachment picker" method that takes
 * a callback. This is the web/mWeb/desktop version since
 * on a Browser we must append a hidden input to the DOM
 * and listen to onChange event.
 */
function AttachmentPicker({ children, type = CONST_1.default.ATTACHMENT_PICKER_TYPE.FILE, acceptedFileTypes, allowMultiple = false }) {
    const fileInput = (0, react_1.useRef)(null);
    const onPicked = (0, react_1.useRef)(() => { });
    const onCanceled = (0, react_1.useRef)(() => { });
    const isPickingRef = (0, react_1.useRef)(false);
    return (<>
            <input hidden type="file" ref={fileInput} onChange={(e) => {
            isPickingRef.current = false;
            if (!e.target.files) {
                return;
            }
            if (allowMultiple && e.target.files.length > 1) {
                const files = Array.from(e.target.files).map((currentFile) => {
                    // eslint-disable-next-line no-param-reassign
                    currentFile.uri = URL.createObjectURL(currentFile);
                    return currentFile;
                });
                onPicked.current(files);
            }
            else if (e.target.files[0]) {
                const file = e.target.files[0];
                file.uri = URL.createObjectURL(file);
                onPicked.current([file]);
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
                isPickingRef.current = false;
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
        }} accept={acceptedFileTypes ? getAcceptableFileTypesFromAList(acceptedFileTypes) : getAcceptableFileTypes(type)} multiple={allowMultiple}/>
            {/* eslint-disable-next-line react-compiler/react-compiler */}
            {children({
            openPicker: ({ onPicked: newOnPicked, onCanceled: newOnCanceled = () => { } }) => {
                if (isPickingRef.current) {
                    return;
                }
                isPickingRef.current = true;
                onPicked.current = newOnPicked;
                fileInput.current?.click();
                onCanceled.current = newOnCanceled;
            },
        })}
        </>);
}
AttachmentPicker.displayName = 'AttachmentPicker';
exports.default = AttachmentPicker;
