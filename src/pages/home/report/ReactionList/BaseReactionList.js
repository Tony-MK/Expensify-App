"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons_1 = require("@components/Icon/Expensicons");
const OptionRow_1 = require("@components/OptionRow");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const HeaderReactionList_1 = require("./HeaderReactionList");
const keyExtractor = (item, index) => `${item.login}+${index}`;
const getItemLayout = (data, index) => ({
    index,
    length: variables_1.default.listItemHeightNormal,
    offset: variables_1.default.listItemHeightNormal * index,
});
function BaseReactionList({ hasUserReacted = false, users, isVisible = false, emojiCodes, emojiCount, emojiName, onClose }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { hoveredComponentBG, reactionListContainer, reactionListContainerFixedWidth, pv2 } = (0, useThemeStyles_1.default)();
    if (!isVisible) {
        return null;
    }
    /**
     * Given an emoji item object, render a component based on its type.
     * Items with the code "SPACER" return nothing and are used to fill rows up to 8
     * so that the sticky headers function properly
     *
     */
    const renderItem = ({ item }) => (<OptionRow_1.default boldStyle style={{ maxWidth: variables_1.default.mobileResponsiveWidthBreakpoint }} hoverStyle={hoveredComponentBG} onSelectRow={() => {
            onClose?.();
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
                Navigation_1.default.navigate(ROUTES_1.default.PROFILE.getRoute(item.accountID));
            });
        }} option={{
            accountID: item.accountID,
            text: expensify_common_1.Str.removeSMSDomain(item.displayName ?? ''),
            alternateText: expensify_common_1.Str.removeSMSDomain(item.login ?? ''),
            participantsList: [item],
            icons: [
                {
                    id: item.accountID,
                    source: item.avatar ?? Expensicons_1.FallbackAvatar,
                    name: item.login ?? '',
                    type: CONST_1.default.ICON_TYPE_AVATAR,
                },
            ],
            keyForList: item.login ?? String(item.accountID),
        }}/>);
    return (<>
            <HeaderReactionList_1.default emojiName={emojiName} emojiCodes={emojiCodes} emojiCount={emojiCount} hasUserReacted={hasUserReacted}/>
            <react_native_1.FlatList data={users} renderItem={renderItem} keyExtractor={keyExtractor} getItemLayout={getItemLayout} contentContainerStyle={pv2} style={[reactionListContainer, !shouldUseNarrowLayout && reactionListContainerFixedWidth]}/>
        </>);
}
BaseReactionList.displayName = 'BaseReactionList';
exports.default = BaseReactionList;
