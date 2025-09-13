"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const ScreenWrapper_1 = require("./ScreenWrapper");
const ScrollView_1 = require("./ScrollView");
const Text_1 = require("./Text");
function ConnectionLayoutContent({ title, titleStyle, children, titleAlreadyTranslated }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<>
            {!!title && <Text_1.default style={[styles.pb5, titleStyle]}>{titleAlreadyTranslated ?? translate(title)}</Text_1.default>}
            {children}
        </>);
}
function ConnectionLayout({ displayName, headerTitle, children, title, headerSubtitle, policyID, accessVariants, featureName, contentContainerStyle, titleStyle, shouldIncludeSafeAreaPaddingBottom, connectionName, shouldUseScrollView = true, headerTitleAlreadyTranslated, titleAlreadyTranslated, shouldLoadForEmptyConnection = false, onBackButtonPress = () => Navigation_1.default.goBack(), shouldBeBlocked = false, }) {
    const { translate } = (0, useLocalize_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const isConnectionEmpty = (0, isEmpty_1.default)(policy?.connections?.[connectionName]);
    const renderSelectionContent = (0, react_1.useMemo)(() => (<ConnectionLayoutContent title={title} titleStyle={titleStyle} titleAlreadyTranslated={titleAlreadyTranslated}>
                {children}
            </ConnectionLayoutContent>), [title, titleStyle, children, titleAlreadyTranslated]);
    const shouldBlockByConnection = shouldLoadForEmptyConnection ? !isConnectionEmpty : isConnectionEmpty;
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={accessVariants} featureName={featureName} shouldBeBlocked={!!shouldBeBlocked || shouldBlockByConnection}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding includeSafeAreaPaddingBottom={!!shouldIncludeSafeAreaPaddingBottom} shouldEnableMaxHeight testID={displayName}>
                <HeaderWithBackButton_1.default title={headerTitleAlreadyTranslated ?? (headerTitle ? translate(headerTitle) : '')} subtitle={headerSubtitle} onBackButtonPress={onBackButtonPress}/>
                {shouldUseScrollView ? (<ScrollView_1.default contentContainerStyle={contentContainerStyle} addBottomSafeAreaPadding>
                        {renderSelectionContent}
                    </ScrollView_1.default>) : (<react_native_1.View style={contentContainerStyle}>{renderSelectionContent}</react_native_1.View>)}
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ConnectionLayout.displayName = 'ConnectionLayout';
exports.default = ConnectionLayout;
