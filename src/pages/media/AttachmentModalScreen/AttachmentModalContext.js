"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentModalContextProvider = AttachmentModalContextProvider;
const react_1 = require("react");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const AttachmentModalContext = react_1.default.createContext({
    isAttachmentHidden: () => false,
    updateHiddenAttachments: () => { },
    setCurrentAttachment: () => { },
    getCurrentAttachment: () => undefined,
});
function AttachmentModalContextProvider({ children }) {
    const currentReportID = (0, useCurrentReportID_1.default)();
    const hiddenAttachments = (0, react_1.useRef)({});
    (0, react_1.useEffect)(() => {
        // We only want to store the attachment visibility for the current report.
        // If the current report ID changes, clear the ref.
        hiddenAttachments.current = {};
    }, [currentReportID?.currentReportID]);
    const currentAttachment = (0, react_1.useRef)(undefined);
    const setCurrentAttachment = (0, react_1.useCallback)((attachmentProps) => {
        currentAttachment.current = attachmentProps;
    }, []);
    const getCurrentAttachment = (0, react_1.useCallback)(() => currentAttachment.current, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        isAttachmentHidden: (reportActionID) => hiddenAttachments.current[reportActionID],
        updateHiddenAttachments: (reportActionID, value) => {
            hiddenAttachments.current = {
                ...hiddenAttachments.current,
                [reportActionID]: value,
            };
        },
        setCurrentAttachment,
        getCurrentAttachment,
    }), [setCurrentAttachment, getCurrentAttachment]);
    return <AttachmentModalContext.Provider value={contextValue}>{children}</AttachmentModalContext.Provider>;
}
AttachmentModalContextProvider.displayName = 'AttachmentModalContextProvider';
exports.default = AttachmentModalContext;
