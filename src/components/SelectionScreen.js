"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ErrorMessageRow_1 = require("./ErrorMessageRow");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const OfflineWithFeedback_1 = require("./OfflineWithFeedback");
const ScreenWrapper_1 = require("./ScreenWrapper");
const SelectionList_1 = require("./SelectionList");
function SelectionScreen({ displayName, title, headerContent, listEmptyContent, listFooterContent, sections, listItem, listItemWrapperStyle, initiallyFocusedOptionKey, onSelectRow, onBackButtonPress, policyID, accessVariants, featureName, shouldBeBlocked, connectionName, pendingAction, errors, errorRowStyles, onClose, shouldSingleExecuteRowSelect, headerTitleAlreadyTranslated, textInputLabel, textInputValue, onChangeText, shouldShowTextInput, shouldUpdateFocusedIndex = false, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const isConnectionEmpty = (0, isEmpty_1.default)(policy?.connections?.[connectionName]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={accessVariants} featureName={featureName} shouldBeBlocked={isConnectionEmpty || shouldBeBlocked}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={displayName}>
                <HeaderWithBackButton_1.default title={headerTitleAlreadyTranslated ?? (title ? translate(title) : '')} onBackButtonPress={onBackButtonPress}/>
                {headerContent}
                <OfflineWithFeedback_1.default pendingAction={pendingAction} style={[styles.flex1]} contentContainerStyle={[styles.flex1]} shouldDisableOpacity={!sections.length}>
                    <SelectionList_1.default onSelectRow={onSelectRow} sections={sections} ListItem={listItem} showScrollIndicator onChangeText={onChangeText} shouldShowTooltips={false} initiallyFocusedOptionKey={initiallyFocusedOptionKey} listEmptyContent={listEmptyContent} textInputLabel={textInputLabel} textInputValue={textInputValue} shouldShowTextInput={shouldShowTextInput} listFooterContent={listFooterContent} sectionListStyle={!!sections.length && [styles.flexGrow0]} shouldSingleExecuteRowSelect={shouldSingleExecuteRowSelect} shouldUpdateFocusedIndex={shouldUpdateFocusedIndex} isAlternateTextMultilineSupported listItemWrapperStyle={listItemWrapperStyle} addBottomSafeAreaPadding={!errors || (0, EmptyObject_1.isEmptyObject)(errors)}>
                        <ErrorMessageRow_1.default errors={errors} errorRowStyles={errorRowStyles} onClose={onClose}/>
                    </SelectionList_1.default>
                </OfflineWithFeedback_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
SelectionScreen.displayName = 'SelectionScreen';
exports.default = SelectionScreen;
