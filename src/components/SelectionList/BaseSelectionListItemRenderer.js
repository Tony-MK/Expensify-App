"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Browser_1 = require("@libs/Browser");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
function BaseSelectionListItemRenderer({ ListItem, item, index, isFocused, isDisabled, showTooltip, canSelectMultiple, onLongPressRow, shouldSingleExecuteRowSelect, selectRow, onCheckboxPress, onDismissError, shouldPreventDefaultFocusOnSelectRow, rightHandSideComponent, isMultilineSupported, isAlternateTextMultilineSupported, alternateTextNumberOfLines, shouldIgnoreFocus, setFocusedIndex, normalizedIndex, shouldSyncFocus, wrapperStyle, titleStyles, singleExecution, titleContainerStyles, shouldUseDefaultRightHandSideCheckmark, canShowProductTrainingTooltip = true, userWalletTierName, isUserValidated, personalDetails, userBillingFundID, }) {
    const handleOnCheckboxPress = () => {
        if ((0, SearchUIUtils_1.isTransactionGroupListItemType)(item)) {
            return onCheckboxPress;
        }
        return onCheckboxPress ? () => onCheckboxPress(item) : undefined;
    };
    return (<>
            <ListItem item={item} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onLongPressRow={onLongPressRow} onSelectRow={() => {
            if (shouldSingleExecuteRowSelect) {
                singleExecution(() => selectRow(item, index))();
            }
            else {
                selectRow(item, index);
            }
        }} onCheckboxPress={handleOnCheckboxPress()} onDismissError={() => onDismissError?.(item)} shouldPreventDefaultFocusOnSelectRow={shouldPreventDefaultFocusOnSelectRow} 
    // We're already handling the Enter key press in the useKeyboardShortcut hook, so we don't want the list item to submit the form
    shouldPreventEnterKeySubmit rightHandSideComponent={rightHandSideComponent} keyForList={item.keyForList ?? ''} isMultilineSupported={isMultilineSupported} isAlternateTextMultilineSupported={isAlternateTextMultilineSupported} alternateTextNumberOfLines={alternateTextNumberOfLines} onFocus={(event) => {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            if (shouldIgnoreFocus || isDisabled) {
                return;
            }
            // Prevent unexpected scrolling on mobile Chrome after the context menu closes by ignoring programmatic focus not triggered by direct user interaction.
            if ((0, Browser_1.isMobileChrome)() && event.nativeEvent && !event.nativeEvent.sourceCapabilities) {
                return;
            }
            setFocusedIndex(normalizedIndex);
        }} shouldSyncFocus={shouldSyncFocus} wrapperStyle={wrapperStyle} titleStyles={titleStyles} titleContainerStyles={titleContainerStyles} shouldUseDefaultRightHandSideCheckmark={shouldUseDefaultRightHandSideCheckmark} canShowProductTrainingTooltip={canShowProductTrainingTooltip} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} userBillingFundID={userBillingFundID} index={index}/>
            {item.footerContent && item.footerContent}
        </>);
}
BaseSelectionListItemRenderer.displayName = 'BaseSelectionListItemRenderer';
exports.default = BaseSelectionListItemRenderer;
