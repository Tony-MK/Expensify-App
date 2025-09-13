"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Performance_1 = require("@libs/Performance");
const Session_1 = require("@userActions/Session");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
const SearchRouterContext_1 = require("./SearchRouterContext");
function SearchButton({ style, shouldUseAutoHitSlop = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { openSearchRouter } = (0, SearchRouterContext_1.useSearchRouterContext)();
    const pressableRef = (0, react_1.useRef)(null);
    return (<Tooltip_1.default text={translate('common.search')}>
            <Pressable_1.PressableWithoutFeedback ref={pressableRef} testID="searchButton" accessibilityLabel={translate('common.search')} style={[styles.flexRow, styles.touchableButtonImage, style]} shouldUseAutoHitSlop={shouldUseAutoHitSlop} 
    // eslint-disable-next-line react-compiler/react-compiler
    onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => {
            pressableRef?.current?.blur();
            Timing_1.default.start(CONST_1.default.TIMING.OPEN_SEARCH);
            Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_SEARCH);
            openSearchRouter();
        })}>
                <Icon_1.default src={Expensicons.MagnifyingGlass} fill={theme.icon}/>
            </Pressable_1.PressableWithoutFeedback>
        </Tooltip_1.default>);
}
SearchButton.displayName = 'SearchButton';
exports.default = SearchButton;
