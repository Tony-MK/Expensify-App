"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var TagPicker_1 = require("@components/TagPicker");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var IOUUtils_1 = require("@libs/IOUUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function DebugTagPicker(_a) {
    var policyID = _a.policyID, _b = _a.tagName, tagName = _b === void 0 ? '' : _b, onSubmit = _a.onSubmit;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _c = (0, react_1.useState)(tagName), newTagName = _c[0], setNewTagName = _c[1];
    var selectedTags = (0, react_1.useMemo)(function () { return (0, TransactionUtils_1.getTagArrayFromName)(newTagName); }, [newTagName]);
    var policyTags = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(policyID), { canBeMissing: true })[0];
    var policyTagLists = (0, react_1.useMemo)(function () { return (0, PolicyUtils_1.getTagLists)(policyTags); }, [policyTags]);
    var hasMultipleTagLists = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), { canBeMissing: true, selector: function (policy) { return policy === null || policy === void 0 ? void 0 : policy.hasMultipleTagLists; } })[0];
    var updateTagName = (0, react_1.useCallback)(function (index) {
        return function (_a) {
            var text = _a.text;
            var newTag = text === selectedTags.at(index) ? undefined : text;
            var updatedTagName = (0, IOUUtils_1.insertTagIntoTransactionTagsString)(newTagName, newTag !== null && newTag !== void 0 ? newTag : '', index, hasMultipleTagLists !== null && hasMultipleTagLists !== void 0 ? hasMultipleTagLists : false);
            if (policyTagLists.length === 1) {
                return onSubmit({ text: updatedTagName });
            }
            setNewTagName(updatedTagName);
        };
    }, [newTagName, onSubmit, policyTagLists.length, selectedTags, hasMultipleTagLists]);
    var submitTag = (0, react_1.useCallback)(function () {
        onSubmit({ text: newTagName });
    }, [newTagName, onSubmit]);
    return (<react_native_1.View style={styles.gap5}>
            <react_native_1.View style={styles.gap5}>
                {policyTagLists.map(function (_a, index) {
            var _b;
            var name = _a.name;
            return (<react_native_1.View key={name}>
                        {policyTagLists.length > 1 && <Text_1.default style={[styles.textLabelSupportingNormal, styles.ph5, styles.mb3]}>{name}</Text_1.default>}
                        <TagPicker_1.default policyID={policyID} selectedTag={(_b = selectedTags.at(index)) !== null && _b !== void 0 ? _b : ''} tagListName={name} tagListIndex={index} shouldOrderListByTagName onSubmit={updateTagName(index)}/>
                    </react_native_1.View>);
        })}
            </react_native_1.View>
            {policyTagLists.length > 1 && (<react_native_1.View style={styles.ph5}>
                    <Button_1.default success large text={translate('common.save')} onPress={submitTag}/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
exports.default = DebugTagPicker;
