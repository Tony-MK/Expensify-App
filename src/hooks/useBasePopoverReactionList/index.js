"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useBasePopoverReactionList;
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmojiUtils = require("@libs/EmojiUtils");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
function useBasePopoverReactionList({ emojiName, emojiReactions, accountID, reportActionID, preferredLocale }) {
    const [isPopoverVisible, setIsPopoverVisible] = (0, react_1.useState)(false);
    const [cursorRelativePosition, setCursorRelativePosition] = (0, react_1.useState)({ horizontal: 0, vertical: 0 });
    const [popoverAnchorPosition, setPopoverAnchorPosition] = (0, react_1.useState)({ horizontal: 0, vertical: 0 });
    const reactionListRef = (0, react_1.useRef)(null);
    function getReactionInformation() {
        const selectedReaction = emojiReactions?.[emojiName];
        if (!selectedReaction) {
            // If there is no reaction, we return default values
            return {
                emojiName: '',
                reactionCount: 0,
                emojiCodes: [],
                hasUserReacted: false,
                users: [],
                isReady: false,
            };
        }
        const { emojiCodes, reactionCount, hasUserReacted, userAccountIDs } = EmojiUtils.getEmojiReactionDetails(emojiName, selectedReaction, accountID);
        const users = PersonalDetailsUtils.getPersonalDetailsByIDs({ accountIDs: userAccountIDs, currentUserAccountID: accountID, shouldChangeUserDisplayName: true });
        return {
            emojiName,
            emojiCodes,
            reactionCount,
            hasUserReacted,
            users,
            isReady: true,
        };
    }
    /**
     * Get the BasePopoverReactionList anchor position
     * We calculate the anchor coordinates from measureInWindow async method
     */
    function getReactionListMeasuredLocation() {
        return new Promise((resolve) => {
            const reactionListAnchor = reactionListRef.current;
            if (reactionListAnchor && 'measureInWindow' in reactionListAnchor) {
                reactionListAnchor.measureInWindow((x, y) => resolve({ x, y }));
            }
            else {
                resolve({ x: 0, y: 0 });
            }
        });
    }
    /**
     * Show the ReactionList modal popover.
     *
     * @param event - Object -  A press event.
     * @param reactionListAnchor - Element - reactionListAnchor
     */
    const showReactionList = (event, reactionListAnchor) => {
        // We get the cursor coordinates and the reactionListAnchor coordinates to calculate the popover position
        const nativeEvent = event?.nativeEvent || {};
        reactionListRef.current = reactionListAnchor;
        getReactionListMeasuredLocation().then(({ x, y }) => {
            setCursorRelativePosition({ horizontal: nativeEvent.pageX - x, vertical: nativeEvent.pageY - y });
            setPopoverAnchorPosition({
                horizontal: nativeEvent.pageX,
                vertical: nativeEvent.pageY,
            });
            setIsPopoverVisible(true);
        });
    };
    /**
     * Hide the ReactionList modal popover.
     */
    function hideReactionList() {
        setIsPopoverVisible(false);
    }
    (0, react_1.useEffect)(() => {
        const dimensionsEventListener = react_native_1.Dimensions.addEventListener('change', () => {
            if (!isPopoverVisible) {
                // If the popover is not visible, we don't need to update the component
                return;
            }
            getReactionListMeasuredLocation().then(({ x, y }) => {
                if (!x || !y) {
                    return;
                }
                setPopoverAnchorPosition({
                    horizontal: cursorRelativePosition.horizontal + x,
                    vertical: cursorRelativePosition.vertical + y,
                });
            });
        });
        return () => {
            dimensionsEventListener.remove();
        };
    }, [
        isPopoverVisible,
        reportActionID,
        preferredLocale,
        cursorRelativePosition.horizontal,
        cursorRelativePosition.vertical,
        popoverAnchorPosition.horizontal,
        popoverAnchorPosition.vertical,
    ]);
    (0, react_1.useEffect)(() => {
        if (!isPopoverVisible) {
            // If the popover is not visible, we don't need to update the component
            return;
        }
        // Hide the list when all reactions are removed
        const users = emojiReactions?.[emojiName]?.users;
        if (!users || Object.keys(users).length > 0) {
            return;
        }
        hideReactionList();
    }, [emojiReactions, emojiName, isPopoverVisible, reportActionID, preferredLocale]);
    return { isPopoverVisible, cursorRelativePosition, popoverAnchorPosition, getReactionInformation, hideReactionList, reactionListRef, showReactionList };
}
