"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
/**
 * This component doesn't render anything. It runs a side effect to update the comment of a report under certain conditions.
 * It is connected to the actual draft comment in onyx. The comment in onyx might updates multiple times, and we want to avoid
 * re-rendering a UI component for that. That's why the side effect was moved down to a separate component.
 */
function SilentCommentUpdater({ commentRef, reportID, value, updateComment, isCommentPendingSaved }) {
    const [comment = '', commentResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`, { canBeMissing: true });
    const prevCommentProp = (0, usePrevious_1.default)(comment);
    const prevReportId = (0, usePrevious_1.default)(reportID);
    const { preferredLocale } = (0, useLocalize_1.default)();
    const prevPreferredLocale = (0, usePrevious_1.default)(preferredLocale);
    (0, react_1.useEffect)(() => {
        if ((0, isLoadingOnyxValue_1.default)(commentResult)) {
            return;
        }
        // Value state does not have the same value as comment props when the comment gets changed from another tab.
        // In this case, we should synchronize the value between tabs.
        const shouldSyncComment = prevCommentProp !== comment && value !== comment && !isCommentPendingSaved.current;
        // As the report IDs change, make sure to update the composer comment as we need to make sure
        // we do not show incorrect data in there (ie. draft of message from other report).
        if (preferredLocale === prevPreferredLocale && reportID === prevReportId && !shouldSyncComment) {
            return;
        }
        updateComment(comment ?? '');
    }, [prevCommentProp, prevPreferredLocale, prevReportId, comment, preferredLocale, reportID, updateComment, value, commentRef, isCommentPendingSaved, commentResult]);
    return null;
}
SilentCommentUpdater.displayName = 'SilentCommentUpdater';
exports.default = SilentCommentUpdater;
