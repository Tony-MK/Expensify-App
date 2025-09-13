"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Adding .android component to disable updating comment when prev comment is different
 * it fixes issue on Android, assuming we don't need tab sync on mobiles - https://github.com/Expensify/App/issues/28562
 */
/**
 * This component doesn't render anything. It runs a side effect to update the comment of a report under certain conditions.
 * It is connected to the actual draft comment in onyx. The comment in onyx might updates multiple times, and we want to avoid
 * re-rendering a UI component for that. That's why the side effect was moved down to a separate component.
 */
function SilentCommentUpdater({ updateComment, reportID }) {
    const [comment = ''] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`, { canBeMissing: true });
    (0, react_1.useEffect)(() => {
        updateComment(comment);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- We need to run this on mount
    }, []);
    return null;
}
SilentCommentUpdater.displayName = 'SilentCommentUpdater';
exports.default = SilentCommentUpdater;
