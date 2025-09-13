"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const TagPicker_1 = require("@components/TagPicker");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOUUtils_1 = require("@libs/IOUUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function DebugTagPicker({ policyID, tagName = '', onSubmit }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [newTagName, setNewTagName] = (0, react_1.useState)(tagName);
    const selectedTags = (0, react_1.useMemo)(() => (0, TransactionUtils_1.getTagArrayFromName)(newTagName), [newTagName]);
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const policyTagLists = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagLists)(policyTags), [policyTags]);
    const [hasMultipleTagLists] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true, selector: (policy) => policy?.hasMultipleTagLists });
    const updateTagName = (0, react_1.useCallback)((index) => ({ text }) => {
        const newTag = text === selectedTags.at(index) ? undefined : text;
        const updatedTagName = (0, IOUUtils_1.insertTagIntoTransactionTagsString)(newTagName, newTag ?? '', index, hasMultipleTagLists ?? false);
        if (policyTagLists.length === 1) {
            return onSubmit({ text: updatedTagName });
        }
        setNewTagName(updatedTagName);
    }, [newTagName, onSubmit, policyTagLists.length, selectedTags, hasMultipleTagLists]);
    const submitTag = (0, react_1.useCallback)(() => {
        onSubmit({ text: newTagName });
    }, [newTagName, onSubmit]);
    return (<react_native_1.View style={styles.gap5}>
            <react_native_1.View style={styles.gap5}>
                {policyTagLists.map(({ name }, index) => (<react_native_1.View key={name}>
                        {policyTagLists.length > 1 && <Text_1.default style={[styles.textLabelSupportingNormal, styles.ph5, styles.mb3]}>{name}</Text_1.default>}
                        <TagPicker_1.default policyID={policyID} selectedTag={selectedTags.at(index) ?? ''} tagListName={name} tagListIndex={index} shouldOrderListByTagName onSubmit={updateTagName(index)}/>
                    </react_native_1.View>))}
            </react_native_1.View>
            {policyTagLists.length > 1 && (<react_native_1.View style={styles.ph5}>
                    <Button_1.default success large text={translate('common.save')} onPress={submitTag}/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
exports.default = DebugTagPicker;
