"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CarouselButtons_1 = require("@components/Attachments/AttachmentCarousel/CarouselButtons");
const Pager_1 = require("@components/Attachments/AttachmentCarousel/Pager");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const variables_1 = require("@styles/variables");
function AttachmentCarouselView({ page, attachments, shouldShowArrows, source, report, autoHideArrows, cancelAutoHideArrow, setShouldShowArrows, onAttachmentError, onAttachmentLoaded, onNavigate, onClose, setPage, attachmentID, }) {
    const { translate } = (0, useLocalize_1.default)();
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    const styles = (0, useThemeStyles_1.default)();
    const [activeAttachmentID, setActiveAttachmentID] = (0, react_1.useState)(attachmentID ?? source);
    const pagerRef = (0, react_1.useRef)(null);
    /** Updates the page state when the user navigates between attachments */
    const updatePage = (0, react_1.useCallback)((newPageIndex) => {
        react_native_1.Keyboard.dismiss();
        setShouldShowArrows(true);
        const item = attachments.at(newPageIndex);
        setPage(newPageIndex);
        if (newPageIndex >= 0 && item) {
            setActiveAttachmentID(item.attachmentID ?? item.source);
            if (onNavigate) {
                onNavigate(item);
            }
            onNavigate?.(item);
        }
    }, [setShouldShowArrows, attachments, setPage, onNavigate]);
    /**
     * Increments or decrements the index to get another selected item
     * @param {Number} deltaSlide
     */
    const cycleThroughAttachments = (0, react_1.useCallback)((deltaSlide) => {
        if (page === undefined) {
            return;
        }
        const nextPageIndex = page + deltaSlide;
        updatePage(nextPageIndex);
        pagerRef.current?.setPage(nextPageIndex);
        autoHideArrows();
    }, [autoHideArrows, page, updatePage]);
    return (<react_native_1.View style={[styles.flex1, styles.attachmentCarouselContainer]} onMouseEnter={() => !canUseTouchScreen && setShouldShowArrows(true)} onMouseLeave={() => !canUseTouchScreen && setShouldShowArrows(false)}>
            {page === -1 ? (<BlockingView_1.default icon={Illustrations.ToddBehindCloud} iconWidth={variables_1.default.modalTopIconWidth} iconHeight={variables_1.default.modalTopIconHeight} title={translate('notFound.notHere')}/>) : (<>
                    <CarouselButtons_1.default page={page} attachments={attachments} shouldShowArrows={shouldShowArrows} onBack={() => cycleThroughAttachments(-1)} onForward={() => cycleThroughAttachments(1)} autoHideArrow={autoHideArrows} cancelAutoHideArrow={cancelAutoHideArrow}/>
                    <Pager_1.default items={attachments} initialPage={page} onAttachmentError={onAttachmentError} onAttachmentLoaded={onAttachmentLoaded} activeAttachmentID={activeAttachmentID} setShouldShowArrows={setShouldShowArrows} onPageSelected={({ nativeEvent: { position: newPage } }) => updatePage(newPage)} onClose={onClose} ref={pagerRef} reportID={report?.reportID}/>
                </>)}
        </react_native_1.View>);
}
AttachmentCarouselView.displayName = 'AttachmentCarouselView';
exports.default = AttachmentCarouselView;
