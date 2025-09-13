"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const AttachmentModalHandler_1 = require("@libs/AttachmentModalHandler");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AttachmentModalBaseContent_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalBaseContent");
const AttachmentModalContext_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContext");
function AttachmentModalContainer({ contentProps, navigation, onShow, onClose }) {
    const attachmentsContext = (0, react_1.useContext)(AttachmentModalContext_1.default);
    const testID = typeof contentProps.source === 'string' ? contentProps.source : (contentProps.source?.toString() ?? '');
    const closeScreen = (0, react_1.useCallback)((options) => {
        attachmentsContext.setCurrentAttachment(undefined);
        const close = () => {
            onClose?.();
            Navigation_1.default.goBack();
            options?.onAfterClose?.();
        };
        if (options?.shouldCallDirectly) {
            close();
        }
        else {
            AttachmentModalHandler_1.default.handleModalClose(close);
        }
    }, [attachmentsContext, onClose]);
    (0, react_1.useEffect)(() => {
        onShow?.();
    }, [onShow]);
    return (<ScreenWrapper_1.default navigation={navigation} testID={`attachment-modal-${testID}`} enableEdgeToEdgeBottomSafeAreaPadding>
            <AttachmentModalBaseContent_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...contentProps} onClose={closeScreen}/>
        </ScreenWrapper_1.default>);
}
AttachmentModalContainer.displayName = 'AttachmentModalContainer';
exports.default = (0, react_1.memo)(AttachmentModalContainer);
